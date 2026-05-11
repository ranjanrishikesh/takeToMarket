# Phase 14: E2E & Integration Tests - Context

**Gathered:** 2026-05-11
**Status:** Ready for planning

<domain>
## Phase Boundary

Validate the **full install.js flow** end-to-end in isolated environments — proving the user experience (`npx taketomarket` and `--dry-run`) actually works without polluting the developer's real `~/.claude/` or `~/.codex/` directories. This phase does NOT add unit tests for individual functions (Phase 13 covered that) or touch package.json metadata (Phase 15).

</domain>

<decisions>
## Implementation Decisions

### Test File Organization
- **D-01:** New file `test/install-e2e.test.cjs` (separate from `test/install.test.cjs` which holds Phase 12's require()-level unit tests). Keeps E2E (slow, child-process) distinct from unit (fast, in-process).
- **D-02:** CJS, `node:test` describe/it, `assert/strict` — same conventions as Phases 12 and 13.
- **D-03:** Discovered automatically by `node --test 'test/*.test.cjs'` (already glob-matched per Phase 12 setup).

### Execution Strategy
- **D-04:** Use **`child_process.execFileSync`** (not `require()`) to invoke install.js. True E2E means running it the way users do — through the CLI entry point, not via in-process require. The Phase 12 `require.main` guard exists for the unit tests; this phase validates the executable surface.
- **D-05:** `execFileSync('node', ['install.js', ...args], { env, cwd, timeout: 30000, encoding: 'utf-8' })` — sync for test simplicity, 30s timeout to prevent hangs.
- **D-06:** Capture stdout/stderr from execFileSync return value + caught error for assertion (validates --dry-run output text).

### Isolation Strategy
- **D-07:** Each test creates a temp dir via `createTempDir()` and uses it as `HOME` via `env: { ...process.env, HOME: tempDir }` override. This is the canonical "isolated HOME" pattern (success criterion 3).
- **D-08:** Reuse `createMockHome(baseDir)` helper from `test/helpers.cjs` (Phase 12) to pre-create `.claude/` or `.codex/` skeletons when testing runtime auto-detection.
- **D-09:** `cwd` for execFileSync is the project root (where install.js lives). The PACKAGE_ROOT constant in install.js uses `__dirname` so it resolves correctly regardless of cwd.

### Coverage Scope
- **D-10:** Both runtime targets — `claude` AND `codex`. install.js has separate code paths for each (target dir, namespacing); both must validate or the cross-runtime promise breaks.
- **D-11:** Test the following scenarios:
  - **Happy path / claude:** clean HOME → install → all DIRS_TO_COPY + FILES_TO_COPY present at `~/.claude/plugins/taketomarket/`
  - **Happy path / codex:** clean HOME → `--runtime codex` → files present at the codex target path
  - **Auto-detect runtime:** create `.claude/` in mock HOME, run install with no `--runtime` flag → installs to claude
  - **--dry-run on clean HOME:** runs without writing files; output mentions "dry-run" or "would install"
  - **--dry-run on installed HOME:** runs after a real install → reports validation pass for files copied
  - **Unknown --runtime arg:** install.js currently warns + defaults to claude — verify warning appears in stderr and install completes
- **D-12:** Skip "missing source dir" / "permission denied" / "disk full" — these are infrastructure failures, not user-flow failures, and TEST-09/TEST-10 don't require them.

### Assertion Depth
- **D-13:** For each happy-path install, assert: (a) every entry in `DIRS_TO_COPY` exists as a directory at the target, (b) every entry in `FILES_TO_COPY` exists as a file at the target, (c) at least one specific known file inside `bin/` and `skills/` exists (spot-check the copy actually copied, not just `mkdir`).
- **D-14:** For --dry-run, assert: target dir does NOT exist after run, AND stdout contains the expected dry-run banner/summary string.
- **D-15:** Do NOT deep-diff source tree against installed tree — fragile, no extra confidence past directory + spot-check.

### Cross-Runtime Tooling Tax
- **D-16:** No new helpers required. `createMockHome` from Phase 12 + `createTempDir` cover the isolation needs. If repeated env-override boilerplate piles up, the planner may extract a `runInstall(args, env)` helper inside the test file (NOT in helpers.cjs — it's E2E-specific).

### Claude's Discretion
- Specific test ordering within file
- Whether to run claude + codex back-to-back in the same temp HOME or in separate temp HOMEs (recommend: separate, prevents cross-contamination)
- Exact assertion text for --dry-run banner detection — read the actual install.js output to match
- Whether to add a smoke test for `--runtime` flag precedence over auto-detection (nice-to-have, low cost)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Code Under Test
- `install.js` — Installer entry point. PACKAGE_ROOT (line 11), DIRS_TO_COPY (lines 13-23), FILES_TO_COPY (lines 25-27), detectRuntime (lines 38-65), main + require.main guard (around line 286)
- `package.json` — `scripts.test` set to `node --test` (Phase 12)

### Test Infrastructure (from Phase 12 + 13)
- `test/helpers.cjs` — `createTempDir`, `createMockMarketing`, `createMockHome`, `createMockCampaign` (last one not needed here, but file is the canonical helper module)
- `test/install.test.cjs` — Reference pattern for require()-level install tests; do NOT duplicate, this phase is child-process E2E
- `test/campaign.test.cjs` — Reference for ExitError sentinel + per-describe temp dir isolation patterns

### Requirements
- `.planning/REQUIREMENTS.md` — TEST-09 (E2E install in isolated temp dir) and TEST-10 (E2E --dry-run validation) assigned to this phase

### Prior Phase Decisions
- `.planning/phases/12-test-infrastructure-installer-refactor/12-CONTEXT.md` — D-04 locked node:test, D-06 locked CJS test format, D-07 locked helper utilities
- `.planning/phases/13-unit-tests-for-bin-lib-modules/13-CONTEXT.md` — D-06 locked real temp dirs (no fs mocking), D-09 locked CJS + node:test + assert/strict

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `createTempDir()` — isolated temp dir + cleanup, used by all Phase 12/13 tests
- `createMockHome(baseDir)` — pre-creates `.claude/plugins/taketomarket/` skeleton inside baseDir; baseDir doubles as HOME env var
- install.js `validateInstall()` — already exported per TEST-08, can be reused for verification helpers if needed
- install.js `dirExists` / `fileExists` — exported helpers usable from test code

### Established Patterns
- CJS test files with `'use strict'`, `require('node:test')`, `require('node:assert/strict')`
- before/after hooks for temp dir lifecycle
- Tests live in `test/` root, glob-matched by `test/*.test.cjs`
- Sync APIs preferred (execFileSync, fs.*Sync) — easier to reason about in tests, no async leak risk

### Integration Points
- install.js reads PACKAGE_ROOT via `__dirname` — execFileSync from any cwd works as long as we pass the install.js path
- HOME env var override via `{ env: { ...process.env, HOME: tempDir } }` — install.js reads `os.homedir()` which respects $HOME on POSIX
- On macOS, `os.homedir()` honors `$HOME` reliably (verified Node 18+ behavior)
- Windows note: `os.homedir()` reads `USERPROFILE` not `HOME` — these tests will run in CI on Ubuntu/macOS only; document the caveat in test file header but do not handle Windows in this phase

</code_context>

<specifics>
## Specific Ideas

User delegated all decisions to Claude. The locked decisions above derive from: ROADMAP success criteria (3 explicit asks), Phase 12/13 conventions (test runner, helpers, file naming), and standard E2E test design (child process + isolated env).

</specifics>

<deferred>
## Deferred Ideas

- Windows HOME / USERPROFILE handling — not in v1.1 scope, npm registry tests run on Linux/macOS
- Permission-denied / disk-full / corrupted-source failure modes — infrastructure tests, not user-flow tests
- Update / re-install upgrade flow tests — Phase 15 (publish + upgrade lifecycle) territory
- Performance regression tests (install time budget) — not in v1.1 scope

</deferred>

---

*Phase: 14-E2E & Integration Tests*
*Context gathered: 2026-05-11*
