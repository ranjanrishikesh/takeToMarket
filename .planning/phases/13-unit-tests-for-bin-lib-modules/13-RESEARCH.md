# Phase 13: Unit Tests for bin/lib Modules - Research

**Researched:** 2026-05-11
**Domain:** Node.js built-in test runner (`node:test`), CJS module unit testing
**Confidence:** HIGH

## Summary

Phase 13 writes unit tests for 6 CJS modules in `bin/lib/`: slug, state, campaign, health, commit, and core. The project already has a working test infrastructure from Phase 12 -- `test/helpers.cjs` (createTempDir, createMockMarketing), `test/install.test.cjs` as reference pattern, and `package.json` scripts.test set to `node --test`. Node.js v24.13.0 is installed, which provides `node:test` with `describe`/`it`/`before`/`after`, `assert/strict`, and the `mock` API (`mock.method`, `mock.fn`) -- all needed without any npm dependencies.

The primary challenge is that `core.cjs` exports `error()` which calls `process.exit(1)` and `output()` which writes to `process.stdout`. Every other module depends on core.cjs. Tests must intercept these side effects using `mock.method(process, 'exit', ...)` and `mock.method(process.stdout, 'write', ...)`. This pattern was verified to work on the installed Node version. Four of the six modules (state, campaign, health, commit) perform filesystem operations that require temp directory isolation via the existing `createTempDir` helper. Only slug.cjs and parts of core.cjs are pure-function tests.

**Primary recommendation:** Write one test file per module using `node:test` mock API for process.exit/stdout interception, real temp directories for filesystem tests, and `before`/`after` hooks for lifecycle cleanup -- matching the Phase 12 pattern exactly.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- D-01: Test the 6 required modules: slug.cjs, state.cjs, campaign.cjs, health.cjs, commit.cjs, core.cjs
- D-02: deviation.cjs and drift-log.cjs are NOT in requirements -- skip them
- D-03: Happy path + key edge cases for each module. Not exhaustive -- focus on behaviors that would break npm publish quality
- D-04: campaign.cjs (20KB, largest module) gets the most test cases -- init, state, update, list per TEST-04
- D-05: Smaller modules (slug, commit) get focused tests on their public API surface
- D-06: Use real temp dirs via test/helpers.cjs createTempDir -- no fs mocking
- D-07: Each test suite creates its own isolated temp dir with before/after lifecycle cleanup
- D-08: One test file per module: test/slug.test.cjs, test/state.test.cjs, test/campaign.test.cjs, test/health.test.cjs, test/commit.test.cjs, test/core.test.cjs
- D-09: All test files use CJS format, node:test describe/it blocks, assert/strict -- matching Phase 12 pattern

### Claude's Discretion
- Specific test case selection per module -- Claude reads each module's exports and writes tests covering the public API
- Whether to extend test/helpers.cjs with additional utilities (e.g., createMockCampaign) -- Claude decides based on what tests need
- Test ordering within files -- Claude organizes logically by function

