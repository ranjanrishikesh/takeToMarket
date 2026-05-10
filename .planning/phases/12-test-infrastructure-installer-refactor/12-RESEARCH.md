# Phase 12: Test Infrastructure & Installer Refactor - Research

**Researched:** 2026-05-11
**Domain:** Node.js built-in test runner (node:test), CJS module testability
**Confidence:** HIGH

## Summary

Phase 12 establishes the test foundation that Phases 13 and 14 depend on. Two concrete deliverables: (1) refactor install.js so `require('./install.js')` returns exported functions without triggering side effects (require.main guard + module.exports), and (2) set up node:test runner infrastructure with test helpers for downstream phases.

The codebase is zero-dependency CJS (Node 18+). The built-in `node:test` module is the only viable test framework given the zero-dep constraint. Node 24.13.0 is installed locally, which has full node:test support including `describe`, `it`, `test`, `mock`, and `assert`. The `node --test` CLI auto-discovers `**/*.test.cjs` files by default, so test files using `.test.cjs` extension will be found without any configuration.

**Primary recommendation:** Use `require.main === module` guard pattern on install.js line 286, export all utility functions via `module.exports`, create `test/` directory with `helpers.cjs` providing temp directory and mock scaffold utilities, and set `scripts.test` to `node --test`.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Add `require.main === module` guard around `main()` call at install.js line 286 so `require('./install.js')` returns exported functions without triggering install or process.exit
- **D-02:** Export key functions (detectRuntime, validateInstall, copyDirSync, dirExists, fileExists, printResults) for testability
- **D-03:** Preserve backwards compatibility -- `npx taketomarket` must still work identically after refactor
- **D-04:** Use `node:test` built-in (Node 18+) -- no external test framework dependencies, consistent with zero-dep constraint
- **D-05:** Set `package.json scripts.test` to `node --test`
- **D-06:** CJS format for test files (matches codebase convention)
- **D-07:** Create test helpers for downstream phases: temp directory creation, mock .marketing/ scaffold, isolated HOME override for E2E tests
- **D-08:** Helpers live in a shared location accessible to Phase 13 (unit) and Phase 14 (E2E) test files

### Claude's Discretion
- Test file naming convention (*.test.cjs vs *.test.js) -- Claude decides based on codebase patterns
- Test directory structure (test/ root dir vs colocated) -- Claude decides based on project size
- Specific helper API surface -- Claude designs based on what downstream tests will need

### Deferred Ideas (OUT OF SCOPE)
None
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| TEST-08 | install.js has require.main guard for testability | require.main === module pattern verified in Node.js docs; install.js line 286 identified as the guard insertion point; module.exports pattern matches existing bin/lib/*.cjs conventions |
| TEST-11 | package.json has `scripts.test` set to `node --test` | node --test auto-discovers **/*.test.{cjs,mjs,js} files; Node 24.13.0 installed locally; no configuration file needed |
</phase_requirements>

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Installer refactor (require.main guard) | CLI / Node.js runtime | -- | install.js is a CLI entry point; guard is a Node.js module-system concern |
| Test runner setup | CLI / Node.js runtime | -- | node:test is built into Node.js; package.json scripts.test is the entry point |
| Test helpers | Test infrastructure | -- | Shared utilities consumed by test files only, not production code |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| node:test | Built-in (Node 18+) | Test runner, describe/it/test, mocking | Zero-dependency requirement; built into Node.js; no npm install needed [VERIFIED: local Node 24.13.0 exports: test, describe, it, mock, assert, before, after, beforeEach, afterEach] |
| node:assert | Built-in | Assertions (strictEqual, deepStrictEqual, throws) | Paired with node:test; standard Node.js assertion library [VERIFIED: Node.js docs] |
| node:fs | Built-in | Temp directory creation, file operations in test helpers | Already used throughout codebase [VERIFIED: install.js imports] |
| node:os | Built-in | tmpdir() for isolated test directories, homedir() mocking | Already used in install.js [VERIFIED: install.js imports] |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| node:path | Built-in | Path construction in test helpers | Already used throughout codebase |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| node:test | Jest, Vitest, Mocha | All require npm install, violating zero-dep constraint. Not viable. |
| node:assert | chai | npm dependency. node:assert is sufficient for this project's needs. |

**Installation:**
```bash
# No installation needed -- all built-in modules
```

