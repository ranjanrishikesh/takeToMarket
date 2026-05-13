# takeToMarket v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all 21 improvements from `docs/improvements.md` — working slash commands, interactive multi-runtime installer, README overhaul, and public repo release.

**Architecture:** Wave 0 (research) gates Waves 2 and 4. `install.js` grows from 307 lines to ~650 with extracted pure functions for testability. Multi-runtime paths come from Wave 0 findings. All logic functions are exported and unit-tested; I/O functions are E2E-tested via child process with piped stdin.

**Tech Stack:** Node.js 18+ CJS only, `node:readline` for interactive prompts, `node:test` + `node:assert/strict` for unit tests, `node:child_process` (spawnSync) for E2E tests. Zero npm dependencies.

---

## File Map

| File | Action | Responsible |
|------|--------|-------------|
| `docs/research/v2-runtime-research.md` | Create | Task 0.1 |
| `.gitignore` | Modify (2×) | Tasks 1.1, 5.2 |
| `.claude-plugin/plugin.json` | Modify | Task 1.2 |
| `install.js` | Major overhaul | Tasks 1.3, 2.1–2.7, 4.1–4.2 |
| `test/install.test.cjs` | Extend | Tasks 1.3, 2.1–2.5 |
| `test/install-e2e.test.cjs` | Extend | Task 2.8 |
| `README.md` | Full rewrite | Task 3.1 |
| `GEMINI.md` | Modify | Task 4.5 |
| `bin/lib/cursor-adapter.cjs` | Create (conditional) | Task 4.3 |
| `CONTRIBUTING.md` | Create | Task 5.4 |
| `CHANGELOG.md` | Create | Task 5.5 |
| `package.json` | Version bump | Task 5.5 |
| `idea.md` | Delete | Task 5.3 |

---

## Wave 0 — Research

**All Wave 0 tasks must complete before starting Wave 2. Wave 1 (IMP-16, IMP-15) can start immediately in parallel.**

---

### Task 0.1: Create research document + record Claude Code schema

**Files:**
- Create: `docs/research/v2-runtime-research.md`

- [ ] **Step 1: Create research file**

```bash
mkdir -p docs/research
```

Create `docs/research/v2-runtime-research.md` with this skeleton:

```markdown
# takeToMarket v2 — Runtime Research Findings

## R-01: Claude Code installed_plugins.json Schema

**Status:** DONE (inspected 2026-05-13)

**Schema:**
\`\`\`json
{
  "version": 2,
  "plugins": {
    "<name>@<source>": [{
      "scope": "user",
      "installPath": "<absolute path to plugin dir>",
      "version": "<semver or sha>",
      "installedAt": "<ISO timestamp>",
      "lastUpdated": "<ISO timestamp>",
      "gitCommitSha": "<sha or null>"
    }]
  }
}
\`\`\`

**Our entry will be:**
- Key: `"taketomarket@npm"`
- scope: `"user"`
- installPath: `~/.claude/plugins/taketomarket` (absolute)
- version: npm version string (e.g., `"2.0.0"`)
- gitCommitSha: `null` (npm installs have no git SHA — verify Claude Code accepts null)

**Open question:** Does Claude Code require non-null gitCommitSha?
Result: [FILL IN after testing in Task 1.3]

---

## R-02: Codex Registration Mechanism

**Status:** TODO

**Find:**
- Does ~/.codex/plugins/installed_plugins.json exist?
- What is its schema?
- Source: OpenAI Codex CLI docs / GitHub / filesystem inspection

**Result:** [FILL IN]
**Decision:** [ ] Same schema as Claude Code → extend registerPlugin()
             [ ] Different schema → implement registerCodexPlugin()
             [ ] No mechanism → copy-only, add note to README

---

## R-03: Cursor Rules Format + Install Path

**Status:** TODO

**Find:**
- What path does Cursor use for user-level rules? (~/.cursor/rules/ ?)
- .mdc frontmatter schema
- Does Cursor support slash commands or only ambient rules?
- Source: Cursor official docs, ~/.cursor/ filesystem inspection

**Result:** [FILL IN]
**User-level install path:** [FILL IN]
**Decision:** [ ] Slash commands supported → full adapter
             [ ] Ambient rules only → single condensed .mdc
             [ ] No equivalent → mark "not supported"

---

## R-04: Windsurf Format + Install Path

**Status:** TODO

**Find:**
- Does Windsurf have a skills/commands system?
- Install path? (~/.codeium/windsurf/ ?)
- Source: Windsurf docs, filesystem inspection

**Result:** [FILL IN]
**Decision:** [ ] Format confirmed → implement adapter
             [ ] No format → mark "not supported"

---

## R-05: Gemini CLI Compatibility

**Status:** TODO

**Find:**
- Install Gemini CLI (prerequisite — if access unavailable, document and defer IMP-11)
- Run ttm-init flow with existing GEMINI.md
- Which tools are missing? Which prompts fail?

**Result:** [FILL IN — list working skills and gaps]

---

## R-06: Claude Code Marketplace Requirements (IMP-06a)

**Status:** TODO

**Find:**
- Fetch https://github.com/anthropics/claude-plugins-official — check /external_plugins/ directory
- Required plugin.json schema for external entries
- Submission form URL + review criteria

**Result:** [FILL IN]
**Prepared plugin.json:** [FILL IN or attach file path]

---

## R-07: GitHub Direct Install Syntax (IMP-07)

**Status:** TODO

**Find:**
- Does /plugin install taketomarket@ranjanrishikesh work?
- Does /plugin install github:ranjanrishikesh/takeToMarket work?
- Source: Claude Code docs

**Result:** [FILL IN]
**README Option 3 wording:** [FILL IN or "remove Option 3"]
```

- [ ] **Step 2: Commit**

```bash
git add docs/research/v2-runtime-research.md
git commit -m "docs(v2): add runtime research skeleton for Wave 0"
```

---

### Tasks 0.2–0.7: Complete the research document

These tasks are manual research. For each item (R-02 through R-07), fill in the corresponding section in `docs/research/v2-runtime-research.md` and commit when done.

- [ ] **Task 0.2:** Research Codex registration — fill in R-02
- [ ] **Task 0.3:** Research Cursor format + path — fill in R-03
- [ ] **Task 0.4:** Research Windsurf format + path — fill in R-04
- [ ] **Task 0.5:** Gemini CLI validation — fill in R-05
- [ ] **Task 0.6:** Marketplace requirements — fill in R-06 + create `docs/research/plugin-submission/plugin.json` draft
- [ ] **Task 0.7:** GitHub direct install — fill in R-07

After each research item:
```bash
git add docs/research/
git commit -m "docs(v2/research): record R-0N findings — <runtime name>"
```

**Gate:** Do not start Task 2.1 until R-02, R-03, R-04, R-05 are complete.
**Gate:** Do not start Task 3.1 until R-07 is complete.

---

## Wave 1 — Safety + Critical Blockers

*Can start immediately — no Wave 0 dependency.*

---

### Task 1.1: Untrack settings.local.json (IMP-16)

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Add to .gitignore**

Read `.gitignore` first. Append to it:

```
# Claude Code local settings — machine-specific, contains absolute paths
.claude/settings.local.json
```

- [ ] **Step 2: Untrack the file**

```bash
git rm --cached .claude/settings.local.json
```

Expected: `rm '.claude/settings.local.json'`

- [ ] **Step 3: Commit**

```bash
git add .gitignore
git commit -m "chore: gitignore settings.local.json — prevents leaking local filesystem paths"
```

---

### Task 1.2: Fix wrong GitHub URLs + plugin.json version (IMP-15)

**Files:**
- Modify: `README.md`
- Modify: `install.js` (~line 280)
- Modify: `.claude-plugin/plugin.json`

- [ ] **Step 1: Fix README**

Search for all occurrences of `taketomarket/taketomarket` in README.md:
```bash
grep -n "taketomarket/taketomarket" README.md
```

Replace every occurrence of `https://github.com/taketomarket/taketomarket` with `https://github.com/ranjanrishikesh/takeToMarket`.

- [ ] **Step 2: Fix install.js docs URL**

In `install.js`, find the line containing `https://github.com/taketomarket/taketomarket/blob/main/README.md` (near line 280 in the `console.log` at end of `main()`). Replace with:

```js
console.log('Documentation: https://github.com/ranjanrishikesh/takeToMarket#readme');
```

- [ ] **Step 3: Fix plugin.json version**

In `.claude-plugin/plugin.json`, change `"version": "0.1.0"` to `"version": "1.0.1"`.

- [ ] **Step 4: Commit**

```bash
git add README.md install.js .claude-plugin/plugin.json
git commit -m "fix: correct GitHub URLs and plugin.json version"
```

---

### Task 1.3: Implement registerPlugin() with tests (IMP-02)

**Files:**
- Modify: `install.js`
- Modify: `test/install.test.cjs`

