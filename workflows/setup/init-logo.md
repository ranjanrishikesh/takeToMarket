# Init Sub-Workflow: Logo Generation

**Purpose:** Generate brand logo (SVG primary + PNG raster) with vision-based self-review loop.

**Called by:** `workflows/setup/init.md` after brand colors.

**Required reading:**
- `${CLAUDE_PLUGIN_ROOT}/references/logo-design-principles.md`
- `${CLAUDE_PLUGIN_ROOT}/references/codex-image-gen-research.md`

---

## Step 1: Choose logo type

AskUserQuestion (priority: critical):
- "What logo type fits your product?"
- options:
  - "Wordmark" - brand name in distinctive typography (recommended for most)
  - "Combination mark" - wordmark + small symbol
  - "Lettermark" - initials only (works for long names)
  - "Symbol only" - abstract mark (only if you have brand equity)
  - "Help me decide" - show rationale per type

If "Help me decide": show the principles from references/logo-design-principles.md, then re-ask.

## Step 2: Gather inspiration constraints

Freeform (non-critical, defaults to "neutral"):
- "Any logos you like as reference points? (e.g., Stripe, Linear, Anthropic)"
- "Any motifs to avoid?" (Pre-fill defaults from logo-design-principles.md: no lightbulbs, gears, brains, rockets, 3-circle clusters.)

## Step 3: Generate Round 1 SVG

Generate 3 SVG candidates based on:
- Logo type (Step 1).
- Brand colors from BRAND.md.
- Voice archetype (cool/calm/serif vs bold/sharp/sans-serif).
- Constraints from Step 2.

Write each candidate to `.taketomarket/brand/round-1/candidate-{a,b,c}.svg`.

## Step 4: Render to PNG

For each candidate, render to PNG at 256x256 for vision review:

```bash
node ${CLAUDE_PLUGIN_ROOT}/bin/ttm-tools.cjs svg-render .taketomarket/brand/round-1/candidate-a.svg .taketomarket/brand/round-1/candidate-a.png
```

If `svg-render` returns `none` (no renderer installed): prompt user to install rsvg-convert:
```
brew install librsvg
```
(or apt, or chocolatey on Windows). Wait. Retry.

If on Codex with native image-gen path (per codex-image-gen-research.md): use that.

## Step 5: Vision self-review

For each candidate PNG:
1. Read the image file via the Read tool (multimodal load).
2. Evaluate against the checklist in references/logo-design-principles.md `## Vision-review checklist`:
   - Legibility at small size.
   - Composition balance.
   - Color matches palette.
   - Originality vs cliche.
3. Score each candidate 1-10 per dimension.
4. Pick the best 2 candidates. Discard the rest.

## Step 6: Iterate

For each of the top 2 candidates, propose 2 modifications that would address the lowest-scoring dimension.

Generate Round 2: 4 modified SVGs (2 per top candidate). Write to `.taketomarket/brand/round-2/`.

Render to PNG. Re-review.

Pick the best.

## Step 7: User picks

Show user the final 2-3 candidates (PNG paths). AskUserQuestion (priority: critical):
- "Which logo do you want? You can also ask for another round."
- options: ["A", "B", "C", "Show me Round 3", "I'll provide my own SVG"]

If "Show me Round 3": iterate one more time (max 3 rounds total per session).
If "I'll provide my own": prompt for SVG paste or file path.

## Step 8: Generate full asset set

From the selected SVG, generate:
- `.taketomarket/brand/logo.svg` (primary)
- `.taketomarket/brand/logo-mark.svg` (if combination mark; else copy)
- `.taketomarket/brand/logo-wordmark.svg` (if combination mark; else copy)
- `.taketomarket/brand/logo-mono-light.svg` (black version)
- `.taketomarket/brand/logo-mono-dark.svg` (white version)
- `.taketomarket/brand/logo-favicon.svg` (simplified for 32x32)
- `.taketomarket/brand/logo@1x.png` (PNG via svg-render)
- `.taketomarket/brand/logo@2x.png` (2x PNG)

## Step 9: Append to BRAND.md

Fill in the `## Logo` section of BRAND.md (template at templates/reference-files/brand.md):
- File paths.
- Type.
- Rationale (3-4 sentences).
- Vision-review history (which rounds, what was critiqued, what was iterated).

## Step 10: Confirm

AskUserQuestion (priority: critical):
- "Logo saved to .taketomarket/brand/. BRAND.md updated. Confirm or restart?"
- "Confirm" / "Start over"
