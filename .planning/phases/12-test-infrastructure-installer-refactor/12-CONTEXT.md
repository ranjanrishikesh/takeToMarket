# Phase 12: Test Infrastructure & Installer Refactor - Context

**Gathered:** 2026-05-11
**Status:** Ready for planning

<domain>
## Phase Boundary

Make install.js testable via require() without triggering side effects, and establish the test runner foundation (node:test + test helpers) that Phases 13 and 14 depend on. This phase does NOT write unit tests for bin/lib modules (Phase 13) or E2E tests (Phase 14) — it builds the infrastructure they need.

</domain>

<decisions>
## Implementation Decisions

### Installer Refactor (TEST-08)
- **D-01:** Add `require.main === module` guard around `main()` call at install.js line 286 so `require('./install.js')` returns exported functions without triggering install or process.exit
- **D-02:** Export key functions (detectRuntime, validateInstall, copyDirSync, dirExists, fileExists, printResults) for testability
- **D-03:** Preserve backwards compatibility — `npx taketomarket` must still work identically after refactor

### Test Runner Setup (TEST-11)
- **D-04:** Use `node:test` built-in (Node 18+) — no external test framework dependencies, consistent with zero-dep constraint
- **D-05:** Set `package.json scripts.test` to `node --test`
- **D-06:** CJS format for test files (matches codebase convention)

### Test Helper Utilities
- **D-07:** Create test helpers for downstream phases: temp directory creation, mock .marketing/ scaffold, isolated HOME override for E2E tests
- **D-08:** Helpers live in a shared location accessible to Phase 13 (unit) and Phase 14 (E2E) test files

### Claude's Discretion
- Test file naming convention (*.test.cjs vs *.test.js) — Claude decides based on codebase patterns
- Test directory structure (test/ root dir vs colocated) — Claude decides based on project size
- Specific helper API surface — Claude designs based on what downstream tests will need

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Installer
- `install.js` — Current installer, 286 lines. All functions defined but not exported. main() called unconditionally at EOF.

### CLI Modules (context for helper design)
- `bin/ttm-tools.cjs` — CLI entry point
- `bin/lib/slug.cjs` — Slug generation and timestamp formatting
- `bin/lib/state.cjs` — State read/update
- `bin/lib/campaign.cjs` — Campaign init, state, update, list
- `bin/lib/health.cjs` — Init check, directory validation
- `bin/lib/commit.cjs` — Commit message formatting
- `bin/lib/core.cjs` — Error handling, arg parsing

### Project Config
- `package.json` — Current config, missing scripts.test field

### Requirements
- `.planning/REQUIREMENTS.md` — TEST-08 and TEST-11 assigned to this phase

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- install.js already has well-structured functions (detectRuntime, validateInstall, copyDirSync) — just need to export them
- All bin/lib modules are CJS with clear function exports — test helpers should mirror this pattern

### Established Patterns
- CJS modules with `module.exports` at bottom of file
- Node.js built-in only (fs, path, os) — no npm dependencies
- `dirExists()` and `fileExists()` helpers already defined in install.js

### Integration Points
- package.json `scripts.test` — new field
- install.js line 286 — require.main guard wraps existing `main()` call
- Test helpers must create realistic directory structures matching DIRS_TO_COPY constant

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches. User confirmed understanding of test purpose (protecting npm publish quality) and delegated implementation decisions to Claude.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 12-Test Infrastructure & Installer Refactor*
*Context gathered: 2026-05-11*
