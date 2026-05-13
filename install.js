#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

// ── Constants ────────────────────────────────────────────────────────────────

const PACKAGE_ROOT = __dirname;
const VERSION = require('./package.json').version;

const DIRS_TO_COPY = [
  '.claude-plugin',
  'skills',
  'workflows',
  'templates',
  'references',
  'playbooks',
  'gates',
  'bin',
  'agents',
];

const FILES_TO_COPY = [
  'settings.json',
];

// ── Runtime Selection ─────────────────────────────────────────────────────────

const RUNTIME_MENU = ['claude', 'codex', 'cursor', 'windsurf', 'gemini'];

/**
 * Parse user input from the runtime selection prompt.
 * @param {string} input - Raw user input (e.g., '1,3' or '6')
 * @returns {string[]|null} Array of runtime names, or null if invalid
 */
function parseRuntimeChoices(input) {
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (trimmed === '6') return [...RUNTIME_MENU];
  if (trimmed === '7') return ['custom'];

  const parts = trimmed.split(',').map(s => s.trim());
  const names = new Set();
  for (const part of parts) {
    const n = parseInt(part, 10);
    if (isNaN(n) || n < 1 || n > 7) return null;
    if (n === 7) return ['custom'];
    names.add(RUNTIME_MENU[n - 1]);
  }
  return [...names];
}

/**
 * Build the install target map for all known runtimes.
 * @param {string} [homeDir] - Home directory (injectable for tests)
 * @returns {Object.<string, {label, dir, parentDir, register, partial}>}
 */
function buildRuntimeTargets(homeDir = os.homedir()) {
  return {
    claude: {
      label: 'Claude Code',
      dir: path.join(homeDir, '.claude', 'plugins', 'taketomarket'),
      parentDir: path.join(homeDir, '.claude'),
      register: true,
      partial: false,
    },
    codex: {
      label: 'Codex (OpenAI)',
      dir: path.join(homeDir, '.codex', 'plugins', 'taketomarket'),
      parentDir: path.join(homeDir, '.codex'),
      register: false,
      partial: true,
    },
    cursor: {
      label: 'Cursor',
      dir: path.join(homeDir, '.cursor', 'rules'),
      parentDir: path.join(homeDir, '.cursor'),
      register: false,
      partial: true,
    },
    windsurf: {
      label: 'Windsurf',
      dir: path.join(homeDir, '.codeium', 'windsurf'),
      parentDir: path.join(homeDir, '.codeium'),
      register: false,
      partial: true,
    },
    gemini: {
      label: 'Gemini CLI',
      dir: path.join(homeDir, '.gemini'),
      parentDir: path.join(homeDir, '.gemini'),
      register: false,
      partial: true,
    },
  };
}

// ── Runtime detection ────────────────────────────────────────────────────────

/**
 * Detect target runtime from CLI args or environment sniffing.
 * Priority: --runtime flag > .claude/ dir > .codex/ dir > default claude
 * @param {string[]} args - CLI arguments
 * @returns {string} 'claude' or 'codex'
 */
function detectRuntime(args) {
  // Check --runtime flag
  const runtimeIdx = args.indexOf('--runtime');
  if (runtimeIdx !== -1 && runtimeIdx + 1 < args.length) {
    const value = args[runtimeIdx + 1].toLowerCase();
    if (value === 'claude' || value === 'codex') {
      return value;
    }
    console.warn(`Warning: Unknown runtime "${args[runtimeIdx + 1]}". Defaulting to claude.`);
    return 'claude';
  }

  // Check for .claude/ directory
  if (dirExists(path.join(os.homedir(), '.claude'))) {
    return 'claude';
  }

  // Check for .codex/ directory
  if (dirExists(path.join(os.homedir(), '.codex'))) {
    return 'codex';
  }

  // Default
  console.log('Note: Defaulting to Claude Code. Use --runtime codex if using Codex.');
  return 'claude';
}

// ── File helpers ─────────────────────────────────────────────────────────────

/**
 * Check if a path exists and is a directory.
 * @param {string} p - Path to check
 * @returns {boolean}
 */
function dirExists(p) {
  try {
    return fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
}

/**
 * Check if a path exists and is a file.
 * @param {string} p - Path to check
 * @returns {boolean}
 */
function fileExists(p) {
  try {
    return fs.statSync(p).isFile();
  } catch {
    return false;
  }
}

/**
 * Recursively copy a directory. Skips symlinks with a warning.
 * @param {string} src - Source directory path
 * @param {string} dest - Destination directory path
 */
function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isSymbolicLink()) {
      console.warn(`  Warning: Skipping symlink ${entry.name}`);
      continue;
    }

    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else if (entry.isFile()) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// ── Plugin Registration ───────────────────────────────────────────────────────

