---
phase: 06-positioning-invariant-system
verified: 2026-04-28T13:02:55Z
status: human_needed
score: 3/4 must-haves verified
overrides_applied: 0
human_verification:
  - test: "Verify bleeding-into-customer-facing-materials analysis"
    expected: "The /ttm-positioning-check report section explicitly identifies positioning drift that has 'bled' into customer-facing materials as a distinct analysis category, separate from simple drift percentage"
    why_human: "The workflow uses Must-Not-Say Check 3's WARN (non-customer-facing) vs FAIL (customer-facing) distinction to implicitly track this, but there is no dedicated bleeding analysis step or section. A human must judge whether this implicit coverage satisfies the roadmap SC4 requirement for 'bleeding-into-customer-facing-materials analysis'."
---

# Phase 6: Positioning Invariant System Verification Report

**Phase Goal:** Positioning is enforced as an architectural invariant across every campaign phase, with controlled shift workflows when repositioning is needed
**Verified:** 2026-04-28T13:02:55Z
**Status:** human_needed
**Re-verification:** No -- initial verification

## Goal Achievement

### Observable Truths (from ROADMAP Success Criteria)

| #   | Truth | Status | Evidence |
| --- | ----- | ------ | -------- |
| SC1 | POSITIONING.md loads into every phase context (compact summary in non-produce phases, full document in produce/verify) | VERIFIED | context-loading.md line 27: POSITIONING.md Tier 1 universal; Tier 2 loaded by produce, verify, positioning-check, positioning-shift. All lifecycle workflows read POSITIONING.md in their context loading steps. |
| SC2 | POSITIONING.md cannot be edited from within a campaign -- attempts are blocked with an explanation | VERIFIED | All 6 lifecycle workflows (brief, produce, verify, review, fix, ship) contain `<constraints>` block with "## POSITIONING.md is READ-ONLY" placed between `</required_reading>` and `<process>`. Verify workflow specifically directs to Escalate option for launching /ttm-positioning-shift. |
| SC3 | User runs /ttm-positioning-shift and must provide explicit reasoning, migration plan for existing assets, deprecation schedule, and human approval before any change takes effect | VERIFIED | positioning-shift.md (368 lines, under 500): 6-step process: Step 3a=explicit reasoning, Step 3c=migration plan with GATE-01 eval, Step 3d=deprecation schedule, Step 4=Approve/Revise/Cancel approval gate. Approval gate blocks writes until "Approve" selected. History table archived before POSITIONING.md updated. drift-log append with event-type shift wired via CLI. |
| SC4 | User runs /ttm-positioning-check and receives a report showing percentage on-positioning across recent assets, types of drift detected, and bleeding-into-customer-facing-materials analysis | UNCERTAIN | Drift % per-asset and aggregate: VERIFIED (positioning-check.md Steps 4-5, positioning-check-report.md formulas). Drift types (differentiator, proof point, must-not-say): VERIFIED. "Bleeding into customer-facing materials analysis": Must-Not-Say Check 3 WARN vs FAIL distinction covers customer-facing vs non-customer-facing implicitly, but no explicit bleeding analysis step or section. SKILL.md description claims "bleeding analysis (where positioning leaks into wrong territory)" but neither workflow nor report use this framing or dedicate a section to it. |

**Score:** 3/4 truths fully verified (SC4 uncertain on bleeding analysis sub-requirement)

### Required Artifacts

