---
name: ttm-fix
description: >
  Fix phase: root cause analysis, fix brief, re-produce in isolated context,
  re-verify. Capped at 3 attempts per asset. Use when assets fail review.
argument-hint: "[campaign-slug]"
disable-model-invocation: true
allowed-tools: Read Write Bash Glob Grep Task AskUserQuestion
---

# /ttm-fix

Read and follow the workflow at `${CLAUDE_PLUGIN_ROOT}/workflows/lifecycle/fix.md`

## Next steps

See `${CLAUDE_PLUGIN_ROOT}/templates/next-step-footer.md`.
<!-- next-step-footer -->
