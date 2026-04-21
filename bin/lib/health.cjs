/**
 * Health -- Directory integrity validation for ttm-tools.cjs
 *
 * Zero npm dependencies. Uses only Node.js built-ins: fs, path.
 * Depends on: ./core.cjs for output, error, safeReadFile, parseFrontmatter
 *
 * Exports: cmdHealth, cmdInit
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { output, safeReadFile, parseFrontmatter } = require('./core.cjs');

/**
 * Expected reference files in .marketing/ directory.
 */
const REFERENCE_FILES = [
  'POSITIONING.md',
  'BRAND.md',
  'ICP.md',
  'CHANNELS.md',
  'STATE.md',
  'CALENDAR.md',
  'COMPETITORS.md',
  'METRICS.md',
  'LEARNINGS.md',
];

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
 * Validate .marketing/ directory structure.
 *
 * Checks:
 * 1. .marketing/ directory exists
 * 2. .marketing/CAMPAIGNS/ directory exists
 * 3. Each expected reference file exists
 * 4. STATE.md has valid frontmatter (parseable)
 *
 * healthy = true when .marketing/ and CAMPAIGNS/ both exist.
 * Reference files use "missing" status (expected before /ttm-init runs).
 *
 * @param {boolean} raw - Whether to output raw summary string
 */
function cmdHealth(raw) {
  const marketingDir = path.resolve(process.cwd(), '.marketing');
  const campaignsDir = path.resolve(marketingDir, 'CAMPAIGNS');
  const checks = [];

  // Check .marketing/ directory
  const marketingExists = dirExists(marketingDir);
  checks.push({
    name: 'marketing_dir',
    status: marketingExists ? 'pass' : 'fail',
    path: '.marketing/',
  });

  // Check CAMPAIGNS/ directory
  const campaignsExists = dirExists(campaignsDir);
  checks.push({
    name: 'campaigns_dir',
    status: campaignsExists ? 'pass' : 'fail',
    path: '.marketing/CAMPAIGNS/',
  });

  // Check each reference file
  for (const file of REFERENCE_FILES) {
    const filePath = path.resolve(marketingDir, file);
    const name = file.toLowerCase().replace('.md', '_md');
    if (fileExists(filePath)) {
      // Extra validation for STATE.md -- check frontmatter is parseable
      if (file === 'STATE.md') {
        const content = safeReadFile(filePath);
        const { frontmatter } = parseFrontmatter(content || '');
        const isValid = Object.keys(frontmatter).length > 0;
        checks.push({
          name,
          status: isValid ? 'pass' : 'fail',
          path: `.marketing/${file}`,
          detail: isValid ? undefined : 'frontmatter unparseable',
        });
      } else {
        checks.push({ name, status: 'pass', path: `.marketing/${file}` });
      }
    } else {
      checks.push({ name, status: 'missing', path: `.marketing/${file}` });
    }
  }

  const passed = checks.filter(c => c.status === 'pass').length;
  const total = checks.length;
  // healthy = marketing dir + campaigns dir both exist
  const healthy = marketingExists && campaignsExists;

  const result = {
    healthy,
    checks,
    summary: `${passed}/${total} checks passed`,
  };

  if (raw) {
    const label = healthy ? 'HEALTHY' : 'UNHEALTHY';
    const issues = checks.filter(c => c.status === 'fail').length;
    if (healthy) {
      output(result, true, `${label}: ${passed}/${total} checks passed`);
    } else {
      output(result, true, `${label}: ${issues} issue(s) found`);
    }
  } else {
    output(result, false);
  }
}

/**
 * Lightweight init check.
 * Returns: { initialized, marketing_dir, reference_files_count, total_expected }
 *
 * @param {boolean} raw - Whether to output raw summary string
 */
function cmdInit(raw) {
  const marketingDir = path.resolve(process.cwd(), '.marketing');
  const marketingExists = dirExists(marketingDir);

  let refCount = 0;
  if (marketingExists) {
    for (const file of REFERENCE_FILES) {
      if (fileExists(path.resolve(marketingDir, file))) {
        refCount++;
      }
    }
  }

  const totalExpected = REFERENCE_FILES.length;
  const initialized = marketingExists && refCount >= totalExpected;

  const result = {
    initialized,
    marketing_dir: marketingExists,
    reference_files_count: refCount,
    total_expected: totalExpected,
  };

  output(result, raw, initialized ? 'initialized' : 'not initialized');
}

module.exports = {
  cmdHealth,
  cmdInit,
};