| Artifact | Expected | Status | Details |
| -------- | -------- | ------ | ------- |
| `bin/lib/drift-log.cjs` | Append-only DRIFT-LOG.md operations | VERIFIED | Exports cmdDriftLogAppend and cmdDriftLogDeprecation. Contains ALLOWED_EVENT_TYPES Set(['shift','audit','deviation']), sanitizeDetails with 200-char limit, TOCTOU wx-flag defense, path traversal prevention via startsWith check. |
| `templates/drift-log.md` | DRIFT-LOG.md initialization template | VERIFIED | Contains "## Audit Trail", "## Deprecation Backlog", "<!-- NEW ENTRIES BELOW THIS LINE -->", "<!-- DEPRECATION ENTRIES BELOW THIS LINE -->", correct column headers. |
| `bin/lib/campaign.cjs` | Extended with cmdCampaignList | VERIFIED | Contains `function cmdCampaignList(`, `const ACTIVE_PHASES = new Set(['briefed', 'produced', 'verified', 'reviewed', 'shipped'])`, supports --active, --shipped-since-last-audit, --since Nd filters. Exports include cmdCampaignList. |
| `bin/ttm-tools.cjs` | Router entries for drift-log and campaign list | VERIFIED | Contains `case 'drift-log':` block with cmdDriftLogAppend and cmdDriftLogDeprecation references. Contains `else if (subCmd === 'list')` branch. Default error message includes 'drift-log'. |
| `workflows/reference-mgmt/positioning-check.md` | Drift audit workflow with GATE-01 reuse | VERIFIED | 298 lines (under 500). Contains `<purpose>`, `<required_reading>` with gate-evaluation.md and positioning-check-report.md, campaign list --since CLI call, drift-log append --event-type audit CLI call, all 3 GATE-01 checks, trend comparison logic reading DRIFT-LOG.md, `<success_criteria>` block. |
| `references/positioning-check-report.md` | Report format template with Drift Categories | VERIFIED | Contains "## Drift Categories" table, "## Report Template", per-asset and aggregate drift calculation formulas, trend comparison logic, cross-reference handling. |
| `skills/ttm-positioning-check/SKILL.md` | Updated from stub to final | VERIFIED | Does NOT contain "Not yet implemented". Contains `disable-model-invocation: false`. Routes to positioning-check.md workflow. |
| `workflows/lifecycle/brief.md` | Read-only POSITIONING.md constraint | VERIFIED | Contains `## POSITIONING.md is READ-ONLY` in `<constraints>` block between `</required_reading>` (line 14) and `<process>` (line 28). |
| `workflows/lifecycle/produce.md` | Read-only POSITIONING.md constraint | VERIFIED | Contains `## POSITIONING.md is READ-ONLY` in `<constraints>` block between `</required_reading>` (line 12) and `<process>` (line 26). |
| `workflows/lifecycle/verify.md` | Read-only POSITIONING.md constraint | VERIFIED | Contains `## POSITIONING.md is READ-ONLY` with Escalate option mentioned. Correctly placed between `</required_reading>` (line 13) and `<process>` (line 27). |
| `workflows/lifecycle/review.md` | Read-only POSITIONING.md constraint | VERIFIED | Contains `## POSITIONING.md is READ-ONLY`. Correctly placed. |
| `workflows/lifecycle/fix.md` | Read-only POSITIONING.md constraint | VERIFIED | Contains `## POSITIONING.md is READ-ONLY`. Correctly placed. |
| `workflows/lifecycle/ship.md` | Read-only constraint plus auto-suggest logic | VERIFIED (with advisory) | Contains `## POSITIONING.md is READ-ONLY`. Contains shipped-since-last-audit CLI call, "POSITIONING CHECK SUGGESTED" banner, SHIPPED_COUNT >= 3 threshold check. Line count: 521 -- exceeds 500-line plan acceptance criteria. Plan summary noted this as acknowledged deviation. |
| `references/context-loading.md` | Updated loading matrix with positioning-shift entry | VERIFIED | Line 57: `| /ttm-positioning-shift | Yes | POSITIONING.md |` present in Workflow-to-Reference Loading Matrix. |
| `workflows/reference-mgmt/positioning-shift.md` | Controlled positioning shift workflow | VERIFIED | 368 lines (under 500). Contains "POSITIONING SHIFT APPROVAL" banner, AskUserQuestion with Approve/Revise/Cancel, campaign list --active CLI call, drift-log append --event-type shift CLI call, drift-log deprecation CLI call, Positioning History table append logic, _SUMMARY/END_SUMMARY preservation instructions. |
| `templates/migration-plan.md` | Per-campaign migration recommendation template | VERIFIED | Contains "## Active Campaign Impact", "## Per-Asset Recommendations", "## Deprecation Schedule (Shipped Assets)". |
| `skills/ttm-positioning-shift/SKILL.md` | Updated from stub to final | VERIFIED | Does NOT contain "Not yet implemented". Contains `disable-model-invocation: true`. Routes to positioning-shift.md workflow. |

### Key Link Verification