/**
 * Register taketomarket in Claude Code's installed_plugins.json.
 * Preserves existing plugins. Atomic write (tmp → rename).
 * @param {string} installPath - Absolute path to the installed plugin directory
 * @param {string} version - Plugin version string (e.g., '2.0.0')
 * @param {string} [homeDir] - Home directory (defaults to os.homedir(); injectable for tests)
 */
function registerPlugin(installPath, version, homeDir = os.homedir()) {
  const registryPath = path.join(homeDir, '.claude', 'plugins', 'installed_plugins.json');
  const pluginsDir = path.dirname(registryPath);

  let registry = { version: 2, plugins: {} };
  if (fileExists(registryPath)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
      registry = parsed;
      if (!registry.plugins) registry.plugins = {};
      if (!registry.version) registry.version = 2;
    } catch {
      fs.renameSync(registryPath, registryPath + '.bak');
      console.warn('  Warning: installed_plugins.json was corrupted. Backed up to .bak and recreated.');
      registry = { version: 2, plugins: {} };
    }
  }

  const now = new Date().toISOString();
  const existing = (registry.plugins['taketomarket@npm'] || [])[0];

  registry.plugins['taketomarket@npm'] = [{
    scope: 'user',
    installPath,
    version,
    installedAt: existing?.installedAt ?? now,
    lastUpdated: now,
    gitCommitSha: null,
  }];

  const tmpPath = registryPath + '.tmp';
  fs.mkdirSync(pluginsDir, { recursive: true });
  fs.writeFileSync(tmpPath, JSON.stringify(registry, null, 2) + '\n', 'utf8');
  fs.renameSync(tmpPath, registryPath);

  console.log('  Registered in installed_plugins.json');
}

// ── Skill Introspection ───────────────────────────────────────────────────────

/**
 * Read skill names and descriptions from skills/ subdirectory of packageRoot.
 * Parses the first content line of the 'description:' YAML frontmatter field.
 * @param {string} packageRoot - Root of the npm package (use PACKAGE_ROOT in production)
 * @returns {Array<{name: string, description: string}>} Sorted by name
 */