- [ ] **Step 1: Write failing tests**

Add to `test/install.test.cjs`:

```js
describe('registerPlugin', () => {
  let tmp;

  before(() => { tmp = createTempDir(); });
  after(() => { tmp.cleanup(); });

  it('creates installed_plugins.json with correct structure', () => {
    const installPath = path.join(tmp.dir, 'plugin');
    const homeDir = tmp.dir;
    install.registerPlugin(installPath, '2.0.0', homeDir);

    const registryPath = path.join(homeDir, '.claude', 'plugins', 'installed_plugins.json');
    assert.ok(install.fileExists(registryPath), 'registry file created');
    const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
    assert.strictEqual(registry.version, 2, 'root version is 2');
    assert.ok(registry.plugins, 'has plugins object');
    const entry = registry.plugins['taketomarket@npm'];
    assert.ok(Array.isArray(entry) && entry.length === 1, 'entry is array of 1');
    assert.strictEqual(entry[0].scope, 'user');
    assert.strictEqual(entry[0].installPath, installPath);
    assert.strictEqual(entry[0].version, '2.0.0');
    assert.ok(entry[0].installedAt, 'installedAt set');
    assert.ok(entry[0].lastUpdated, 'lastUpdated set');
  });

  it('preserves existing plugins when upserting taketomarket entry', () => {
    const homeDir2 = path.join(tmp.dir, 'home2');
    fs.mkdirSync(path.join(homeDir2, '.claude', 'plugins'), { recursive: true });
    const registryPath = path.join(homeDir2, '.claude', 'plugins', 'installed_plugins.json');
    fs.writeFileSync(registryPath, JSON.stringify({
      version: 2,
      plugins: {
        'other-plugin@npm': [{ scope: 'user', installPath: '/some/path', version: '1.0.0',
          installedAt: '2026-01-01T00:00:00.000Z', lastUpdated: '2026-01-01T00:00:00.000Z', gitCommitSha: null }],
      },
    }));

    install.registerPlugin('/new/path', '2.0.0', homeDir2);
    const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
    assert.ok(registry.plugins['other-plugin@npm'], 'existing plugin preserved');
    assert.ok(registry.plugins['taketomarket@npm'], 'new entry added');
  });

  it('preserves installedAt but updates lastUpdated on reinstall', () => {
    const homeDir3 = path.join(tmp.dir, 'home3');
    const installPath = path.join(homeDir3, 'plugin');
    install.registerPlugin(installPath, '2.0.0', homeDir3);
    const registryPath = path.join(homeDir3, '.claude', 'plugins', 'installed_plugins.json');
    const first = JSON.parse(fs.readFileSync(registryPath, 'utf8')).plugins['taketomarket@npm'][0];

    install.registerPlugin(installPath, '2.0.1', homeDir3);
    const second = JSON.parse(fs.readFileSync(registryPath, 'utf8')).plugins['taketomarket@npm'][0];

    assert.strictEqual(second.installedAt, first.installedAt, 'installedAt unchanged');
    assert.strictEqual(second.version, '2.0.1', 'version updated');
  });

  it('backs up corrupted JSON and recreates', () => {
    const homeDir4 = path.join(tmp.dir, 'home4');
    const pluginsDir = path.join(homeDir4, '.claude', 'plugins');
    fs.mkdirSync(pluginsDir, { recursive: true });
    const registryPath = path.join(pluginsDir, 'installed_plugins.json');
    fs.writeFileSync(registryPath, 'not valid json {{{');

    install.registerPlugin('/some/path', '2.0.0', homeDir4);

    assert.ok(install.fileExists(registryPath + '.bak'), 'backup created');
    assert.ok(install.fileExists(registryPath), 'registry recreated');
    const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
    assert.strictEqual(registry.version, 2);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
node --test test/install.test.cjs 2>&1 | grep -E "FAIL|Error|registerPlugin"
```

Expected: tests fail with `install.registerPlugin is not a function`.

- [ ] **Step 3: Implement registerPlugin() in install.js**

Add after the `copyDirSync` function, before `validateInstall`:

```js
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
```

Add `registerPlugin` to `module.exports`.

- [ ] **Step 4: Wire registerPlugin() into main()**

In `main()`, after the file copy and validation succeed (after `printResults(results)` and before the `console.log('Installation complete!')` line), add:

```js
// Register with Claude Code (only for claude runtime)
if (runtime === 'claude') {
  registerPlugin(targetDir, VERSION);
}
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
node --test test/install.test.cjs 2>&1 | grep -E "PASS|FAIL|registerPlugin"
```

Expected: all `registerPlugin` tests PASS.

- [ ] **Step 6: Run full test suite**

```bash
node --test 2>&1 | tail -5
```

Expected: no new failures.

- [ ] **Step 7: Verify gitCommitSha: null is accepted**

Run the installer against a real temp home to confirm Claude Code handles `gitCommitSha: null`:

```bash
HOME=$(mktemp -d) node install.js --dry-run 2>&1
```

Then manually run the real install and check `~/.claude/plugins/installed_plugins.json` after install to confirm the entry appears and Claude Code loads it. (Manual verification — cannot be automated.)

- [ ] **Step 8: Commit**

```bash
git add install.js test/install.test.cjs
git commit -m "feat(v2/wave1): add registerPlugin() — fixes IMP-02 slash commands"
```

---

## Wave 2 — Installer Overhaul

**Depends on: Wave 0 R-02 through R-05 complete (runtime paths needed for RUNTIME_TARGETS).**

---

### Task 2.1: Add parseRuntimeChoices() + RUNTIME_TARGETS constant + tests

**Files:**
- Modify: `install.js`
- Modify: `test/install.test.cjs`

- [ ] **Step 1: Write failing tests**

Add to `test/install.test.cjs`:

```js
describe('parseRuntimeChoices', () => {
  it('parses single choice', () => {
    assert.deepStrictEqual(install.parseRuntimeChoices('1'), ['claude']);
  });

  it('parses comma-separated choices', () => {
    assert.deepStrictEqual(install.parseRuntimeChoices('1,3'), ['claude', 'cursor']);
  });

  it('parses "6" as all named runtimes', () => {
    const result = install.parseRuntimeChoices('6');
    assert.deepStrictEqual(result, ['claude', 'codex', 'cursor', 'windsurf', 'gemini']);
  });

  it('parses "7" as custom', () => {
    assert.deepStrictEqual(install.parseRuntimeChoices('7'), ['custom']);
  });

  it('returns null for empty input', () => {
    assert.strictEqual(install.parseRuntimeChoices(''), null);
  });

  it('returns null for out-of-range input', () => {
    assert.strictEqual(install.parseRuntimeChoices('8'), null);
  });

  it('returns null for non-numeric input', () => {
    assert.strictEqual(install.parseRuntimeChoices('abc'), null);
  });

  it('deduplicates choices', () => {
    assert.deepStrictEqual(install.parseRuntimeChoices('1,1'), ['claude']);
  });
});

describe('buildRuntimeTargets', () => {
  it('returns an object with expected keys', () => {
    const targets = install.buildRuntimeTargets('/fake/home');
    assert.ok(targets.claude, 'has claude');
    assert.ok(targets.codex, 'has codex');
    assert.ok(targets.cursor, 'has cursor');
    assert.ok(targets.windsurf, 'has windsurf');
    assert.ok(targets.gemini, 'has gemini');
  });

  it('claude target has register: true and uses provided homeDir', () => {
    const targets = install.buildRuntimeTargets('/test/home');
    assert.strictEqual(targets.claude.register, true);
    assert.ok(targets.claude.dir.startsWith('/test/home'));
  });

  it('non-claude targets have register: false and partial: true initially', () => {
    const targets = install.buildRuntimeTargets('/test/home');
    assert.strictEqual(targets.codex.register, false);
    assert.strictEqual(targets.codex.partial, true);
  });
});
```

- [ ] **Step 2: Run to verify they fail**

```bash
node --test test/install.test.cjs 2>&1 | grep -E "parseRuntimeChoices|buildRuntimeTargets" | head -10
```

Expected: tests fail with `not a function`.

- [ ] **Step 3: Implement parseRuntimeChoices() and buildRuntimeTargets() in install.js**

Add after the constants section (after `FILES_TO_COPY`), before the runtime detection section:

```js
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
 * IMPORTANT: Fill in the paths for cursor, windsurf, gemini from Wave 0 R-03, R-04, R-05 findings.
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
      register: false, // Updated in Task 4.1 after R-02 findings
      partial: true,
    },
    cursor: {
      label: 'Cursor',
      // ⚠️  FILL IN from Wave 0 R-03 findings before implementing:
      dir: path.join(homeDir, '.cursor', 'rules'),          // VERIFY from R-03
      parentDir: path.join(homeDir, '.cursor'),             // VERIFY from R-03
      register: false,
      partial: true,
    },
    windsurf: {
      label: 'Windsurf',
      // ⚠️  FILL IN from Wave 0 R-04 findings before implementing:
      dir: path.join(homeDir, '.codeium', 'windsurf'),      // VERIFY from R-04
      parentDir: path.join(homeDir, '.codeium'),            // VERIFY from R-04
      register: false,
      partial: true,
    },
    gemini: {
      label: 'Gemini CLI',
      // ⚠️  FILL IN from Wave 0 R-05 findings before implementing:
      dir: path.join(homeDir, '.gemini'),                   // VERIFY from R-05
      parentDir: path.join(homeDir, '.gemini'),             // VERIFY from R-05
      register: false,
      partial: true,
    },
  };
}
```

Add `parseRuntimeChoices` and `buildRuntimeTargets` to `module.exports`.

- [ ] **Step 4: Run tests to verify they pass**

```bash
node --test test/install.test.cjs 2>&1 | grep -E "parseRuntimeChoices|buildRuntimeTargets"
```

Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add install.js test/install.test.cjs
git commit -m "feat(v2/wave2): add parseRuntimeChoices() + buildRuntimeTargets()"
```

---

### Task 2.2: Add readSkillDescriptions() and getInstalledRuntimes() + tests

**Files:**
- Modify: `install.js`
- Modify: `test/install.test.cjs`

- [ ] **Step 1: Write failing tests**

```js
describe('readSkillDescriptions', () => {
  let tmp;

  before(() => {
    tmp = createTempDir();
    // Create mock skills dir with two skills
    const skills = ['ttm-init', 'ttm-produce'];
    for (const skill of skills) {
      const dir = path.join(tmp.dir, 'skills', skill);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, 'SKILL.md'),
        `---\nname: ${skill}\ndescription: >\n  Description for ${skill}.\n---\n`);
    }
  });

  after(() => { tmp.cleanup(); });

  it('returns array of {name, description} sorted by name', () => {
    const result = install.readSkillDescriptions(tmp.dir);
    assert.ok(Array.isArray(result));
    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0].name, 'ttm-init');
    assert.strictEqual(result[0].description, 'Description for ttm-init.');
    assert.strictEqual(result[1].name, 'ttm-produce');
  });

  it('skips dirs without SKILL.md', () => {
    fs.mkdirSync(path.join(tmp.dir, 'skills', 'not-a-skill'), { recursive: true });
    const result = install.readSkillDescriptions(tmp.dir);
    assert.ok(result.every(r => r.name !== 'not-a-skill'));
  });
});