| From | To | Via | Status | Details |
| ---- | -- | --- | ------ | ------- |
| bin/ttm-tools.cjs | bin/lib/drift-log.cjs | require('./lib/drift-log.cjs') | WIRED | Lines 107, 117 confirm lazy require inside `case 'drift-log':` block |
| bin/ttm-tools.cjs | bin/lib/campaign.cjs | cmdCampaignList import | WIRED | Line 66: destructures cmdCampaignList; line 79: called with filter and since args |
| workflows/reference-mgmt/positioning-check.md | bin/ttm-tools.cjs campaign list | CLI invocation | WIRED | Line 110: `node "${CLAUDE_PLUGIN_ROOT}/bin/ttm-tools.cjs" campaign list --since ${WINDOW} --raw` |
| workflows/reference-mgmt/positioning-check.md | bin/ttm-tools.cjs drift-log append | CLI invocation | WIRED | Lines 245-249: drift-log append --event-type audit call |
| workflows/reference-mgmt/positioning-check.md | gates/gate-evaluation.md | @-reference in required_reading | WIRED | Line 13: `@${CLAUDE_PLUGIN_ROOT}/gates/gate-evaluation.md` |
| workflows/lifecycle/ship.md | bin/ttm-tools.cjs campaign list | shipped-since-last-audit | WIRED | Lines 485-486: ttm-tools.cjs campaign list --shipped-since-last-audit --raw |
| workflows/reference-mgmt/positioning-shift.md | bin/ttm-tools.cjs campaign list --active | CLI invocation | WIRED | Lines 87-88: campaign list --active --raw |
| workflows/reference-mgmt/positioning-shift.md | bin/ttm-tools.cjs drift-log append | event-type shift | WIRED | Lines 307-311: drift-log append --event-type shift |
| workflows/reference-mgmt/positioning-shift.md | bin/ttm-tools.cjs drift-log deprecation | deprecation backlog | WIRED | Lines 318-323: drift-log deprecation per asset |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
| -------- | ------------- | ------ | ------------------ | ------ |
| bin/lib/drift-log.cjs | driftLogPath | path.resolve(process.cwd(), '.marketing', 'DRIFT-LOG.md') | Yes -- fs operations on real file | FLOWING |
| bin/lib/campaign.cjs:cmdCampaignList | campaigns | fs.readdirSync(.marketing/CAMPAIGNS) + parseFrontmatter per STATE.md | Yes -- reads real campaign directories | FLOWING |
| workflows/reference-mgmt/positioning-check.md | CAMPAIGNS_JSON | `node ttm-tools.cjs campaign list --since` CLI | Yes -- CLI returns real campaign data | FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
| -------- | ------- | ------ | ------ |
| drift-log.cjs exports both functions | `node -e "const m=require('./bin/lib/drift-log.cjs'); console.log(typeof m.cmdDriftLogAppend, typeof m.cmdDriftLogDeprecation)"` | `function function` | PASS |
| campaign list returns JSON | `node bin/ttm-tools.cjs campaign list --raw` | `0 campaigns` (no campaigns in test environment) | PASS |
| drift-log rejects invalid event type | `node bin/ttm-tools.cjs drift-log append --event-type invalid-type ...` | `Error: Unknown event type: invalid-type. Allowed: shift, audit, deviation` (exit 1) | PASS |
| drift-log append creates DRIFT-LOG.md | `node bin/ttm-tools.cjs drift-log append --event-type audit --source "/ttm-positioning-check" ...` | `appended audit=/ttm-positioning-check` (exit 0); .marketing/DRIFT-LOG.md created with correct format | PASS |
| campaign list --active filter works | `node bin/ttm-tools.cjs campaign list --active --raw` | `0 campaigns` (returns valid JSON, no active campaigns in test env) | PASS |
| campaign list --since filter works | `node bin/ttm-tools.cjs campaign list --since 30d --raw` | `0 campaigns` (returns valid JSON) | PASS |

### Requirements Coverage

