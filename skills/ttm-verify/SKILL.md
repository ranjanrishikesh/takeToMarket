---
name: ttm-verify
description: >
  Verify phase: run all applicable quality gates on every asset with pass/fail
  report and line-level feedback. Use after production to validate assets.
argument-hint: "[campaign-slug]"
disable-model-invocation: true
context: fork
allowed-tools: Read Write Bash Glob Grep Task AskUserQuestion
---

# /ttm-verify

Read and follow the workflow at `${CLAUDE_PLUGIN_ROOT}/workflows/lifecycle/verify.md`