**Version verification:** Node.js 24.13.0 installed locally [VERIFIED: `node --version` output]. node:test is stable in Node 18+ [CITED: https://github.com/nodejs/node/blob/main/doc/api/test.md].

## Architecture Patterns

### System Architecture Diagram

```
package.json scripts.test
        |
        v
  node --test (CLI)
        |
        v
  Auto-discover **/*.test.cjs
        |
        +---> test/install.test.cjs     (Phase 12: smoke test)
        +---> test/slug.test.cjs        (Phase 13: unit tests)
        +---> test/state.test.cjs       (Phase 13: unit tests)
        +---> test/e2e-install.test.cjs (Phase 14: E2E tests)
        |
        v
  Each test file:
    require('node:test')  +  require('node:assert')
    require('./helpers.cjs')  (shared test utilities)
    require('../install.js')  (now safe -- no side effects)
    require('../bin/lib/*.cjs')  (already exportable)
```

### Recommended Project Structure
```
takeToMarket/
├── install.js              # Refactored: require.main guard + module.exports
├── package.json            # Added: scripts.test = "node --test"
├── bin/
│   ├── ttm-tools.cjs
│   └── lib/
│       ├── slug.cjs
│       ├── state.cjs
│       ├── campaign.cjs
│       ├── health.cjs
│       ├── commit.cjs
│       └── core.cjs
└── test/                   # NEW: test directory
    ├── helpers.cjs         # Shared test utilities
    └── install.test.cjs    # Smoke test: require() works, exports exist
```

### Pattern 1: require.main Guard
**What:** Prevents `main()` from executing when file is `require()`'d by tests
**When to use:** Any CJS file that is both a CLI entry point AND needs to be importable for testing
**Example:**
```javascript
// Source: Node.js docs, standard CJS pattern
// Before (install.js line 286):
main();

// After:
if (require.main === module) {
  main();
}

module.exports = {
  detectRuntime,
  validateInstall,
  copyDirSync,
  dirExists,
  fileExists,
  printResults,
  DIRS_TO_COPY,
  FILES_TO_COPY,
};
```
[VERIFIED: require.main === module is documented in Node.js module docs as the standard entry-point guard pattern]

### Pattern 2: node:test CJS Test File
**What:** Minimal test file structure using built-in test runner
**When to use:** All test files in this project
**Example:**
```javascript
// Source: https://github.com/nodejs/node/blob/main/doc/api/test.md
'use strict';

const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { createTempDir, createMockMarketing } = require('./helpers.cjs');

describe('install.js exports', () => {
  it('can be required without side effects', () => {
    const install = require('../install.js');
    assert.ok(install);
    assert.strictEqual(typeof install.detectRuntime, 'function');
  });
});
```
[VERIFIED: CJS require pattern confirmed working with node:test via Context7 docs]

### Pattern 3: Test Helper with Temp Directory
**What:** Shared helper that creates isolated temp directories for test runs
**When to use:** Any test that needs filesystem isolation
**Example:**
```javascript
// test/helpers.cjs
'use strict';

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

/**
 * Create an isolated temp directory for a test.
 * Returns { dir, cleanup } where cleanup() removes the directory.
 */
function createTempDir(prefix = 'ttm-test-') {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  return {
    dir,
    cleanup() {
      fs.rmSync(dir, { recursive: true, force: true });
    },
  };
}

/**
 * Create a mock .marketing/ directory structure.
 * @param {string} baseDir - Directory to create .marketing/ inside
 */
function createMockMarketing(baseDir) {
  const marketingDir = path.join(baseDir, '.marketing');
  fs.mkdirSync(marketingDir, { recursive: true });
  fs.writeFileSync(
    path.join(marketingDir, 'STATE.md'),
    '---\nstatus: active\n---\n# Marketing State\n'
  );
  fs.writeFileSync(
    path.join(marketingDir, 'POSITIONING.md'),
    '# Positioning\n'
  );
  return marketingDir;
}

/**
 * Create a mock HOME directory with .claude/ structure for E2E tests.
 * @param {string} baseDir - Directory to use as mock HOME
 */
function createMockHome(baseDir) {
  const claudeDir = path.join(baseDir, '.claude', 'plugins', 'taketomarket');
  fs.mkdirSync(claudeDir, { recursive: true });
  return baseDir;
}

module.exports = {
  createTempDir,
  createMockMarketing,
  createMockHome,
};
```
[ASSUMED: Helper API surface designed based on downstream test needs in Phases 13/14]

### Anti-Patterns to Avoid
- **Calling process.exit() in exported functions:** Tests cannot catch process.exit. Keep process.exit only in the `if (require.main === module)` block or in `main()`. Functions exported for testing should throw errors or return status codes instead.
- **Global state mutation without cleanup:** Each test must create and clean up its own temp directories. Use `after()` hooks for cleanup.
- **Testing with real HOME directory:** E2E tests that install to `~/.claude/` would modify the developer's actual environment. Always use mock HOME via temp directories.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Temp directories | Manual mkdir + random name | `fs.mkdtempSync(os.tmpdir())` | Built-in, guaranteed unique, OS-appropriate temp path [VERIFIED: Node.js fs docs] |
| Assertions | Custom equality checks | `node:assert/strict` | Built-in, descriptive error messages, deep equality support |
| Test mocking | Custom spy functions | `node:test` `mock.fn()` and `t.mock.method()` | Built-in, tracks calls/arguments/results [VERIFIED: Context7 node:test docs] |
| Module mocking | require cache manipulation | `t.mock.module()` (Node 22+) | Built-in, handles both CJS and ESM, auto-restores [VERIFIED: Context7 node:test docs] |

**Key insight:** Node.js 24 has a complete test toolkit built-in. Every piece of test infrastructure needed is available without npm dependencies.

## Common Pitfalls

### Pitfall 1: require.main Guard Breaks npx
**What goes wrong:** Adding the guard but forgetting that `npx taketomarket` runs install.js as the main module
**Why it happens:** Misunderstanding that `require.main === module` is true when Node.js runs the file directly
**How to avoid:** `require.main === module` is true for `node install.js` and `npx taketomarket` -- both cases where the file IS the entry point. It is only false when another file `require()`s it. The guard preserves backwards compatibility by design.
**Warning signs:** `npx taketomarket` stops working after refactor

### Pitfall 2: process.exit in Exported Functions
**What goes wrong:** Tests crash abruptly because a tested function calls `process.exit()`
**Why it happens:** install.js `main()` calls `process.exit(0)` and `process.exit(1)` in several places
**How to avoid:** The require.main guard keeps `main()` from running during tests. If tests need to test main() behavior, they should spawn a child process. Do NOT remove process.exit from main() -- it is correct for CLI usage.
**Warning signs:** Test process exits with code 0 or 1 mid-run

### Pitfall 3: node --test Ignoring .cjs Files
**What goes wrong:** `node --test` does not find test files
**Why it happens:** Older Node.js versions (<18.17) did not auto-discover `.test.cjs`. In Node 24, the default patterns include `**/*.test.{cjs,mjs,js}`.
**How to avoid:** Node 24.13.0 is installed locally -- `.test.cjs` works. If targeting Node 18 minimum (per engines field), verify that `**/*.test.cjs` is matched. Alternatively, use explicit glob: `node --test "test/**/*.test.cjs"`.
**Warning signs:** `npm test` reports "no tests found"

### Pitfall 4: Test Files Included in npm Package
**What goes wrong:** `npm pack` includes the test/ directory in the published tarball
**Why it happens:** package.json `files` array is an allowlist, so test/ is excluded by default. But if someone adds `"test/"` to files array, it gets included.
**How to avoid:** Do NOT add `test/` to the `files` array in package.json. The current `files` array is an allowlist that already excludes test/. Verify with `npm pack --dry-run`.
**Warning signs:** tarball size increases; `npm pack --dry-run` shows test files

### Pitfall 5: __dirname in Tests Points to test/ Directory
**What goes wrong:** Tests that `require('../install.js')` get the right file, but install.js internally uses `__dirname` (PACKAGE_ROOT) which points to the repo root -- this is correct. However, test helpers that use `__dirname` will get the test/ directory.
**Why it happens:** `__dirname` is relative to the file that uses it
**How to avoid:** Be explicit about paths in test helpers. Use `path.resolve(__dirname, '..')` when needing the project root from test files.
**Warning signs:** "File not found" errors when tests try to access project files

## Code Examples

### install.js Refactored Bottom Section
```javascript
// Source: Standard CJS pattern + project convention from bin/lib/*.cjs

// Replace line 286 (currently: main();) with:
if (require.main === module) {
  main();
}

module.exports = {
  main,
  detectRuntime,
  validateInstall,
  copyDirSync,
  dirExists,
  fileExists,
  printResults,
  DIRS_TO_COPY,
  FILES_TO_COPY,
};
```
[VERIFIED: Matches CJS export pattern used in bin/lib/slug.cjs, bin/lib/state.cjs, etc.]

### Smoke Test for install.js Exports
```javascript
// test/install.test.cjs
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

describe('install.js module', () => {
  it('can be required without triggering install', () => {
    const install = require('../install.js');
    assert.ok(install, 'module exports an object');
  });

  it('exports expected functions', () => {
    const install = require('../install.js');
    const expectedFns = [
      'detectRuntime',
      'validateInstall',
      'copyDirSync',
      'dirExists',
      'fileExists',
      'printResults',
    ];
    for (const fn of expectedFns) {
      assert.strictEqual(typeof install[fn], 'function', `exports.${fn} is a function`);
    }
  });

  it('exports DIRS_TO_COPY as an array', () => {
    const install = require('../install.js');
    assert.ok(Array.isArray(install.DIRS_TO_COPY));
    assert.ok(install.DIRS_TO_COPY.length > 0);
  });
});
```

### package.json scripts.test Addition
```json
{
  "scripts": {
    "test": "node --test"
  }
}
```
[VERIFIED: node --test auto-discovers **/*.test.{cjs,mjs,js} in Node 24 per official docs]

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| node:test experimental | node:test stable | Node 20+ (2023) | Fully stable API, no --experimental flag needed |
| Manual test file listing | node --test auto-discovery | Node 18.17+ (2023) | Discovers *.test.{cjs,mjs,js} automatically |
| External mock libraries | node:test mock.fn() / t.mock.module() | Node 18+ / 22+ | Built-in mocking, no sinon/proxyquire needed |
| tap/spec reporters only | Built-in spec reporter | Node 20+ | `node --test --reporter spec` for human-readable output |

**Deprecated/outdated:**
- `--experimental-test-runner` flag: No longer needed since Node 20. Just use `--test`.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Helper API surface (createTempDir, createMockMarketing, createMockHome) covers downstream Phase 13/14 needs | Architecture Patterns > Pattern 3 | LOW -- helpers can be extended in later phases; starting set covers the obvious needs |
| A2 | `.test.cjs` extension auto-discovered by node --test in Node 18 minimum | Common Pitfalls > Pitfall 3 | MEDIUM -- may need explicit glob `"test/**/*.test.cjs"` in scripts.test for Node 18 compatibility. Safe on Node 24 (verified). Fallback: `node --test "test/**/*.test.cjs"` |

## Open Questions

1. **Should scripts.test use explicit glob for Node 18 safety?**
   - What we know: Node 24 auto-discovers `.test.cjs`. Node 18.17+ supports auto-discovery but early 18.x may not include `.cjs` extension.
   - What's unclear: Exact Node 18.0-18.16 behavior for `.cjs` discovery
   - Recommendation: Use `"node --test"` (simple). The `engines` field requires `>=18` but practically all users will have 20+. If issues arise, switch to `"node --test \"test/**/*.test.cjs\""`.

2. **Should main() itself be exported?**
   - What we know: D-02 lists specific functions but not `main()`. main() calls process.exit which makes it hard to test directly.
   - What's unclear: Whether Phase 14 E2E tests will need to call main() programmatically or spawn a child process
   - Recommendation: Export main() for completeness but document that E2E tests should use `child_process.execSync('node install.js ...')` to test the full CLI flow, since main() calls process.exit.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | node:test (built-in, Node 24.13.0) |
| Config file | none -- zero configuration needed |
| Quick run command | `npm test` |
| Full suite command | `npm test` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| TEST-08 | require('./install.js') returns exports without side effects | unit | `node --test test/install.test.cjs` | Wave 0 |
| TEST-11 | package.json scripts.test set to node --test | smoke | `node -e "const p=require('./package.json'); process.exit(p.scripts?.test === 'node --test' ? 0 : 1)"` | N/A (config check) |

### Sampling Rate
- **Per task commit:** `npm test`
- **Per wave merge:** `npm test`
- **Phase gate:** `npm test` passes + `require('./install.js')` returns object with all expected exports

### Wave 0 Gaps
- [ ] `test/` directory -- does not exist yet
- [ ] `test/helpers.cjs` -- shared test utilities for Phases 13/14
- [ ] `test/install.test.cjs` -- smoke test for install.js exports
- [ ] `package.json scripts.test` -- field does not exist

## Security Domain

Not applicable for this phase. Test infrastructure and installer refactoring do not introduce authentication, session management, access control, cryptography, or input validation concerns. The refactor preserves existing security properties (home directory path validation in install.js lines 196-199).

## Sources

### Primary (HIGH confidence)
- [/nodejs/node via Context7] - node:test API (describe, it, test, mock), CJS require pattern, default file discovery patterns
- [Local filesystem] - install.js (286 lines), package.json, bin/lib/*.cjs module structure
- [Local environment] - Node.js v24.13.0 confirmed via `node --version`

### Secondary (MEDIUM confidence)
- [Node.js official docs: test.md] - Default file patterns: **/*.test.{cjs,mjs,js}, **/*-test.{cjs,mjs,js}, **/test/**/*.{cjs,mjs,js}
- [Node.js official docs: modules.md] - require.main === module pattern for entry-point detection

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All built-in Node.js modules, verified locally
- Architecture: HIGH - Straightforward CJS refactor + test setup; patterns verified against existing codebase conventions
- Pitfalls: HIGH - Well-documented patterns; require.main guard is decades-old Node.js convention

**Research date:** 2026-05-11
**Valid until:** 2026-06-11 (stable -- Node.js built-in APIs change slowly)