| Requirement | Source Plans | Description | Status | Evidence |
| ----------- | ------------ | ----------- | ------ | -------- |
| POSN-01 | 06-03 | POSITIONING.md loaded into every phase context | SATISFIED | context-loading.md documents Tier 1 universal load for all workflows; Tier 2 for produce/verify/positioning-check/positioning-shift. All lifecycle workflows execute context loading steps. |
| POSN-02 | 06-01, 06-03 | POSITIONING.md is read-only during campaign execution | SATISFIED | `<constraints>` block in all 6 lifecycle workflows explicitly prohibits POSITIONING.md writes with explanation of alternatives. |
| POSN-03 | 06-04 | /ttm-positioning-shift requires reasoning, migration plan, deprecation schedule, human approval | SATISFIED | positioning-shift.md 6-step workflow: reasoning collected, migration plan generated for active campaigns, deprecation schedule with user-set deadline, Approve/Revise/Cancel gate, atomic POSITIONING.md update with History archival. |
| POSN-04 | 06-02 | /ttm-positioning-check samples recent assets and reports drift % and types | SATISFIED with caveat | Per-asset and aggregate drift % implemented. Three drift types (differentiator, proof point, must-not-say). Customer-facing vs non-customer-facing distinction present via Must-Not-Say WARN/FAIL. Explicit "bleeding analysis" section absent. |
| POSN-05 | 06-01, 06-04 | Positioning drift log with date and reasoning for every intentional adjustment | SATISFIED | drift-log.cjs append-only module, DRIFT-LOG.md template with Audit Trail table (Date, Event, Source, Details, Assets Affected), positioning-shift.md Step 5c logs every shift event with date and sanitized reasoning via CLI. |

### Anti-Patterns Found

| File | Pattern | Severity | Impact |
| ---- | ------- | -------- | ------ |
| workflows/lifecycle/ship.md | 521 lines -- exceeds 500-line plan acceptance criterion | Info | Plan acceptance criteria required "No workflow file exceeds 500 lines after modification". The 06-03-SUMMARY.md explicitly acknowledges this: "ship.md at 521 lines slightly exceeds 500-line guidance due to mandatory additions from plan." Not a blocker since this was a known, documented trade-off -- mandatory positioning enforcement additions caused the overage. |

### Human Verification Required

#### 1. Bleeding-Into-Customer-Facing-Materials Analysis

**Test:** Run `/ttm-positioning-check` on a campaign that has assets containing must-not-say terms in customer-facing contexts (e.g., a landing page) AND assets containing the same terms in non-customer-facing contexts (e.g., an internal brief). Review the generated report.

**Expected:** The report should clearly identify not just "must-not-say violations" but specifically call out which violations have "bled into customer-facing materials" as a distinct concern separate from non-customer-facing usage, matching the roadmap SC4 requirement for "bleeding-into-customer-facing-materials analysis."

**Why human:** The Must-Not-Say Check 3 WARN vs FAIL distinction (WARN = non-customer-facing, FAIL = customer-facing) provides the underlying data. However, neither the workflow steps nor the report template have a dedicated "Bleeding Analysis" section or label. The SKILL.md description claims "Perform bleeding analysis (where positioning leaks into wrong territory)" but the workflow does not frame it this way. A human must assess whether Check 3's WARN/FAIL distinction qualifies as the "bleeding-into-customer-facing-materials analysis" specified in the roadmap success criteria, or whether an explicit dedicated section is required.

---

### Gaps Summary

No hard blockers found. All 4 plans executed as designed:
- CLI infrastructure (drift-log.cjs, campaign list) is fully wired and functionally verified
- Read-only enforcement is present in all 6 lifecycle workflows with correct placement
- /ttm-positioning-check audit workflow implements all specified behavior except the explicit "bleeding analysis" framing
- /ttm-positioning-shift controlled shift workflow implements all 6 steps with human approval gate

The single human verification item concerns whether SC4's "bleeding-into-customer-facing-materials analysis" requirement is met by the implicit WARN (non-customer-facing) vs FAIL (customer-facing) distinction in Check 3 of the Must-Not-Say evaluation, or whether an explicit dedicated section is required. The SKILL.md description uses "bleeding analysis" language that does not appear in the actual workflow implementation.

**Advisory:** ship.md is 521 lines, slightly over the 500-line guidance. The 06-03 plan summary acknowledged this as an accepted trade-off. No action required.

---

_Verified: 2026-04-28T13:02:55Z_
_Verifier: Claude (gsd-verifier)_
