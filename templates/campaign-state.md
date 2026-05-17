<!-- DOCUMENTATION ONLY: This template documents the expected STATE.md shape.
     The authoritative source that generates STATE.md is bin/lib/campaign.cjs
     (cmdCampaignInit). Changes here do NOT affect generated output. -->
---
campaign: [SLUG]
name: [CAMPAIGN_NAME]
created: [TIMESTAMP]
phase: created
last_updated: [TIMESTAMP]
phase.created: [TIMESTAMP]
phase.researched: null
phase.briefed: null
phase.produced: null
phase.verified: null
phase.reviewed: null
phase.fixed: null
phase.shipped: null
phase.measured: null
phase.learned: null
gate.positioning_check: null
gate.outcome_metric: null
gate.positioning_drift: null
gate.claim_accuracy: null
gate.voice_drift: null
gate.outcome_alignment: null
gate.funnel_integrity: null
gate.utm_hygiene: null
gate.compliance: null
gate.competitor_collision: null
gate.icp_fit: null
gate.format_correctness: null
verify.run_count: null
verify.last_run: null
verify.overall_result: null
---

# Campaign: [CAMPAIGN_NAME]

Phase: created
Next step: Run `/ttm-discover [SLUG]` to gather market intelligence.