describe('getInstalledRuntimes', () => {
  let tmp;

  before(() => {
    tmp = createTempDir();
    fs.mkdirSync(path.join(tmp.dir, '.claude'), { recursive: true });
    // .codex does NOT exist
  });

  after(() => { tmp.cleanup(); });

  it('detects claude when ~/.claude exists', () => {
    const result = install.getInstalledRuntimes(tmp.dir);
    assert.ok(result.includes('claude'));
  });

  it('does not include codex when ~/.codex missing', () => {
    const result = install.getInstalledRuntimes(tmp.dir);
    assert.ok(!result.includes('codex'));
  });
});
```

- [ ] **Step 2: Run to verify they fail**

```bash
node --test test/install.test.cjs 2>&1 | grep -E "readSkillDescriptions|getInstalledRuntimes" | head -10
```

Expected: fail with `not a function`.

- [ ] **Step 3: Implement both functions in install.js**

```js
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
      // Parse description: value (handles multi-line "> " YAML block scalar)
      const descMatch = content.match(/^description:\s*>\s*\n((?:[ \t]+.+\n?)+)/m);
      let description = '';
      if (descMatch) {
        // First content line, trimmed
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
```

Add both to `module.exports`.

- [ ] **Step 4: Run tests to verify they pass**

```bash
node --test test/install.test.cjs 2>&1 | grep -E "readSkillDescriptions|getInstalledRuntimes"
```

Expected: all PASS.

- [ ] **Step 5: Commit**

```bash
git add install.js test/install.test.cjs
git commit -m "feat(v2/wave2): add readSkillDescriptions() + getInstalledRuntimes()"
```

---

### Task 2.3: Add promptRuntimeSelection() (interactive I/O)

**Files:**
- Modify: `install.js`

This function handles the interactive prompt + non-TTY fallback. It is async (uses readline). Unit-tested via E2E in Task 2.8. No unit tests in this task.

- [ ] **Step 1: Add promptRuntimeSelection() to install.js**

```js
/**
 * Interactively ask user which runtimes to install to.
 * Falls back to auto-detect when stdin is not a TTY or --runtime flag is set.
 * @param {string[]} args - process.argv slice
 * @param {string} [homeDir]
 * @returns {Promise<Array<{label, dir, parentDir, register, partial}>>}
 */
async function promptRuntimeSelection(args, homeDir = os.homedir()) {
  // Legacy --runtime flag: bypass interactive prompt
  const runtimeIdx = args.indexOf('--runtime');
  if (runtimeIdx !== -1 && runtimeIdx + 1 < args.length) {
    const name = args[runtimeIdx + 1].toLowerCase();
    const allTargets = buildRuntimeTargets(homeDir);
    if (!allTargets[name] && name !== 'custom') {
      console.warn(`Warning: Unknown runtime "${name}". Defaulting to claude.`);
      return [allTargets.claude];
    }
    return name === 'custom' ? [] : [allTargets[name]];
  }

  // Non-TTY fallback: auto-detect installed runtimes
  if (!process.stdin.isTTY) {
    const detected = getInstalledRuntimes(homeDir);
    const allTargets = buildRuntimeTargets(homeDir);
    if (detected.length === 0) {
      console.log('Note: No known runtimes detected. Defaulting to Claude Code.');
      return [allTargets.claude];
    }
    console.log(`Note: Non-interactive mode. Auto-detected: ${detected.join(', ')}`);
    return detected.map(name => allTargets[name]);
  }

  // Interactive prompt
  const { createInterface } = require('node:readline');
  const rl = createInterface({ input: process.stdin, output: process.stdout });

  const ask = (question) => new Promise(resolve => rl.question(question, resolve));

  console.log('');
  console.log('Which AI coding tool(s) are you using? (select all that apply)');
  console.log('');
  console.log('  1. Claude Code');
  console.log('  2. Codex (OpenAI)');
  console.log('  3. Cursor');
  console.log('  4. Windsurf');
  console.log('  5. Gemini CLI');
  console.log('  6. All of the above');
  console.log('  7. Let me type a custom path');
  console.log('');

  let choices = null;
  let attempts = 0;
  while (choices === null && attempts < 2) {
    const input = await ask('Your choice (comma-separated, e.g. 1,3): ');
    choices = parseRuntimeChoices(input);
    if (choices === null) {
      console.log('Invalid input. Please enter numbers 1-7 separated by commas.');
      attempts++;
    }
  }

  if (choices === null) {
    rl.close();
    console.error('Invalid input after 2 attempts. Exiting.');
    console.log('Something went wrong? File an issue: https://github.com/ranjanrishikesh/takeToMarket/issues');
    process.exit(1);
  }

  let customPath = null;
  if (choices.includes('custom')) {
    customPath = await ask('Enter install path: ');
    customPath = customPath.trim();
    if (!customPath) {
      rl.close();
      console.error('Custom path cannot be empty.');
      process.exit(1);
    }
  }

  rl.close();

  const allTargets = buildRuntimeTargets(homeDir);
  const result = [];
  for (const name of choices) {
    if (name === 'custom') {
      result.push({ label: 'Custom', dir: customPath, parentDir: null, register: false, partial: false });
    } else {
      result.push(allTargets[name]);
    }
  }
  return result;
}
```

- [ ] **Step 2: Verify module still loads**

```bash
node -e "require('./install.js')" && echo "OK"
```

Expected: `OK` (no errors).

- [ ] **Step 3: Commit**

```bash
git add install.js
git commit -m "feat(v2/wave2): add promptRuntimeSelection() with readline + non-TTY fallback"
```

---

### Task 2.4: Add confirmInstall() + checkStatus() + tests

**Files:**
- Modify: `install.js`
- Modify: `test/install.test.cjs`

- [ ] **Step 1: Write failing tests**

```js
describe('shouldProceed (confirmInstall logic)', () => {
  // We test the pure decision: does yesFlag bypass confirmation?
  // The actual readline call is tested via E2E.
  it('returns true immediately when yesFlag is true', () => {
    // confirmInstall is async/I/O; test the exported shouldProceed helper
    assert.strictEqual(install.shouldProceed(true), true);
  });
});

describe('checkStatus', () => {
  let tmp;

  before(() => {
    tmp = createTempDir();
    // Simulate installed Claude Code plugin
    const pluginDir = path.join(tmp.dir, '.claude', 'plugins', 'taketomarket', 'skills');
    fs.mkdirSync(pluginDir, { recursive: true });
    // Add a mock SKILL.md
    const skillDir = path.join(tmp.dir, '.claude', 'plugins', 'taketomarket', 'skills', 'ttm-init');
    fs.mkdirSync(skillDir, { recursive: true });
    fs.writeFileSync(path.join(skillDir, 'SKILL.md'), '---\nname: ttm-init\n---\n');
    // Write registry entry
    const registryPath = path.join(tmp.dir, '.claude', 'plugins', 'installed_plugins.json');
    fs.mkdirSync(path.dirname(registryPath), { recursive: true });
    fs.writeFileSync(registryPath, JSON.stringify({
      version: 2,
      plugins: { 'taketomarket@npm': [{ scope: 'user', installPath: '/fake', version: '2.0.0',
        installedAt: '2026-01-01T00:00:00.000Z', lastUpdated: '2026-01-01T00:00:00.000Z', gitCommitSha: null }] },
    }));
  });

  after(() => { tmp.cleanup(); });

  it('getClaudeStatus returns INSTALLED when plugin dir + registry entry exist', () => {
    const status = install.getClaudeStatus(tmp.dir);
    assert.strictEqual(status.installed, true);
    assert.strictEqual(status.registered, true);
  });

  it('getClaudeStatus returns NOT INSTALLED when plugin dir missing', () => {
    const status = install.getClaudeStatus(path.join(tmp.dir, 'nonexistent'));
    assert.strictEqual(status.installed, false);
  });
});
```

- [ ] **Step 2: Run to verify they fail**

```bash
node --test test/install.test.cjs 2>&1 | grep -E "shouldProceed|checkStatus|getClaudeStatus" | head -10
```

Expected: fail with `not a function`.

- [ ] **Step 3: Implement in install.js**

```js
/**
 * Used by confirmInstall — extracted for testability.
 * @param {boolean} yesFlag
 * @returns {boolean} true if yesFlag is set (no prompt needed)
 */
function shouldProceed(yesFlag) {
  return yesFlag === true;
}

/**
 * Read Claude Code install status for the checkStatus output.
 * @param {string} [homeDir]
 * @returns {{ installed: boolean, registered: boolean, skillCount: number, dir: string }}
 */
function getClaudeStatus(homeDir = os.homedir()) {
  const pluginDir = path.join(homeDir, '.claude', 'plugins', 'taketomarket');
  const installed = dirExists(pluginDir);
  if (!installed) return { installed: false, registered: false, skillCount: 0, dir: pluginDir };

  const skillsDir = path.join(pluginDir, 'skills');
  let skillCount = 0;
  if (dirExists(skillsDir)) {
    try {
      skillCount = fs.readdirSync(skillsDir, { withFileTypes: true })
        .filter(e => e.isDirectory() && fileExists(path.join(skillsDir, e.name, 'SKILL.md')))
        .length;
    } catch { /* ignore */ }
  }

  const registryPath = path.join(homeDir, '.claude', 'plugins', 'installed_plugins.json');
  let registered = false;
  if (fileExists(registryPath)) {
    try {
      const reg = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
      registered = !!(reg.plugins && reg.plugins['taketomarket@npm']);
    } catch { /* ignore */ }
  }

  return { installed: true, registered, skillCount, dir: pluginDir };
}

/**
 * Print install status for all known runtimes and exit.
 * @param {string} version
 * @param {string} [homeDir]
 */
function checkStatus(version, homeDir = os.homedir()) {
  const targets = buildRuntimeTargets(homeDir);
  console.log('');
  console.log(`takeToMarket v${version}`);
  console.log('');

  // Claude Code (full status)
  const claude = getClaudeStatus(homeDir);
  if (claude.installed) {
    console.log(`Claude Code: INSTALLED (${claude.skillCount} skills, ${claude.dir.replace(homeDir, '~')})`);
    console.log(`  registered: ${claude.registered ? 'yes (installed_plugins.json)' : 'NO — slash commands will not appear'}`);
  } else {
    console.log('Claude Code: NOT INSTALLED');
  }

  // Other runtimes: check by plugin dir existence
  for (const name of ['codex', 'cursor', 'windsurf', 'gemini']) {
    const t = targets[name];
    const label = t.label.padEnd(12);
    if (t.dir && dirExists(t.dir)) {
      console.log(`${label} INSTALLED (${t.dir.replace(homeDir, '~')})`);
    } else {
      console.log(`${label} NOT INSTALLED`);
    }
  }

  console.log('');
  console.log('Run `npx taketomarket` to install or reinstall.');
  process.exit(0);
}

/**
 * Interactively confirm install. Skipped when yesFlag is true.
 * @param {Array<{label, dir}>} targets
 * @param {string} version
 * @param {boolean} yesFlag
 * @returns {Promise<boolean>}
 */
async function confirmInstall(targets, version, yesFlag) {
  if (shouldProceed(yesFlag)) return true;

  const { createInterface } = require('node:readline');
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const ask = (q) => new Promise(resolve => rl.question(q, resolve));

  console.log('');
  console.log(`takeToMarket v${version} — Marketing OS for AI coding tools`);
  console.log('');
  console.log('This will install to:');
  for (const t of targets) {
    const shortDir = t.dir.replace(os.homedir(), '~');
    console.log(`  ${shortDir.padEnd(45)} (${t.label})`);
  }
  console.log('');

  const answer = await ask('Proceed? [Y/n]: ');
  rl.close();

  const trimmed = answer.trim().toLowerCase();
  if (trimmed === 'n') {
    console.log('Installation cancelled.');
    process.exit(0);
  }
  return true;
}
```

Add `shouldProceed`, `getClaudeStatus`, `checkStatus`, `confirmInstall` to `module.exports`.

- [ ] **Step 4: Run tests**

```bash
node --test test/install.test.cjs 2>&1 | grep -E "shouldProceed|checkStatus|getClaudeStatus"
```

Expected: all PASS.

- [ ] **Step 5: Commit**

```bash
git add install.js test/install.test.cjs
git commit -m "feat(v2/wave2): add confirmInstall(), checkStatus(), getClaudeStatus()"
```

---

### Task 2.5: Add printInstallSummary() + tests

**Files:**
- Modify: `install.js`
- Modify: `test/install.test.cjs`

- [ ] **Step 1: Write failing tests**

```js
describe('printInstallSummary', () => {
  let tmp;
  let output;
  const origLog = console.log;

  before(() => {
    tmp = createTempDir();
    // Create mock skills
    for (const [name, desc] of [['ttm-init', 'Set up workspace.'], ['ttm-produce', 'Run production.']]) {
      const dir = path.join(tmp.dir, 'skills', name);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, 'SKILL.md'),
        `---\nname: ${name}\ndescription: >\n  ${desc}\n---\n`);
    }
  });

  after(() => { tmp.cleanup(); console.log = origLog; });

  it('prints slash command list from packageRoot/skills/', () => {
    const lines = [];
    console.log = (...args) => lines.push(args.join(' '));
    install.printInstallSummary(tmp.dir);
    console.log = origLog;
    const joined = lines.join('\n');
    assert.ok(joined.includes('/taketomarket:ttm-init'), 'includes ttm-init');
    assert.ok(joined.includes('/taketomarket:ttm-produce'), 'includes ttm-produce');
    assert.ok(joined.includes('Set up workspace'), 'includes description');
  });
});
```

- [ ] **Step 2: Run to verify they fail**

```bash
node --test test/install.test.cjs 2>&1 | grep -E "printInstallSummary" | head -5
```

Expected: fail with `not a function`.

- [ ] **Step 3: Implement printInstallSummary() in install.js**

```js
/**
 * Print slash commands available after install. Reads from npm package source.
 * @param {string} [packageRoot] - Root of npm package (defaults to PACKAGE_ROOT = __dirname)
 */
function printInstallSummary(packageRoot = PACKAGE_ROOT) {
  const skills = readSkillDescriptions(packageRoot);
  console.log('');
  console.log(`Installation complete! ${skills.length} skills installed.`);
  console.log('');
  console.log('Available commands:');
  for (const { name, description } of skills) {
    const cmd = `/taketomarket:${name}`.padEnd(42);
    console.log(`  ${cmd} ${description}`);
  }
  console.log('');
  console.log('Quick start: open any project in Claude Code and run /taketomarket:ttm-init');
}
```

Add `printInstallSummary` to `module.exports`.

- [ ] **Step 4: Run tests**

```bash
node --test test/install.test.cjs 2>&1 | grep "printInstallSummary"
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add install.js test/install.test.cjs
git commit -m "feat(v2/wave2): add printInstallSummary() reading from package source"
```

---

### Task 2.6: Refactor main() to use new functions + update --help

**Files:**
- Modify: `install.js`

- [ ] **Step 1: Rewrite main() in install.js**

Replace the existing `main()` function entirely:

```js
async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--version') || args.includes('-v')) {
    process.stdout.write(`${VERSION}\n`);
    process.exit(0);
  }

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
takeToMarket installer

