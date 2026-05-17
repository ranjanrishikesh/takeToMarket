# Init Sub-Workflow: PRODUCT-DNA generation

**Purpose:** Generate `.taketomarket/PRODUCT-DNA.md` combining a codebase-derived spec with a manifesto interview.

**Called by:** `workflows/setup/init.md` after positioning + brand + ICP sections.

---

## Step 1: Codebase scan

Run:

```bash
node ${CLAUDE_PLUGIN_ROOT}/bin/ttm-tools.cjs scan-codebase --raw > /tmp/ttm-scan.json
```

Parse the JSON into variables `scan.stack`, `scan.monorepo`, `scan.featureCandidates`.

## Step 2: Confirm feature areas with user

Display the auto-detected feature candidates. Use AskUserQuestion (multiSelect: true, priority: critical):
- question: "These directories look like feature areas. Which ones are real features (vs. infrastructure)?"
- options: one per detected dir, plus "Other"

User-selected features become the `### Feature areas` list. "Other" prompts a follow-up freeform.

## Step 3: Confirm tech stack

Print detected stack. Ask user (priority: critical):
- question: "Detected stack: [list]. Add anything missing?"
- options: ["Looks complete", "Add more"]

If "Add more": freeform input.

## Step 4: JTBD interview

Freeform questions (priority: critical):
1. "In one sentence: when your customer hires your product, what's the ONE job they're trying to get done?"
2. "What are 1-2 secondary jobs the same customer also uses your product for?"

## Step 5: Stage

AskUserQuestion (priority: critical):
- options: Pre-MVP, MVP, Beta, GA, Mature.

## Step 6: Manifesto - Beliefs

Freeform (priority: critical):
"Give me 3 to 5 things you believe about your space that most other people don't. These are your beliefs that drive product decisions. Be opinionated."

Validate: minimum 3, max 5. If user gives generic "we care about quality" beliefs, push back: "Be more specific. What do most companies in your space do that you think is wrong?"

## Step 7: Manifesto - Anti-status-quo

Freeform (priority: critical):
"What 1-3 things in your space are you AGAINST? What conventional wisdom are you rejecting?"

## Step 8: Manifesto - Worldview

Freeform (priority: critical):
"In 2-3 paragraphs, tell me the story of why this product exists. Not marketing copy - actual motivation. Read like a founder's letter."

Validate: minimum 80 words. Reject if user gives marketing buzz.

## Step 9: Founding-team voice (optional)

Non-critical. AskUserQuestion:
- "Do you want to capture an authorial voice sample? (Optional, makes content more on-brand later.)"
- "Yes, paste samples now" / "Skip"

If yes: freeform "Paste 2-3 example sentences that capture how you (or a co-founder) personally write."

## Step 10: Generate PRODUCT-DNA.md

Read `templates/reference-files/product-dna.md`. Fill in all `[bracketed placeholders]` with collected data. Write to `.taketomarket/PRODUCT-DNA.md`.

## Step 11: Confirm

Display the generated file path + ask user to review. AskUserQuestion (priority: critical):
- "PRODUCT-DNA.md written to .taketomarket/PRODUCT-DNA.md. Review now?"
- "Open for review" / "Looks good, continue"

If "Open for review": print the file contents. Then ask if any edits needed.