function readSkillDescriptions(packageRoot) {
  const skillsDir = path.join(packageRoot, 'skills');
  if (!dirExists(skillsDir)) return [];

  const results = [];
  try {
    const entries = fs.readdirSync(skillsDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const skillFile = path.join(skillsDir, entry.name, 'SKILL.md');
      if (!fileExists(skillFile)) continue;

      const content = fs.readFileSync(skillFile, 'utf8');
      const descMatch = content.match(/^description:\s*>\s*\n((?:[ \t]+.+\n?)+)/m);
      let description = '';
      if (descMatch) {
        description = descMatch[1].split('\n')[0].trim().replace(/\.$/, '') + '.';
      } else {
        const inlineMatch = content.match(/^description:\s*(.+)$/m);
        if (inlineMatch) description = inlineMatch[1].trim();
      }

      results.push({ name: entry.name, description });
    }
  } catch {
    // ignore — skills dir may be empty or unreadable
  }

  return results.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Detect which known runtimes are installed by checking their parent directories.
 * @param {string} [homeDir]
 * @returns {string[]} Names of detected runtimes (subset of RUNTIME_MENU)
 */
function getInstalledRuntimes(homeDir = os.homedir()) {
  const targets = buildRuntimeTargets(homeDir);
  return RUNTIME_MENU.filter(name => {
    const t = targets[name];
    return t.parentDir && dirExists(t.parentDir);
  });
}

// ── Validation ───────────────────────────────────────────────────────────────

/**
 * Validate an installation directory has all required components.
 * @param {string} targetDir - Directory to validate
 * @returns {Array<{name: string, status: string}>} Validation results
 */
function validateInstall(targetDir) {
  const results = [];

  // Check each required directory
  for (const dir of DIRS_TO_COPY) {
    results.push({
      name: dir,
      status: dirExists(path.join(targetDir, dir)) ? 'pass' : 'fail',
    });
  }

  // Check plugin.json exists
  results.push({
    name: 'plugin.json',
    status: fileExists(path.join(targetDir, '.claude-plugin', 'plugin.json')) ? 'pass' : 'fail',
  });

  // Check at least 5 SKILL.md files exist under skills/
  const skillsDir = path.join(targetDir, 'skills');
  let skillCount = 0;
  if (dirExists(skillsDir)) {
    try {
      const skillDirs = fs.readdirSync(skillsDir, { withFileTypes: true });
      for (const entry of skillDirs) {
        if (entry.isDirectory()) {
          const skillFile = path.join(skillsDir, entry.name, 'SKILL.md');
          if (fileExists(skillFile)) {
            skillCount++;
          }
        }
      }
    } catch {
      // ignore
    }
  }
  results.push({
    name: `skills (${skillCount} SKILL.md files)`,
    status: skillCount >= 5 ? 'pass' : 'fail',
  });

  return results;
}

// ── Main ─────────────────────────────────────────────────────────────────────

function main() {
  const args = process.argv.slice(2);

  // Check for --version / -v (D-10, D-11) — short-circuit BEFORE detectRuntime/validation.
  if (args.includes('--version') || args.includes('-v')) {
    process.stdout.write(`${VERSION}\n`);
    process.exit(0);
  }

  // Check for --help
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
takeToMarket installer

Usage: npx taketomarket [options]

Options:
  --runtime <claude|codex>  Target runtime (default: auto-detect)
  --dry-run                 Validate source without writing files
  --help, -h                Show this help message
`);
    process.exit(0);
  }

  const DRY_RUN = args.includes('--dry-run');
  const runtime = detectRuntime(args);

  // Compute target directory using path.resolve for safety (T-10-01)
  const runtimeDir = runtime === 'codex' ? '.codex' : '.claude';
  const targetDir = path.resolve(os.homedir(), runtimeDir, 'plugins', 'taketomarket');

  // Verify targetDir is within home directory (T-10-01, T-10-03)
  const homeDir = os.homedir();
  if (!targetDir.startsWith(homeDir + path.sep)) {
    console.error('Error: Target directory resolves outside home directory. Aborting.');
    process.exit(1);
  }

  console.log('');
  console.log(`takeToMarket installer v${VERSION}`);
  console.log(`Runtime: ${runtime}`);
  console.log(`Target: ${targetDir}`);
  console.log('');

  if (DRY_RUN) {
    // Validate source completeness without writing
    console.log('[DRY RUN] Validating source package...');
    console.log('');
    const results = validateInstall(PACKAGE_ROOT);
    printResults(results);
    console.log('');
    console.log('[DRY RUN] No files written.');
    process.exit(0);
  }

  // Check for existing installation — remove stale files before copying (CR-02)
  if (dirExists(targetDir)) {
    console.log('Existing installation found. Removing before reinstall...');
    fs.rmSync(targetDir, { recursive: true, force: true });
    console.log('');
  }

  // Copy directories
  for (const dir of DIRS_TO_COPY) {
    const srcDir = path.join(PACKAGE_ROOT, dir);
    if (dirExists(srcDir)) {
      console.log(`  Copying ${dir}/`);
      copyDirSync(srcDir, path.join(targetDir, dir));
    } else {
      console.log(`  Skipping ${dir}/ (not found in package)`);
    }
  }

  // Copy individual files
  for (const file of FILES_TO_COPY) {
    const srcFile = path.join(PACKAGE_ROOT, file);
    if (fileExists(srcFile)) {
      console.log(`  Copying ${file}`);
      const destFile = path.join(targetDir, file);
      fs.mkdirSync(path.dirname(destFile), { recursive: true });
      fs.copyFileSync(srcFile, destFile);
    } else {
      console.log(`  Skipping ${file} (not found in package)`);
    }
  }

  console.log('');

  // Validate
  const results = validateInstall(targetDir);
  printResults(results);

  const failures = results.filter(r => r.status === 'fail');
  console.log('');

  if (failures.length > 0) {
    console.log('Installation incomplete. Some components missing.');
    process.exit(1);
  }

  // Register with Claude Code
  registerPlugin(targetDir, VERSION);

  console.log('Installation complete!');
  console.log('');
  console.log('Quick start:');
  console.log('  1. Open a project directory');
  console.log('  2. Run /ttm-init to set up your marketing workspace');
  console.log('  3. Run /ttm-new-campaign <name> to start your first campaign');
  console.log('');
  console.log('Documentation: https://github.com/ranjanrishikesh/takeToMarket#readme');
}

/**
 * Print validation results as a table.
 * @param {Array<{name: string, status: string}>} results
 */
function printResults(results) {
  console.log('Validation:');
  for (const r of results) {
    const label = r.status === 'pass' ? '[PASS]' : '[FAIL]';
    console.log(`  ${label} ${r.name}`);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  main,
  detectRuntime,
  validateInstall,
  copyDirSync,
  registerPlugin,
  readSkillDescriptions,
  getInstalledRuntimes,
  dirExists,
  fileExists,
  printResults,
  parseRuntimeChoices,
  buildRuntimeTargets,
  DIRS_TO_COPY,
  FILES_TO_COPY,
  RUNTIME_MENU,
};