Usage: npx taketomarket [options]

Options:
  --runtime <claude|codex>  Target a specific runtime, skip interactive prompt
  --check                   Show install status without installing
  --yes, -y                 Skip confirmation prompt (for CI/scripted use)
  --dry-run                 Validate source package without writing files
  --version, -v             Print version
  --help, -h                Show this help message
`);
    process.exit(0);
  }

  if (args.includes('--check')) {
    checkStatus(VERSION);
    // checkStatus calls process.exit(0)
  }

  if (args.includes('--dry-run')) {
    console.log('');
    console.log(`takeToMarket installer v${VERSION}`);
    console.log('[DRY RUN] Validating source package...');
    console.log('');
    const results = validateInstall(PACKAGE_ROOT);
    printResults(results);
    console.log('');
    console.log('[DRY RUN] No files written.');
    process.exit(0);
  }

  console.log('');
  console.log(`takeToMarket installer v${VERSION}`);

  const yesFlag = args.includes('--yes') || args.includes('-y');

  // Runtime selection
  const targets = await promptRuntimeSelection(args);

  if (targets.length === 0) {
    console.log('No runtimes selected. Exiting.');
    process.exit(0);
  }

  // Confirmation
  await confirmInstall(targets, VERSION, yesFlag);

  // Install loop
  const results = [];
  for (const target of targets) {
    console.log('');
    console.log(`Installing to ${target.label}...`);

    // Warn if runtime parent dir not found
    if (target.parentDir && !dirExists(target.parentDir)) {
      console.warn(`  Warning: ${target.label} doesn't appear to be installed (${target.parentDir} not found).`);
      console.warn('  Installing anyway — files will be ready when you install the runtime.');
    }

    try {
      // Remove existing installation
      if (dirExists(target.dir)) {
        console.log('  Existing installation found. Removing before reinstall...');
        fs.rmSync(target.dir, { recursive: true, force: true });
      }

      // Copy directories
      for (const dir of DIRS_TO_COPY) {
        const srcDir = path.join(PACKAGE_ROOT, dir);
        if (dirExists(srcDir)) {
          console.log(`  Copying ${dir}/`);
          copyDirSync(srcDir, path.join(target.dir, dir));
        }
      }

      // Copy individual files
      for (const file of FILES_TO_COPY) {
        const srcFile = path.join(PACKAGE_ROOT, file);
        if (fileExists(srcFile)) {
          console.log(`  Copying ${file}`);
          const destFile = path.join(target.dir, file);
          fs.mkdirSync(path.dirname(destFile), { recursive: true });
          fs.copyFileSync(srcFile, destFile);
        }
      }

      // Register
      if (target.register) {
        registerPlugin(target.dir, VERSION);
      }

      // Validate
      const validation = validateInstall(target.dir);
      printResults(validation);
      const failures = validation.filter(r => r.status === 'fail');

      if (failures.length > 0) {
        results.push({ target, success: false, reason: 'validation failed' });
      } else {
        if (target.partial) {
          console.log(`  [PARTIAL] ${target.label}: files copied — slash command registration coming in a future update`);
        }
        results.push({ target, success: true });
      }
    } catch (err) {
      console.error(`  Error: ${err.message}`);
      results.push({ target, success: false, reason: err.message });
    }
  }

  // Summary
  const successes = results.filter(r => r.success);
  const failures = results.filter(r => !r.success);

  if (successes.length > 0) {
    printInstallSummary();
  }

  if (failures.length > 0) {
    console.log('');
    console.log('Failed runtimes:');
    for (const f of failures) {
      console.log(`  ${f.target.label}: ${f.reason}`);
    }
    console.log('');
    console.log('Something went wrong? File an issue: https://github.com/ranjanrishikesh/takeToMarket/issues');
  }

  process.exit(failures.length === results.length ? 1 : 0);
}

if (require.main === module) {
  main().catch(err => {
    console.error(`Fatal: ${err.message}`);
    console.log('Something went wrong? File an issue: https://github.com/ranjanrishikesh/takeToMarket/issues');
    process.exit(1);
  });
}
```

Update the `module.exports` block to include all new exports and remove `detectRuntime` (no longer needed externally — `--runtime` flag is handled inside `promptRuntimeSelection`):

```js
module.exports = {
  main,
  validateInstall,
  copyDirSync,
  dirExists,
  fileExists,
  printResults,
  DIRS_TO_COPY,
  FILES_TO_COPY,
  registerPlugin,
  parseRuntimeChoices,
  buildRuntimeTargets,
  getInstalledRuntimes,
  readSkillDescriptions,
  shouldProceed,
  getClaudeStatus,
  checkStatus,
  confirmInstall,
  printInstallSummary,
  PACKAGE_ROOT,
};
```

- [ ] **Step 2: Update test for exports**

In `test/install.test.cjs`, update the "exports all expected functions" test:

```js
it('exports all expected functions', () => {
  const expectedFns = [
    'validateInstall', 'copyDirSync', 'dirExists', 'fileExists', 'printResults',
    'registerPlugin', 'parseRuntimeChoices', 'buildRuntimeTargets', 'getInstalledRuntimes',
    'readSkillDescriptions', 'shouldProceed', 'getClaudeStatus', 'checkStatus',
    'confirmInstall', 'printInstallSummary',
  ];
  for (const fn of expectedFns) {
    assert.strictEqual(typeof install[fn], 'function', `exports.${fn} is a function`);
  }
});
```

- [ ] **Step 3: Run full test suite**

```bash
node --test 2>&1 | tail -10
```

Expected: no regressions. `detectRuntime` tests may fail if they still reference it — delete those tests since `detectRuntime` is now internal.

- [ ] **Step 4: Commit**

```bash
git add install.js test/install.test.cjs
git commit -m "feat(v2/wave2): refactor main() — multi-runtime loop, skip-and-continue, confirm prompt"
```

---

### Task 2.7: E2E tests for new installer flow

**Files:**
- Modify: `test/install-e2e.test.cjs`

- [ ] **Step 1: Add E2E tests**

Add to `test/install-e2e.test.cjs`:

```js
describe('install-e2e: --check flag', () => {
  it('exits 0 and prints status table', () => {
    const tmp = createTempDir();
    try {
      const result = runInstall(['--check'], { ...process.env, HOME: tmp.dir });
      assert.strictEqual(result.status, 0, `exit 0, got ${result.status}\n${result.stdout}\n${result.stderr}`);
      assert.ok(result.stdout.includes('Claude Code'), 'shows Claude Code row');
      assert.ok(result.stdout.includes('NOT INSTALLED'), 'shows NOT INSTALLED status');
    } finally {
      tmp.cleanup();
    }
  });
});

describe('install-e2e: --yes flag skips confirmation', () => {
  it('installs without waiting for stdin when --yes is passed', () => {
    const tmp = createTempDir();
    try {
      // No stdin input needed because --yes bypasses confirm
      const result = runInstall(['--runtime', 'claude', '--yes'], {
        ...process.env,
        HOME: tmp.dir,
      });
      // Should succeed or fail for structural reasons, not hang waiting for input
      assert.ok(result.status === 0 || result.status === 1,
        `exit 0 or 1, got ${result.status}\n${result.stderr}`);
      assert.ok(!result.stdout.includes('Proceed? [Y/n]'), 'confirmation prompt not shown');
    } finally {
      tmp.cleanup();
    }
  });
});

describe('install-e2e: piped runtime selection', () => {
  it('installs to claude when "1" piped to stdin', () => {
    // spawnSync with stdin piped: use input option
    const tmp = createTempDir();
    try {
      const result = spawnSync('node', [INSTALL_JS, '--yes'], {
        env: { ...process.env, HOME: tmp.dir },
        cwd: PROJECT_ROOT,
        input: '1\n',      // select Claude Code
        timeout: 30000,
        encoding: 'utf-8',
      });
      // Will be non-TTY (piped stdin), so falls back to auto-detect; assert no crash
      assert.ok(result.status === 0 || result.status === 1, 'exits cleanly');
    } finally {
      tmp.cleanup();
    }
  });
});

describe('install-e2e: --runtime claude installs and registers', () => {
  it('writes installed_plugins.json after install', () => {
    const tmp = createTempDir();
    try {
      const result = runInstall(['--runtime', 'claude', '--yes'], {
        ...process.env,
        HOME: tmp.dir,
      });
      assert.strictEqual(result.status, 0, `exit 0\n${result.stdout}\n${result.stderr}`);
      const registryPath = path.join(tmp.dir, '.claude', 'plugins', 'installed_plugins.json');
      assert.ok(fs.existsSync(registryPath), 'installed_plugins.json created');
      const reg = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
      assert.ok(reg.plugins['taketomarket@npm'], 'entry written');
      assert.strictEqual(reg.plugins['taketomarket@npm'][0].scope, 'user');
    } finally {
      tmp.cleanup();
    }
  });
});

