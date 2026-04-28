---
name: ttm-ship
description: >
  Ship phase: generate launch checklist confirming tracking, UTMs, funnel
  testing, and asset finalization. Use when assets are approved and ready.
argument-hint: "[campaign-slug]"
disable-model-invocation: true
allowed-tools: Read Write Bash Glob Grep AskUserQuestion
---

# /ttm-ship

Read and follow the workflow at `${CLAUDE_PLUGIN_ROOT}/workflows/lifecycle/ship.md`
