---
name: ttm-icp-refresh
description: >
  Update ICP.md from new customer data including calls, reviews, and feedback.
  Use when ideal customer profile needs updating from fresh data.
disable-model-invocation: true
allowed-tools: Read Write Bash Glob Grep
---

# /ttm-icp-refresh

Read and follow the workflow at `${CLAUDE_PLUGIN_ROOT}/workflows/reference-mgmt/icp-refresh.md`

This command will:
- Accept new customer data (call transcripts, reviews, feedback)
- Analyze patterns against current ICP.md profiles
- Propose ICP updates with evidence citations
- Validate changes don't conflict with POSITIONING.md
- Update ICP.md with human approval gate

## Next steps

See `${CLAUDE_PLUGIN_ROOT}/templates/next-step-footer.md`.
<!-- next-step-footer -->