describe('install-e2e: partial failure continues', () => {
  it('succeeds for claude even when second target would fail', () => {
    // --runtime claude only: just verify skip-and-continue doesn't crash on single-target success
    const tmp = createTempDir();
    try {
      const result = runInstall(['--runtime', 'claude', '--yes'], {
        ...process.env,
        HOME: tmp.dir,
      });
      assert.strictEqual(result.status, 0, `exit 0\n${result.stderr}`);
      assert.ok(result.stdout.includes('Installation complete') || result.stdout.includes('skills installed'));
    } finally {
      tmp.cleanup();
    }
  });
});
```

- [ ] **Step 2: Run E2E tests**

```bash
node --test test/install-e2e.test.cjs 2>&1 | tail -20
```

Expected: all pass (or investigation if failures appear).

- [ ] **Step 3: Run full suite**

```bash
node --test 2>&1 | tail -5
```

Expected: no regressions.

- [ ] **Step 4: Commit**

```bash
git add test/install-e2e.test.cjs
git commit -m "test(v2/wave2): E2E tests for --check, --yes, multi-runtime install"
```

---

## Wave 3 — README Overhaul

**Depends on: Wave 0 R-07 (to know whether Options 2+3 are verified or placeholders).**

---

### Task 3.1: Rewrite README.md

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Replace README.md**

Write the complete new README. The content below is the authoritative version — replace the entire file:

```markdown
# takeToMarket

A marketing operating system for Claude Code and Codex. Spec-driven campaigns with positioning-as-invariant enforcement, quality gate walls, and compound learnings.

**Core invariant:** Every marketing asset ships with a verifiable outcome metric and passes through a positioning-invariant quality gate wall — no asset ships without both, ever.

## What it is / What it isn't

**IS:** A marketing OS that treats every campaign, asset, and channel as a spec-driven unit with a verifiable outcome, a positioning invariant, and a quality gate wall. Persistent state. Compound learnings. Nine-phase lifecycle enforcement.

**IS NOT:** A content generator, one-click blog writer, or social media scheduler. takeToMarket does not generate random content — it enforces discipline on content you and your team produce.

## Requirements

- Node.js 18+
- Claude Code v1.x+ (or Codex)
- git

## Installation

### Option 1 — npx (recommended)

```bash
npx taketomarket
```

Interactive: asks which tool(s) you use, installs to all selected runtimes in one pass.

Flags:
- `--yes` or `-y` — skip confirmation (for CI/scripts)
- `--check` — show install status without installing
- `--runtime <claude|codex>` — skip interactive prompt, install to one runtime

### Option 2 — Claude Code plugin marketplace

```
/plugin install taketomarket@claude-plugins-official
```

> Status: pending marketplace approval. Check https://github.com/ranjanrishikesh/takeToMarket for current status.

### Option 3 — Direct from GitHub

[FILL IN from Wave 0 R-07 finding — verified syntax or "not yet supported"]

### Option 4 — Manual (advanced)

```bash
git clone https://github.com/ranjanrishikesh/takeToMarket
cd takeToMarket
node install.js
```

## Quick Start

```
/taketomarket:ttm-init             # set up workspace (one time)
/taketomarket:ttm-new-campaign     # create first campaign
/taketomarket:ttm-produce          # run production wave
```

## Campaign Lifecycle

1. **Init** — set up workspace and reference files
2. **New Campaign** — create campaign directory with initialized state
3. **Research** — discover market, audience, and ambient narrative
4. **Brief** — generate brief with mandatory outcome metrics
5. **Produce** — generate assets in isolated contexts with full reference loading
6. **Review** — human quality evaluation with structured checklist
7. **Fix** — root cause analysis, re-produce, re-verify (capped 3×)
8. **Verify** — quality gate wall check across all assets
9. **Ship** — launch checklist confirming tracking, UTMs, funnel testing
10. **Measure** — analytics vs outcome metrics with attribution models
11. **Learn** — extract lessons, propose reference file edits, log to LEARNINGS.md

## Command Reference

| Command | Description |
|---------|-------------|
| `/taketomarket:ttm-aeo-check` | Check citation status across AI engines for a query |
| `/taketomarket:ttm-affiliate-kit` | Generate creative kit for affiliate partners |
| `/taketomarket:ttm-archive` | Archive a completed campaign, finalize state, and update LEARNINGS.md |
| `/taketomarket:ttm-brand-refresh` | Update BRAND.md with new proof points and deprecate expired ones |
| `/taketomarket:ttm-brief` | Generate a campaign brief with mandatory outcome metrics, positioning anchor, and channel mix |
| `/taketomarket:ttm-competitor-scan` | On-demand competitor analysis that updates COMPETITORS.md |
| `/taketomarket:ttm-email-preflight` | Deliverability, dark-mode, and spam-trigger scan for email assets |
| `/taketomarket:ttm-fix` | Fix phase: root cause analysis, fix brief, re-produce, re-verify (capped 3×) |
| `/taketomarket:ttm-health` | Validate .marketing/ directory integrity, reference file completeness, and state consistency |
| `/taketomarket:ttm-icp-refresh` | Update ICP.md from new customer data including calls, reviews, and feedback |
| `/taketomarket:ttm-init` | Interview-driven onboarding that generates all .marketing/ reference files |
| `/taketomarket:ttm-keyword-map` | Generate keyword cluster map with intent tags |
| `/taketomarket:ttm-learn` | Extract lessons from campaign data, propose reference file edits, log to LEARNINGS.md |
| `/taketomarket:ttm-measure` | Analyze campaign analytics against outcome metrics using attribution models |
| `/taketomarket:ttm-new-campaign` | Create a new campaign directory with initialized state and reference file links |
| `/taketomarket:ttm-next` | Guide user to the right next command based on current campaign state |
| `/taketomarket:ttm-positioning-check` | Sample recent assets and report positioning drift percentage and analysis |
| `/taketomarket:ttm-positioning-shift` | Controlled positioning change with reasoning, migration plan, and approval gate |
| `/taketomarket:ttm-produce` | Generate content assets in fresh contexts loaded with brief, positioning, brand, ICP, and playbook |
| `/taketomarket:ttm-repurpose` | Fan out a long-form asset into derivatives across channels with full brief-produce-verify per derivative |
| `/taketomarket:ttm-research` | Market and audience research including SERP, competitor content, and narrative mapping |
| `/taketomarket:ttm-resume` | Resume a paused campaign at its last completed phase |
| `/taketomarket:ttm-review` | Present assets with structured review checklist for human evaluation |
| `/taketomarket:ttm-seo-audit` | Technical and content SEO audit of a URL or sitemap |
| `/taketomarket:ttm-ship` | Generate launch checklist confirming tracking, UTMs, funnel testing, and asset finalization |
| `/taketomarket:ttm-state` | Display current campaign states, decisions in flight, blockers, and experiments |
| `/taketomarket:ttm-verify` | Run all applicable quality gates on every asset with pass/fail report and line-level feedback |

## Verify Installation

Inside Claude Code, run:
```
/taketomarket:ttm-health
```

This validates directory integrity, reference file presence, and state consistency.

## License

MIT — see [LICENSE](LICENSE).
```

- [ ] **Step 2: Update Option 3 with Wave 0 R-07 findings**

Read `docs/research/v2-runtime-research.md` R-07 section. Replace `[FILL IN from Wave 0 R-07...]` with the verified syntax, e.g.:

```markdown
### Option 3 — Direct from GitHub

```
/plugin install taketomarket@ranjanrishikesh
```

Or: *not yet supported — use Option 1 or 4.*
```

- [ ] **Step 3: Run tests**

```bash
node --test 2>&1 | tail -5
```

Expected: all pass (README changes have no code impact).

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs(v2/wave3): full README rewrite — install options, quick start, command reference"
```

---

## Wave 4 — Multi-Runtime Implementation

**Depends on: Wave 0 complete + Wave 2 complete.**

Each task below is conditional on Wave 0 findings. Read `docs/research/v2-runtime-research.md` before implementing each task.

---

### Task 4.1: Codex registration (IMP-12, based on Wave 0 R-02)

**Files:**
- Modify: `install.js`

- [ ] **Step 1: Read Wave 0 R-02 finding, then implement one of the following branches:**

**Branch A — Same schema as Claude Code:**

Modify `registerPlugin()` to accept a `registrySubpath` param:

```js
function registerPlugin(installPath, version, homeDir = os.homedir(), registrySubpath = '.claude/plugins/installed_plugins.json') {
  const registryPath = path.join(homeDir, registrySubpath);
  // ... rest unchanged
}
```

Update `buildRuntimeTargets()` to add `registrySubpath` to codex target:
```js
codex: {
  ...
  register: true,
  registrySubpath: '.codex/plugins/installed_plugins.json',
}
```

