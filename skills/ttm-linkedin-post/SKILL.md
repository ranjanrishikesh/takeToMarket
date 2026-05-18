---
name: ttm-linkedin-post
description: >
  Generate a LinkedIn post in your voice. First run interviews you for 2-5
  author profiles to mimic, scrapes their recent posts via Playwright MCP,
  and builds .taketomarket/PLAYBOOKS/linkedin-base.md. Subsequent runs use
  that base + post history + news web search to draft posts. Final draft
  passes through /ttm-humanize before output.
disable-model-invocation: true
allowed-tools: Read Write Bash Glob Grep AskUserQuestion WebSearch
---

# /ttm-linkedin-post

Read and follow the workflow at `${CLAUDE_PLUGIN_ROOT}/workflows/channel/linkedin-post.md`.

## Flags

- `--rebuild-base` — re-interview + re-scrape authors to refresh linkedin-base.md.
- `--no-news` — skip the news web search.
- `--topic <text>` — seed topic for this post.

## Next steps

See `${CLAUDE_PLUGIN_ROOT}/templates/next-step-footer.md`.
<!-- next-step-footer -->
