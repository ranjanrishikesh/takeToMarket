# LinkedIn Post Workflow

**Required reading:**
- `${CLAUDE_PLUGIN_ROOT}/references/linkedin-post-patterns.md`
- `${CLAUDE_PLUGIN_ROOT}/playbooks/linkedin.md` (delivered in P6)
- `.taketomarket/POSITIONING.md`, `BRAND.md`, `PRODUCT-DNA.md`, `ICP.md`
- `.taketomarket/PLAYBOOKS/linkedin-base.md` (created on first run)
- `.taketomarket/CAMPAIGNS/linkedin/post-history.md` (created on first run)

---

## Step 1: Detect first-run

Check if `.taketomarket/PLAYBOOKS/linkedin-base.md` exists.

If NOT (or `--rebuild-base` flag): go to Step 2 (interview + scrape).
If YES: go to Step 6 (generate post).

## Step 2: First-run author interview

AskUserQuestion (priority: critical):
- "Which 2-5 LinkedIn creators write in the style you want to mimic? Paste their profile URLs."
- Freeform, expect 2-5 URLs.

## Step 3: Playwright check

```bash
node ${CLAUDE_PLUGIN_ROOT}/bin/ttm-tools.cjs playwright-check --raw
```

If detected = false: print "Author scraping needs Playwright MCP. Run /ttm-playwright-setup first."

## Step 4: Scrape authors

For each profile URL: use Playwright MCP to load the page (uses logged-in Chrome session via bridge → reaches authenticated LinkedIn). Extract recent 10-20 posts.

For each post: capture text + engagement count + post type (text / image / carousel / video).

Save raw scrapes to `.taketomarket/CAMPAIGNS/linkedin/scrapes/<author-handle>.md`.

## Step 5: Analyze + build linkedin-base.md

For each author:
- Compute sentence length distribution.
- Extract hook patterns (first 80 chars of each post).
- Identify recurring structure templates.
- Extract recurring phrases / voice tics.
- Note topics + cadence.

Synthesize across authors. Apply `references/linkedin-post-patterns.md` framework. Fill in `templates/linkedin-base-template.md` placeholders. Write to `.taketomarket/PLAYBOOKS/linkedin-base.md`.

## Step 6: Load context for this post

- Load linkedin-base.md, POSITIONING, BRAND, PRODUCT-DNA, ICP.
- Load post-history.md to extract:
  - Recent topics (last 30 days).
  - Recent hook patterns used.
- Avoid: same topic in last 30 days, same hook pattern in last 5 posts.

## Step 7: Web search for news angles

Unless `--no-news`:
- Use WebSearch for the user's industry / ICP space, filtered to last 7 days.
- Surface 3-5 recent stories. Rank by relevance to product positioning.

AskUserQuestion (non-critical, default: top-ranked):
- "Found these recent stories. Use one as an angle, or write standalone?"
- options: list 3-5 stories + "Standalone, no news angle"

## Step 8: Determine post topic

If `--topic` flag passed: use that.
Else: AskUserQuestion (priority: critical):
- "What's the topic for today's post?"
- options:
  - "Use selected news story" (if Step 7 produced one)
  - "Recent product update / behind-the-scenes"
  - "Lesson from this week"
  - "Counter-take on conventional wisdom"
  - "Other (freeform)"

## Step 9: Generate 2-3 draft candidates

Apply linkedin-base.md style + chosen topic. Generate 2-3 candidates with different hook patterns from references/linkedin-post-patterns.md `## Hook patterns`.

Present each to user.

## Step 10: Pick or iterate

AskUserQuestion (priority: critical):
- "Which draft?"
- options: ["A", "B", "C", "Show me 3 more", "Combine these"]

Loop until user picks.

## Step 11: Mandatory humanize

Invoke `/ttm-humanize` on the chosen draft via Skill tool. Get rewritten version.

## Step 12: Save + history append

Output the final post:
- Print full text for user to copy.
- Save to `.taketomarket/CAMPAIGNS/linkedin/drafts/<timestamp>-<slug>.md` with frontmatter `topic`, `hook_pattern`, `status: ready`.
- Append to `post-history.md`:
  ```
  | YYYY-MM-DD | <topic-tag> | <hook-pattern> | <slug> | <link-to-draft> |
  ```

## Step 13: Print next steps + cadence suggestion

```
✓ Post ready. Copy from .taketomarket/CAMPAIGNS/linkedin/drafts/<file>.md

Want daily cadence? Set up a Claude routine:

  /schedule create "0 9 * * 1-5" "/ttm-linkedin-post"

This runs the skill every weekday at 9am. You'll review + post manually.

Next: /ttm-next | /ttm-state
```