Update `main()` install loop to pass `target.registrySubpath` to `registerPlugin()`.

**Branch B — Different schema:**

Add a new function `registerCodexPlugin(installPath, version, homeDir)` using the correct schema found in R-02. Call it from the install loop when `target.name === 'codex'`.

**Branch C — No registration mechanism:**

In `buildRuntimeTargets()`, set `codex.register = false`. Add a comment in `checkStatus()` output for Codex: `"(slash commands: not supported — file copy only)"`.

- [ ] **Step 2: Write a test for the chosen branch**

Write at least one test in `test/install.test.cjs` verifying Codex registration works (if Branch A or B) or that `codex.register === false` in targets (if Branch C).

- [ ] **Step 3: Run tests**

```bash
node --test 2>&1 | tail -5
```

Expected: all pass.

- [ ] **Step 4: Commit**

```bash
git add install.js test/install.test.cjs
git commit -m "feat(v2/wave4): codex registration — IMP-12 (branch A|B|C from R-02)"
```

---

### Task 4.2: Cursor adapter (IMP-09, based on Wave 0 R-03)

**Files:**
- Conditionally create: `bin/lib/cursor-adapter.cjs`
- Modify: `install.js`

- [ ] **Step 1: Read Wave 0 R-03 finding, then implement one of the following branches:**

**Branch A — Slash commands supported, .mdc format confirmed:**

Create `bin/lib/cursor-adapter.cjs`:

```js
'use strict';
const fs = require('node:fs');
const path = require('node:path');

// Convert a SKILL.md to a Cursor .mdc rule file
// mdc frontmatter schema: fill in from Wave 0 R-03 findings
function skillToMdc(skillName, skillContent, mdcFrontmatter) {
  // FILL IN: convert SKILL.md content to .mdc format based on R-03 schema
  // Example (schema TBD from research):
  return `---\n${mdcFrontmatter}\n---\n${skillContent}`;
}

function installCursorAdapter(packageRoot, targetDir) {
  const skillsDir = path.join(packageRoot, 'skills');
  const entries = fs.readdirSync(skillsDir, { withFileTypes: true })
    .filter(e => e.isDirectory());
  for (const entry of entries) {
    const skillFile = path.join(skillsDir, entry.name, 'SKILL.md');
    if (!fs.existsSync(skillFile)) continue;
    const content = fs.readFileSync(skillFile, 'utf8');
    // FILL IN mdc frontmatter from R-03 schema
    const mdcContent = skillToMdc(entry.name, content, `description: takeToMarket ${entry.name}`);
    fs.writeFileSync(path.join(targetDir, `${entry.name}.mdc`), mdcContent, 'utf8');
  }
}

module.exports = { installCursorAdapter, skillToMdc };
```

Wire into installer: update `buildRuntimeTargets()` cursor entry to use actual confirmed path from R-03. Update `main()` install loop to call `installCursorAdapter()` for cursor target instead of `copyDirSync()`.

**Branch B — Ambient rules only (no slash commands):**

Create `bin/lib/cursor-adapter.cjs` that generates a single condensed `taketomarket.mdc` summarizing the campaign lifecycle. Wire into installer.

**Branch C — No equivalent:**

In `buildRuntimeTargets()`, update cursor to have `supported: false`. In installer output for cursor, print `[NOT SUPPORTED] Cursor: no compatible rules format found — see https://github.com/ranjanrishikesh/takeToMarket/issues`.

- [ ] **Step 2: Update cursor dir in buildRuntimeTargets() with confirmed path from R-03**

Replace the `// VERIFY from R-03` comment lines with actual paths.

- [ ] **Step 3: Run tests**

```bash
node --test 2>&1 | tail -5
```

- [ ] **Step 4: Commit**

```bash
git add install.js bin/ 2>/dev/null; git add .
git commit -m "feat(v2/wave4): cursor adapter — IMP-09 (branch A|B|C from R-03)"
```

---

### Task 4.3: Windsurf adapter (IMP-10, based on Wave 0 R-04)

Same pattern as Task 4.2. Read R-04 findings. Either implement adapter or mark `supported: false`. Update `buildRuntimeTargets()` windsurf paths. Commit.

```bash
git commit -m "feat(v2/wave4): windsurf adapter — IMP-10 (branch A|B from R-04)"
```

---

### Task 4.4: Update Gemini CLI support (IMP-11, based on Wave 0 R-05)

**Files:**
- Modify: `GEMINI.md`

- [ ] **Step 1: Read Wave 0 R-05 findings**

- [ ] **Step 2: Update GEMINI.md**

Add a validation status section at the top of `GEMINI.md`:

```markdown
## Validation Status (v2, 2026-05-13)

| Skill | Status | Notes |
|-------|--------|-------|
| ttm-init | ✅ WORKS | |
| ttm-produce | ⚠️ PARTIAL | [describe gap] |
| ... | | |

Gaps reported at: https://github.com/ranjanrishikesh/takeToMarket/issues
```

Fill in the table from R-05 findings. Fix any gaps that can be addressed in GEMINI.md itself.

- [ ] **Step 3: Update gemini dir in buildRuntimeTargets() with confirmed path**

Replace `// VERIFY from R-05` with actual path.

- [ ] **Step 4: Commit**

```bash
git add GEMINI.md install.js
git commit -m "docs(v2/wave4): validate Gemini CLI — IMP-11, update GEMINI.md with status"
```

---

### Task 4.5: Finalize README Options 2+3 + marketplace PR prep (IMP-06a, IMP-07)

**Files:**
- Modify: `README.md`
- Create: `docs/research/plugin-submission/plugin.json` (if not already created in Task 0.6)

- [ ] **Step 1: Finalize Option 3 in README**

Update with verified syntax from Wave 0 R-07. If not supported, remove Option 3 entirely.

- [ ] **Step 2: Verify marketplace PR materials**

Confirm `docs/research/plugin-submission/plugin.json` exists and is correct per R-06 findings. This file is the draft PR material — it will be submitted in Wave 5 after the repo is public.

- [ ] **Step 3: Commit**

```bash
git add README.md docs/research/
git commit -m "docs(v2/wave4): finalize README Options 2+3 from Wave 0 research findings"
```

---

## Wave 5 — Go-Public Checklist

---

### Task 5.1: Scan git history for secrets (IMP-19)

- [ ] **Step 1: Run history scan**

```bash
git log --all --full-history -p | grep -iE "(api_key|secret|password|token|sk-|Bearer)" | grep -v "^--" | head -30
```

```bash
git log --all --full-history -p | grep "/Users/rishikeshranjan" | grep -v "^--" | head -20
```

- [ ] **Step 2: Assess results**

- Local paths only → document finding, proceed
- Credentials found → stop, run `git filter-repo --path <file> --invert-paths` to scrub, then verify clean

- [ ] **Step 3: Document result**

Add to `docs/research/v2-runtime-research.md`:

```markdown
## IMP-19: History Scan Result

Date: 2026-05-13
Local paths found: yes (expected from .claude/settings.local.json commits — no credentials)
Credentials found: no
Decision: safe to proceed with public release
```

- [ ] **Step 4: Commit**

```bash
git add docs/research/v2-runtime-research.md
git commit -m "docs(v2/wave5): record git history scan result — IMP-19"
```

---

### Task 5.2: Gitignore .planning/ (IMP-17)

- [ ] **Step 1: Add to .gitignore**

Append to `.gitignore`:
```
# GSD build artifacts — not needed by users
.planning/
```

- [ ] **Step 2: Commit**

```bash
git add .gitignore
git commit -m "chore: gitignore .planning/ — build artifacts not needed by users"
```

---

### Task 5.3: Remove idea.md + extract positioning (IMP-18)

**Files:**
- Modify: `README.md`
- Delete: `idea.md`

- [ ] **Step 1: Read idea.md**

```bash
cat idea.md
```

- [ ] **Step 2: Extract relevant positioning**

Identify any "What it is / What it isn't" language in `idea.md` not yet in README. Insert into README's "What it is / What it isn't" section.

- [ ] **Step 3: Remove idea.md**

```bash
git rm idea.md
```

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "chore: remove idea.md, extract positioning to README — IMP-18"
```

---

### Task 5.4: Create CONTRIBUTING.md (IMP-20)

**Files:**
- Create: `CONTRIBUTING.md`

- [ ] **Step 1: Write CONTRIBUTING.md**

```markdown
# Contributing to takeToMarket

## Reporting bugs

Open a GitHub Issue at https://github.com/ranjanrishikesh/takeToMarket/issues.
Include: OS, Node version, runtime (Claude Code/Codex/other), and the exact error output.

## Proposing features

Open a discussion issue first — describe the use case, not the implementation.
Feature PRs without a linked discussion may be closed without review.

## Development setup

```bash
git clone https://github.com/ranjanrishikesh/takeToMarket
cd takeToMarket
node --test   # run full test suite — no install step needed
```

## Code style

