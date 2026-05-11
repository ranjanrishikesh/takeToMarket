# Phase 14: E2E & Integration Tests - Discussion Log

**Date:** 2026-05-11
**Mode:** discuss

## Areas Presented

User was offered 4 gray areas:
1. Runtime coverage (claude only vs both)
2. Coverage scope (happy path only vs error paths)
3. Test exec strategy (execFileSync vs require)
4. File assertion depth (spot-check vs deep tree compare)

## User Selection

> "you research and decide all yourself the best."

Full delegation to Claude. No interactive Q&A — Claude locked decisions per Phase 12/13 conventions and ROADMAP success criteria.

## Locked Decisions

See `14-CONTEXT.md` `<decisions>` block for D-01 through D-16.

Summary:
- New file `test/install-e2e.test.cjs` (separate from unit-level install.test.cjs)
- `child_process.execFileSync` for true E2E (not require)
- HOME env override + `createMockHome` for isolation
- Both `claude` and `codex` runtime targets
- Happy path + auto-detect + --dry-run on clean/installed + unknown-runtime warning
- Spot-check assertions (DIRS_TO_COPY exist + a couple deep file checks); no tree diff

## Deferred Ideas

- Windows HOME/USERPROFILE handling
- Permission-denied / disk-full failure modes
- Re-install / upgrade flow tests (Phase 15 territory)
- Install time perf regression tests

## Claude's Discretion (passed to planner)

- Test ordering within file
- Whether to share or split temp HOMEs across runtime tests (recommend split)
- Exact dry-run banner string match (read install.js output)
- Optional smoke test for --runtime flag precedence

---
*Phase: 14-e2e-integration-tests*
