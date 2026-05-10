# Phase 13: Unit Tests for bin/lib Modules - Context

**Gathered:** 2026-05-11
**Status:** Ready for planning

<domain>
## Phase Boundary

Write unit tests for all 6 required bin/lib CJS modules (slug, state, campaign, health, commit, core) so regressions get caught before code ships to the npm registry. This phase does NOT cover E2E/integration tests (Phase 14) or package metadata (Phase 15).

</domain>

<decisions>
## Implementation Decisions

### Coverage Scope
- **D-01:** Test the 6 required modules: slug.cjs, state.cjs, campaign.cjs, health.cjs, commit.cjs, core.cjs
- **D-02:** deviation.cjs and drift-log.cjs exist but are NOT in requirements — skip them. Can be added in a future phase if needed.

### Test Depth
- **D-03:** Happy path + key edge cases for each module. Not exhaustive coverage — focus on behaviors that would break npm publish quality.
- **D-04:** campaign.cjs (20KB, largest module) gets the most test cases — init, state, update, list per TEST-04.
- **D-05:** Smaller modules (slug, commit) get focused tests on their public API surface.

### Filesystem Strategy
- **D-06:** Use real temp dirs via `test/helpers.cjs` createTempDir — matches install.test.cjs pattern. No fs mocking.
- **D-07:** Each test suite creates its own isolated temp dir with before/after lifecycle cleanup.

### Test Organization
- **D-08:** One test file per module: `test/slug.test.cjs`, `test/state.test.cjs`, `test/campaign.test.cjs`, `test/health.test.cjs`, `test/commit.test.cjs`, `test/core.test.cjs`
- **D-09:** All test files use CJS format, node:test describe/it blocks, assert/strict — matching Phase 12 pattern.

### Claude's Discretion
- Specific test case selection per module — Claude reads each module's exports and writes tests covering the public API
- Whether to extend test/helpers.cjs with additional utilities (e.g., createMockCampaign) — Claude decides based on what tests need
- Test ordering within files — Claude organizes logically by function

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Modules Under Test
- `bin/lib/slug.cjs` — Slug generation and timestamp formatting (TEST-02)
- `bin/lib/state.cjs` — State read and state update operations (TEST-03)
- `bin/lib/campaign.cjs` — Campaign init, state, update, list (TEST-04)
- `bin/lib/health.cjs` — Init check, directory validation (TEST-05)
- `bin/lib/commit.cjs` — Commit message formatting (TEST-06)
- `bin/lib/core.cjs` — Error handling, arg parsing (TEST-07)

### Test Infrastructure (from Phase 12)
- `test/helpers.cjs` — createTempDir, createMockMarketing, createMockHome
- `test/install.test.cjs` — Reference pattern for test file structure
- `package.json` — scripts.test already set to `node --test`

### Requirements
- `.planning/REQUIREMENTS.md` — TEST-01 through TEST-07 assigned to this phase

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `test/helpers.cjs` createTempDir — isolated temp dirs with cleanup for filesystem tests
- `test/helpers.cjs` createMockMarketing — mock .marketing/ scaffold (STATE.md + POSITIONING.md)
- `test/install.test.cjs` — working example of describe/it/before/after pattern with real filesystem

### Established Patterns
- CJS modules with `module.exports = {}` at bottom
- Node.js built-in only (fs, path, os) — no npm dependencies
- `node:test` with `assert/strict` — no assertion library
- before/after hooks for temp dir lifecycle

### Integration Points
- All 6 test files discovered by `node --test` glob (TEST-01)
- test/helpers.cjs may need extensions (e.g., mock campaign scaffold for campaign.cjs tests)
- Each module's exports are the test surface — read module.exports to identify functions to test

</code_context>

<specifics>
## Specific Ideas

No specific requirements — user delegated all decisions to Claude. Focus on catching regressions that would break npm publish quality.

</specifics>

<deferred>
## Deferred Ideas

- Unit tests for deviation.cjs and drift-log.cjs — not in v1.1 requirements, can be added later

</deferred>

---

*Phase: 13-Unit Tests for bin/lib Modules*
*Context gathered: 2026-05-11*