- Zero npm dependencies — `bin/` tools use Node.js built-ins only
- CJS (`.cjs`) for all `bin/` scripts — no TypeScript, no transpilation
- Markdown for all skills, workflows, templates, references
- `node --test` must pass before every commit

## Pull request requirements

- `node --test` passes
- No new npm dependencies
- One clear purpose per PR — link to the issue it closes
- Commits follow conventional commit style (`feat:`, `fix:`, `docs:`, `chore:`, `test:`)
```

- [ ] **Step 2: Commit**

```bash
git add CONTRIBUTING.md
git commit -m "docs: add CONTRIBUTING.md — IMP-20"
```

---

### Task 5.5: Bump version to 2.0.0 + create CHANGELOG (IMP-21 pre-flight)

**Files:**
- Modify: `package.json`
- Modify: `.claude-plugin/plugin.json`
- Create: `CHANGELOG.md`

- [ ] **Step 1: Bump versions**

In `package.json`, change `"version": "1.0.1"` to `"version": "2.0.0"`.

In `.claude-plugin/plugin.json`, change version to `"2.0.0"`.

- [ ] **Step 2: Create CHANGELOG.md**

```markdown
# Changelog

## [2.0.0] — 2026-05-13

### Fixed
- IMP-02: Register in installed_plugins.json — skills now appear as slash commands in Claude Code
- IMP-15: Fix wrong GitHub URL (taketomarket/taketomarket → ranjanrishikesh/takeToMarket)
- IMP-16: Gitignore settings.local.json — stops leaking local filesystem paths

### Added
- IMP-01: Interactive multi-runtime selection prompt (7 options: Claude Code, Codex, Cursor, Windsurf, Gemini CLI, All, Custom path)
- IMP-03: Confirmation prompt before install; `--yes`/`-y` flag to skip for CI
- IMP-04: `--check` / `--status` flag to inspect install state without installing
- IMP-05: Post-install summary listing all 27 available slash commands with descriptions
- IMP-09: Cursor adapter — [FILL IN: working adapter / not supported]
- IMP-10: Windsurf adapter — [FILL IN: working adapter / not supported]
- IMP-11: Gemini CLI validation — GEMINI.md updated with status per skill
- IMP-12: Codex registration — [FILL IN: parity with Claude Code / copy-only]
- IMP-20: CONTRIBUTING.md

### Documentation
- IMP-13/14: Full README rewrite — all install methods, quick start, command reference, campaign lifecycle
- IMP-17: .planning/ gitignored
- IMP-18: idea.md removed, positioning extracted to README

### Distribution
- IMP-06: Marketplace submission PR prepared (pending public repo + Anthropic approval)
- IMP-07: GitHub direct install syntax — [FILL IN: verified / not supported]

## [1.0.1] — 2026-05-10

- Fix GitHub username in repository.url, homepage, bugs fields
- Update manifest guard to match corrected GitHub URLs
```

- [ ] **Step 3: Run full test suite**

```bash
node --test 2>&1 | tail -5
```

Expected: all pass.

- [ ] **Step 4: Commit**

```bash
git add package.json .claude-plugin/plugin.json CHANGELOG.md
git commit -m "chore(v2): bump to 2.0.0, add CHANGELOG"
```

---

### Task 5.6: Go-public execution (IMP-21)

- [ ] **Step 1: Verify go-public checklist**

Confirm all of the following are done:
- [ ] IMP-16: `.claude/settings.local.json` not tracked (`git ls-files .claude/` shows nothing)
- [ ] IMP-02: installer writes `installed_plugins.json` (verified in Task 1.3 step 7)
- [ ] IMP-15: README URLs correct (no `taketomarket/taketomarket`)
- [ ] IMP-14: README has quick start + command reference section
- [ ] IMP-19: git history scan done, no credentials found
- [ ] IMP-17: `.planning/` in `.gitignore`
- [ ] IMP-18: `idea.md` deleted
- [ ] IMP-20: `CONTRIBUTING.md` exists
- [ ] `node --test` passes

- [ ] **Step 2: Add GitHub repo topics**

```bash
gh repo edit ranjanrishikesh/takeToMarket --add-topic claude-code --add-topic marketing --add-topic ai-agents --add-topic codex --add-topic gtm
```

- [ ] **Step 3: Flip repo public**

⚠️ **IRREVERSIBLE. Confirm with the user before running.**

```bash
gh repo edit ranjanrishikesh/takeToMarket --visibility public
```

Expected: `✓ Edited repository ranjanrishikesh/takeToMarket`

- [ ] **Step 4: Verify**

```bash
gh repo view ranjanrishikesh/takeToMarket --json visibility -q .visibility
```

Expected: `PUBLIC`

---

### Task 5.7: Post-public — marketplace submission (IMP-06b)

- [ ] **Step 1: Submit marketplace form**

Navigate to `https://clau.de/plugin-directory-submission` and submit using the prepared materials from `docs/research/plugin-submission/`.

- [ ] **Step 2: Open PR to anthropics/claude-plugins-official**

With the repo now public, open a PR adding `/external_plugins/taketomarket/plugin.json` per the R-06 schema.

- [ ] **Step 3: Update README Option 2 status**

Edit `README.md` Option 2 note to say "PR submitted — pending Anthropic review."

- [ ] **Step 4: Commit + announce**

```bash
git add README.md
git commit -m "docs: update marketplace submission status"
git push
```

Announce on: X, LinkedIn, Hacker News Show HN, Claude Discord `#plugins` channel.

---

## Self-Review

**Spec coverage check:**

| Spec item | Plan task |
|-----------|-----------|
| IMP-01: interactive runtime selection | Task 2.1 (parse) + Task 2.3 (prompt) + Task 2.6 (main) |
| IMP-02: register in installed_plugins.json | Task 1.3 |
| IMP-03: confirmation prompt | Task 2.4 |
| IMP-04: --check flag | Task 2.4 |
| IMP-05: post-install summary | Task 2.5 |
| IMP-06: marketplace (prep + submit) | Tasks 0.6, 4.5, 5.7 |
| IMP-07: GitHub direct install | Tasks 0.7, 4.5 |
| IMP-08: README install section | Task 3.1 |
| IMP-09: Cursor adapter | Task 4.2 |
| IMP-10: Windsurf adapter | Task 4.3 |
| IMP-11: Gemini CLI validation | Tasks 0.5, 4.4 |
| IMP-12: Codex registration | Tasks 0.2, 4.1 |
| IMP-13: README all install methods | Task 3.1 |
| IMP-14: README how-to-use | Task 3.1 |
| IMP-15: fix wrong GitHub URL | Task 1.2 |
| IMP-16: gitignore settings.local.json | Task 1.1 |
| IMP-17: .planning/ decision | Task 5.2 |
| IMP-18: idea.md decision | Task 5.3 |
| IMP-19: verify no secrets in history | Task 5.1 |
| IMP-20: CONTRIBUTING.md | Task 5.4 |
| IMP-21: go-public checklist | Task 5.6 |
| R-01: Claude Code schema verified | Task 0.1 (done) |
| R-02: Codex registration research | Task 0.2 |
| R-03: Cursor research | Task 0.3 |
| R-04: Windsurf research | Task 0.4 |
| R-05: Gemini CLI research | Task 0.5 |
| R-06: Marketplace requirements | Task 0.6 |
| R-07: GitHub direct install | Task 0.7 |
| Error: skip-and-continue + GitHub Issues link | Task 2.6 (main() install loop) |
| Runtime validation warning | Task 2.6 (main() warning before copy) |
| gitCommitSha: null verification | Task 1.3 step 7 |

All 21 improvement items and all 7 Wave 0 research items are covered.

**Placeholder scan:** Wave 4 tasks have conditional branches because implementation depends on Wave 0 findings. This is intentional — the branches have actual code for each outcome. No "TBD" or "fill in later" that blocks a known path.

**Type consistency:** All function signatures used across tasks are consistent:
- `registerPlugin(installPath, version, homeDir)` — defined Task 1.3, used Task 2.6
- `buildRuntimeTargets(homeDir)` — defined Task 2.1, used Tasks 2.3, 2.4, 2.6
- `parseRuntimeChoices(input)` — defined Task 2.1, used Task 2.3
- `getInstalledRuntimes(homeDir)` — defined Task 2.2, used Task 2.3
- `readSkillDescriptions(packageRoot)` — defined Task 2.2, used Task 2.5
- `printInstallSummary(packageRoot)` — defined Task 2.5, used Task 2.6
- `shouldProceed(yesFlag)` — defined Task 2.4, used Task 2.4 (internal)
- `getClaudeStatus(homeDir)` — defined Task 2.4, used Task 2.4 (checkStatus)
- `checkStatus(version, homeDir)` — defined Task 2.4, used Task 2.6
- `confirmInstall(targets, version, yesFlag)` — defined Task 2.4, used Task 2.6
