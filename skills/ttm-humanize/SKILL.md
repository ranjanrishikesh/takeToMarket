---
name: ttm-humanize
description: >
  Mandatory final-step humanizer. Detects and rewrites AI writing patterns
  (inflated symbolism, em-dash overuse, rule-of-three, AI vocab, passive voice,
  filler phrases) and matches the user's voice from BRAND.md samples. Runs on
  every audience-facing asset before write. Also runnable ad-hoc on any file or
  pasted text.
disable-model-invocation: false
context: fork
allowed-tools: Read Write Edit Grep Glob AskUserQuestion
---

# /ttm-humanize

Read and follow the workflow at `${CLAUDE_PLUGIN_ROOT}/workflows/lifecycle/humanize.md`.

Required reading:
- `${CLAUDE_PLUGIN_ROOT}/references/humanizer-patterns.md` — pattern catalog.
- `.taketomarket/BRAND.md` — voice + tone + banned words.
- `.taketomarket/POSITIONING.md` — must-not-say.

## Invocation modes

**Mode A — Auto (called by other skills):**
Other producing skills call `/ttm-humanize` with the draft path as input. The skill rewrites in place and returns control.

**Mode B — Manual:**
User runs `/ttm-humanize <file>` or pastes text. Skill rewrites and either writes back or prints the result.

## Next steps

Standard footer: see `${CLAUDE_PLUGIN_ROOT}/templates/next-step-footer.md`.