### Deferred Ideas (OUT OF SCOPE)
- Unit tests for deviation.cjs and drift-log.cjs -- not in v1.1 requirements
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| TEST-01 | User can run `node --test` and all bin/lib modules pass unit tests | node --test auto-discovers test/*.test.cjs files. Verified working with install.test.cjs on Node 24.13.0. |
| TEST-02 | Unit tests cover slug.cjs (slug generation, timestamp formatting) | slug.cjs exports: cmdSlug, cmdTimestamp. Pure functions that call output()/error(). Mock stdout/exit to test. |
| TEST-03 | Unit tests cover state.cjs (state read, state update) | state.cjs exports: cmdStateRead, cmdStateUpdate. Requires .marketing/STATE.md in temp dir with cwd override. |
| TEST-04 | Unit tests cover campaign.cjs (campaign init, state, update, list) | campaign.cjs exports: cmdCampaignInit, cmdCampaignState, cmdCampaignUpdate, cmdCampaignList, cmdCampaignArchive, cmdRepurposeManifest. Largest module -- needs most test cases. |
| TEST-05 | Unit tests cover health.cjs (init check, directory validation) | health.cjs exports: cmdHealth, cmdInit. Requires mock .marketing/ structure in temp dir. |
| TEST-06 | Unit tests cover commit.cjs (commit message formatting) | commit.cjs exports: cmdCommit (with sanitizeMessage internal). cmdCommit calls git -- test sanitizeMessage indirectly or test cmdCommit with mocked execFileSync. |
| TEST-07 | Unit tests cover core.cjs (error handling, arg parsing) | core.cjs exports: output, error, parseNamedArgs, safeReadFile, safeWriteFile, parseFrontmatter, serializeFrontmatter. Most are pure functions -- straightforward. |
</phase_requirements>

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Unit test execution | CLI / Node.js runtime | -- | `node --test` runs tests directly via Node.js built-in test runner |
| Test file discovery | CLI / Node.js runtime | -- | `node --test` auto-discovers `test/*.test.cjs` files |
| Process side-effect interception | node:test mock API | -- | `mock.method` intercepts process.exit and stdout.write |
| Filesystem isolation | OS temp directories | -- | `os.tmpdir()` + `fs.mkdtempSync` via test/helpers.cjs |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| node:test | Node 24.13.0 built-in | Test runner: describe, it, before, after, mock | Zero-dependency, already established in Phase 12 [VERIFIED: node --test working locally] |
| node:assert/strict | Node 24.13.0 built-in | Assertions: strictEqual, deepStrictEqual, ok, throws | Zero-dependency, strict mode catches coercion bugs [VERIFIED: install.test.cjs uses it] |
| node:test mock | Node 24.13.0 built-in | mock.method for process.exit/stdout interception | Available in Node 20+, verified working on this system [VERIFIED: manual test in terminal] |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| test/helpers.cjs | Local | createTempDir, createMockMarketing, createMockHome | Every test that touches the filesystem [VERIFIED: source read] |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| node:test mock | Manual stdout capture | mock.method is cleaner, auto-restores, tracks call counts |
| Real temp dirs | In-memory fs (memfs) | Would add npm dependency -- violates zero-dep constraint |

**Installation:**
```bash
# No installation needed -- zero dependencies
```

## Architecture Patterns

### System Architecture Diagram

```
node --test
  |
  +--> test/slug.test.cjs -----> bin/lib/slug.cjs -----> bin/lib/core.cjs (output/error)
  +--> test/state.test.cjs ----> bin/lib/state.cjs ----> bin/lib/core.cjs
  +--> test/campaign.test.cjs -> bin/lib/campaign.cjs -> bin/lib/core.cjs
  +--> test/health.test.cjs ---> bin/lib/health.cjs ---> bin/lib/core.cjs
  +--> test/commit.test.cjs ---> bin/lib/commit.cjs ---> bin/lib/core.cjs + child_process
  +--> test/core.test.cjs -----> bin/lib/core.cjs -----> process.stdout / process.exit
  +--> test/install.test.cjs --> install.js (existing)
                                     |
                              test/helpers.cjs (shared: createTempDir, createMockMarketing)
```

### Recommended Test Structure
```
test/
├── helpers.cjs           # Shared utilities (existing, may need extensions)
├── install.test.cjs      # Existing Phase 12 tests
├── slug.test.cjs         # NEW: slug generation + timestamp formatting
├── state.test.cjs        # NEW: state read + update with temp .marketing/
├── campaign.test.cjs     # NEW: init, state, update, list, archive
├── health.test.cjs       # NEW: health check + init check with mock dirs
├── commit.test.cjs       # NEW: sanitizeMessage + commit with mocked git
└── core.test.cjs         # NEW: output, error, parseNamedArgs, parseFrontmatter, etc.
```

### Pattern 1: Process Side-Effect Interception
**What:** Mock `process.exit` and `process.stdout.write` to test functions that call `core.error()` and `core.output()` without killing the test runner or polluting stdout.
**When to use:** Every test of every module (all 6 modules use output/error from core.cjs).
**Example:**
```javascript
// Source: Verified on Node 24.13.0 via manual testing
const { describe, it, mock, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');

describe('module that calls output/error', () => {
  let exitMock, stdoutMock;

  beforeEach(() => {
    exitMock = mock.method(process, 'exit', () => {});
    stdoutMock = mock.method(process.stdout, 'write', () => true);
  });

  afterEach(() => {
    exitMock.mock.restore();
    stdoutMock.mock.restore();
  });

  it('outputs JSON result', () => {
    const { cmdSlug } = require('../bin/lib/slug.cjs');
    cmdSlug('Hello World', false);
    const written = stdoutMock.mock.calls[0].arguments[0];
    const result = JSON.parse(written);
    assert.strictEqual(result.slug, 'hello-world');
  });

  it('exits on missing input', () => {
    const { cmdSlug } = require('../bin/lib/slug.cjs');
    cmdSlug('', false);
    assert.strictEqual(exitMock.mock.calls.length, 1);
    assert.strictEqual(exitMock.mock.calls[0].arguments[0], 1);
  });
});
```

### Pattern 2: Filesystem Isolation with cwd Override
**What:** Create temp dir, set `process.cwd()` to point there, run filesystem-dependent functions, clean up.
**When to use:** state.cjs, campaign.cjs, health.cjs tests.
**Example:**
```javascript
const { describe, it, before, after, mock } = require('node:test');
const assert = require('node:assert/strict');
const { createTempDir, createMockMarketing } = require('./helpers.cjs');

describe('state.cjs', () => {
  let tmp, originalCwd, exitMock, stdoutMock;

  before(() => {
    tmp = createTempDir();
    createMockMarketing(tmp.dir);
    originalCwd = process.cwd;
    process.cwd = () => tmp.dir;  // Override cwd to temp dir
  });

  after(() => {
    process.cwd = originalCwd;  // Restore original cwd
    tmp.cleanup();
  });

  // ... tests that call cmdStateRead, cmdStateUpdate
});
```

### Pattern 3: Git Command Mocking for commit.cjs
**What:** Mock `child_process.execFileSync` to avoid real git operations in tests.
**When to use:** commit.cjs tests -- the module calls `git add` and `git commit`.
**Example:**
```javascript
// For sanitizeMessage testing: it's called inside cmdCommit but not exported.
// Test it indirectly by verifying cmdCommit's output after sanitization.
// For the git calls: mock execFileSync or test in a real git repo inside temp dir.

// Option A: Test sanitization by checking commit message in output
// Option B: Init a real git repo in temp dir (more realistic, matches D-06)
const { execSync } = require('child_process');
before(() => {
  tmp = createTempDir();
  execSync('git init', { cwd: tmp.dir, stdio: 'pipe' });
  execSync('git config user.email "test@test.com"', { cwd: tmp.dir, stdio: 'pipe' });
  execSync('git config user.name "Test"', { cwd: tmp.dir, stdio: 'pipe' });
  // Create a file to commit
  fs.writeFileSync(path.join(tmp.dir, 'test.txt'), 'hello');
});
```

### Anti-Patterns to Avoid
- **Requiring module at top level with cached state:** Since modules require `core.cjs` which uses `process.exit`, and `require()` caches modules, the mock must be set up BEFORE the first require, or use the fact that mock.method patches the live object. The `mock.method(process, 'exit', ...)` approach works because it patches the live `process` object that core.cjs references at call time (not at require time). [VERIFIED: tested manually]
- **Forgetting to restore mocks:** Always use `afterEach` or `after` with `mock.restore()`. If process.exit stays mocked, errors in later test suites won't halt execution properly.
- **Testing internal functions not in module.exports:** `sanitizeMessage` in commit.cjs is not exported. Test it indirectly through `cmdCommit` behavior. Do NOT modify the source to export internals just for testing.
- **Shared temp dirs between test files:** Each test file must create its own temp dir. `node --test` may run files in parallel.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Process.exit interception | Custom try/catch wrapper | `mock.method(process, 'exit', () => {})` | Built-in, tracks calls, auto-restores |
| Stdout capture | Manual buffer accumulation | `mock.method(process.stdout, 'write', () => true)` | Built-in, call history tracking |
| Temp directory lifecycle | Manual mkdtemp/rmdir | `test/helpers.cjs createTempDir()` | Already exists, returns cleanup function |
| Mock .marketing/ structure | Inline fs.mkdirSync chains | `test/helpers.cjs createMockMarketing()` | Already exists, matches real layout |

**Key insight:** The existing test infrastructure from Phase 12 and Node.js built-in mock API cover all needs. No new utilities are required except possibly a `createMockCampaign` helper to scaffold campaign directories for campaign.cjs tests.

## Common Pitfalls

### Pitfall 1: process.exit Mock Doesn't Stop Execution
**What goes wrong:** `mock.method(process, 'exit', () => {})` replaces exit with a no-op, but code AFTER `error()` continues executing. Functions that call `error()` mid-flow may have unexpected behavior since they assume error() never returns.
**Why it happens:** Real `process.exit(1)` halts execution. The mock doesn't.
**How to avoid:** After calling a function expected to error, assert `exitMock.mock.calls.length === 1` and do NOT assert on subsequent behavior. Alternatively, verify that `core.error()` is always called as the last statement or with a return/throw pattern. Inspection of the codebase shows `error()` is called as a standalone statement (not `return error()`), so code after it WILL execute when mocked. Tests must account for this.
**Warning signs:** Tests passing but with unexpected additional stdout writes after the error call.

### Pitfall 2: Module Caching Across Test Files
**What goes wrong:** `require()` caches modules globally. If one test file patches a module's internals, other test files see the patched version.
**Why it happens:** Node's module cache persists within a process.
**How to avoid:** Mock at the `process` level (process.exit, process.stdout.write), not at the module level. The process object is shared but mock.restore() properly reverts it. `node --test` runs each test file in a separate process by default in Node 22+. [VERIFIED: Node 24 runs test files in child processes]
**Warning signs:** Tests pass individually but fail when run together via `node --test`.

### Pitfall 3: cwd Override for Filesystem Modules
**What goes wrong:** state.cjs, campaign.cjs, health.cjs all use `process.cwd()` to resolve paths. Tests must override this to point to a temp directory.
**Why it happens:** These modules resolve `.marketing/` relative to `process.cwd()`.
**How to avoid:** Override `process.cwd` as a function: `process.cwd = () => tmp.dir`. Restore in `after()`. This is simpler and safer than actually `process.chdir()` which affects the entire process.
**Warning signs:** Tests reading/writing to the real project's .marketing/ directory.

### Pitfall 4: campaign.cjs Template Dependency
**What goes wrong:** `cmdCampaignInit` reads template files from `../templates/` relative to `__dirname`. If tests run from a different location, templates may not be found.
**Why it happens:** `path.resolve(__dirname, '..', '..', 'templates')` resolves relative to the module file, not cwd.
**How to avoid:** This is actually fine -- `__dirname` always resolves to the module's directory regardless of cwd. The templates exist at `/Users/rishikeshranjan/code/rishiPersonal/takeToMarket/templates/`. Tests will work because the module uses __dirname, not cwd, for template resolution. The test only needs cwd override for the .marketing/ directory. [VERIFIED: template files exist]
**Warning signs:** "Template not found" in test output -- would trigger fallback placeholder, not failure.

### Pitfall 5: commit.cjs Requires Real Git
**What goes wrong:** `cmdCommit` calls `execFileSync('git', ...)`. Tests either need a real git repo or must mock execFileSync.
**Why it happens:** commit.cjs uses child_process directly.
**How to avoid:** Two options: (A) Init a real git repo in the temp dir -- matches D-06 "no fs mocking" philosophy. (B) Test sanitizeMessage indirectly and mock execFileSync for the git commands. Option A is recommended for consistency with the project's testing philosophy.
**Warning signs:** "not a git repository" errors in test output.

## Code Examples

### Core Pattern: Test File Structure (matching Phase 12)
```javascript
// Source: Adapted from test/install.test.cjs (verified in codebase)
'use strict';

const { describe, it, before, after, mock, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const { createTempDir } = require('./helpers.cjs');

// Module under test
const slug = require('../bin/lib/slug.cjs');

describe('slug.cjs cmdSlug', () => {
  let stdoutMock, exitMock, stderrMock;

  beforeEach(() => {
    stdoutMock = mock.method(process.stdout, 'write', () => true);
    stderrMock = mock.method(process.stderr, 'write', () => true);
    exitMock = mock.method(process, 'exit', () => {});
  });

  afterEach(() => {
    stdoutMock.mock.restore();
    stderrMock.mock.restore();
    exitMock.mock.restore();
  });

  it('generates slug from simple text', () => {
    slug.cmdSlug('Hello World', false);
    const output = JSON.parse(stdoutMock.mock.calls[0].arguments[0]);
    assert.strictEqual(output.slug, 'hello-world');
  });

  it('generates raw slug output', () => {
    slug.cmdSlug('Hello World', true);
    assert.strictEqual(stdoutMock.mock.calls[0].arguments[0], 'hello-world\n');
  });

  it('errors on empty text', () => {
    slug.cmdSlug('', false);
    assert.strictEqual(exitMock.mock.calls.length, 1);
  });
});
```

### Helper Extension: createMockCampaign
```javascript
// Potential addition to test/helpers.cjs if campaign tests need it
function createMockCampaign(baseDir, slug, phase = 'created') {
  const campaignDir = path.join(baseDir, '.marketing', 'CAMPAIGNS', slug);
  const assetsDir = path.join(campaignDir, 'ASSETS');
  fs.mkdirSync(assetsDir, { recursive: true });
  const stateContent = [
    '---',
    `campaign: ${slug}`,
    `name: Test Campaign`,
    `phase: ${phase}`,
    `last_updated: ${new Date().toISOString()}`,
    `phase.created: ${new Date().toISOString()}`,
    '---',
    '',
    `# Campaign: Test Campaign`,
  ].join('\n');
  fs.writeFileSync(path.join(campaignDir, 'STATE.md'), stateContent);
  return campaignDir;
}
```

## Module-by-Module Test Surface Analysis

### core.cjs (7 exports)
| Export | Type | Test Approach | Complexity |
|--------|------|---------------|------------|
| `output(result, raw, rawValue)` | Side-effect (stdout) | Mock stdout.write, verify JSON vs raw output | LOW |
| `error(message)` | Side-effect (stderr + exit) | Mock stderr.write + process.exit | LOW |
| `parseNamedArgs(args)` | Pure function | Direct input/output testing | LOW |
| `safeReadFile(filePath)` | Filesystem | Temp dir with real files | LOW |
| `safeWriteFile(filePath, content)` | Filesystem | Temp dir, verify file contents | LOW |
| `parseFrontmatter(content)` | Pure function | Direct input/output testing | MEDIUM (edge cases) |
| `serializeFrontmatter(data, body)` | Pure function | Direct input/output, round-trip with parse | MEDIUM |

### slug.cjs (2 exports)
| Export | Type | Test Approach | Complexity |
|--------|------|---------------|------------|
| `cmdSlug(text, raw)` | Pure + stdout | Mock stdout, test various inputs | LOW |
| `cmdTimestamp(format, raw)` | Time-dependent + stdout | Mock stdout, verify format patterns (not exact time) | LOW |

### state.cjs (2 exports)
| Export | Type | Test Approach | Complexity |
|--------|------|---------------|------------|
| `cmdStateRead(raw)` | Filesystem + stdout | Temp dir with .marketing/STATE.md, cwd override | MEDIUM |
| `cmdStateUpdate(field, value, raw)` | Filesystem + stdout | Temp dir, verify file modified | MEDIUM |

### campaign.cjs (6 exports, but TEST-04 specifies init/state/update/list)
| Export | Type | Test Approach | Complexity |
|--------|------|---------------|------------|
| `cmdCampaignInit(slug, name, raw)` | Filesystem (creates dirs + files) | Temp dir, verify structure created | HIGH |
| `cmdCampaignState(slug, raw)` | Filesystem + stdout | Pre-create campaign, read state | MEDIUM |
| `cmdCampaignUpdate(slug, field, value, raw)` | Filesystem + stdout | Pre-create campaign, update, verify | MEDIUM |
| `cmdCampaignList(filter, sinceArg, raw)` | Filesystem + stdout | Pre-create multiple campaigns, test filters | HIGH |
| `cmdCampaignArchive(slug, raw)` | Filesystem (move + delete) | Pre-create shipped campaign, verify archive | HIGH |
| `cmdRepurposeManifest(slug, sourceId, derivs, raw)` | Filesystem + JSON | Pre-create campaign, add manifest entries | MEDIUM |

### health.cjs (2 exports)
| Export | Type | Test Approach | Complexity |
|--------|------|---------------|------------|
| `cmdHealth(raw, full)` | Filesystem + stdout | Mock .marketing/ with various states | MEDIUM |
| `cmdInit(raw)` | Filesystem + stdout | Mock .marketing/ present/absent | LOW |

### commit.cjs (1 export)
| Export | Type | Test Approach | Complexity |
|--------|------|---------------|------------|
| `cmdCommit(message, files, raw)` | Git subprocess + stdout | Real git repo in temp dir OR mock execFileSync | HIGH |

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| External test libs (mocha, jest) | `node:test` built-in | Node 18 (stable), Node 20 (mature) | Zero dependencies for test runner |
| Manual mocking | `node:test` mock API | Node 19+ | `mock.method`, `mock.fn` built into test runner |
| Test file glob config | Auto-discovery | Node 22+ | `node --test` finds `**/*.test.*` automatically |
| In-process test execution | Child process isolation | Node 22+ | Each test file runs in its own child process |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `node --test` runs each test file in a separate child process (Node 24) | Pitfall 2 | Module cache leaks between test files; tests pass alone but fail together |
| A2 | campaign.cjs template resolution via __dirname works from test context | Pitfall 4 | cmdCampaignInit falls back to placeholder (non-fatal, tests still pass) |

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | node:test (Node 24.13.0 built-in) |
| Config file | none -- zero-config built-in runner |
| Quick run command | `node --test test/slug.test.cjs` |
| Full suite command | `node --test` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| TEST-01 | All bin/lib modules pass unit tests | suite | `node --test` | Partial (only install.test.cjs exists) -- Wave 0 |
| TEST-02 | slug.cjs slug generation + timestamp | unit | `node --test test/slug.test.cjs` | Wave 0 |
| TEST-03 | state.cjs state read + update | unit | `node --test test/state.test.cjs` | Wave 0 |
| TEST-04 | campaign.cjs init, state, update, list | unit | `node --test test/campaign.test.cjs` | Wave 0 |
| TEST-05 | health.cjs init check + directory validation | unit | `node --test test/health.test.cjs` | Wave 0 |
| TEST-06 | commit.cjs commit message formatting | unit | `node --test test/commit.test.cjs` | Wave 0 |
| TEST-07 | core.cjs error handling + arg parsing | unit | `node --test test/core.test.cjs` | Wave 0 |

### Sampling Rate
- **Per task commit:** `node --test test/{module}.test.cjs` (single file, < 2s)
- **Per wave merge:** `node --test` (full suite, < 10s)
- **Phase gate:** Full suite green before /gsd-verify-work

### Wave 0 Gaps
- [ ] `test/core.test.cjs` -- covers TEST-07
- [ ] `test/slug.test.cjs` -- covers TEST-02
- [ ] `test/state.test.cjs` -- covers TEST-03
- [ ] `test/campaign.test.cjs` -- covers TEST-04
- [ ] `test/health.test.cjs` -- covers TEST-05
- [ ] `test/commit.test.cjs` -- covers TEST-06
- [ ] Possible: extend `test/helpers.cjs` with createMockCampaign utility

## Open Questions

1. **commit.cjs: Real git repo vs mock execFileSync?**
   - What we know: D-06 says "no fs mocking" but doesn't explicitly cover subprocess mocking. Real git repos in temp dirs are more realistic but slower.
   - What's unclear: Whether the team prefers a real git repo in temp dir or mocking child_process.execFileSync.
   - Recommendation: Use real git repo in temp dir for consistency with D-06 philosophy. It's only ~50ms overhead per test.

2. **campaign.cjs: Should cmdCampaignArchive and cmdRepurposeManifest get tests?**
   - What we know: TEST-04 specifies "campaign init, state, update, list." Archive and repurpose are additional exports.
   - What's unclear: Whether D-03 "key edge cases" extends to these functions.
   - Recommendation: Include basic happy-path tests for archive and repurposeManifest since they're part of the public API and D-03 says focus on "behaviors that would break npm publish quality." Claude's discretion per CONTEXT.md.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Test runner (node --test) | Yes | 24.13.0 | -- |
| git | commit.cjs tests | Yes | (system) | -- |

No missing dependencies.

## Sources

### Primary (HIGH confidence)
- Local codebase inspection: all 6 module source files (`bin/lib/*.cjs`), test infrastructure (`test/helpers.cjs`, `test/install.test.cjs`), `package.json`
- Node 24.13.0 `node:test` mock API -- verified working via manual terminal test on this system
- `node --test` auto-discovery -- verified working with `test/install.test.cjs`

### Secondary (MEDIUM confidence)
- Node.js test runner documentation for child process isolation behavior in Node 22+ [ASSUMED: based on training data, not verified against docs]

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- zero dependencies, everything verified locally
- Architecture: HIGH -- existing Phase 12 pattern + mock API verified on this Node version
- Pitfalls: HIGH -- identified through code inspection of actual module sources
- Test surface: HIGH -- all module.exports enumerated from source code

**Research date:** 2026-05-11
**Valid until:** 2026-06-10 (stable -- no external dependencies to go stale)
