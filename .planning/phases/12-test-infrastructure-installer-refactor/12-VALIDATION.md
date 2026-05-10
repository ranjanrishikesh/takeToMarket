---
phase: 12
slug: test-infrastructure-installer-refactor
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-11
---

# Phase 12 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | node:test (built-in) |
| **Config file** | none — this phase creates it |
| **Quick run command** | `node --test` |
| **Full suite command** | `npm test` |
| **Estimated runtime** | ~2 seconds |

---

## Sampling Rate

- **After every task commit:** Run `node --test`
- **After every plan wave:** Run `npm test`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 12-01-01 | 01 | 1 | TEST-08 | — | N/A | integration | `node -e "const m = require('./install.js'); console.log(typeof m.detectRuntime)"` | ❌ W0 | ⬜ pending |
| 12-01-02 | 01 | 1 | TEST-11 | — | N/A | integration | `npm test` | ❌ W0 | ⬜ pending |
| 12-02-01 | 02 | 1 | — | — | N/A | unit | `node --test test/helpers.test.cjs` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `test/helpers.test.cjs` — stubs for test helper utilities
- [ ] Test directory created at `test/`

*This phase IS the test infrastructure — Wave 0 requirements are the phase itself.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| `npx taketomarket` still works after refactor | TEST-08 | Requires npm packaging context | Run `node install.js` directly and verify install flow unchanged |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
