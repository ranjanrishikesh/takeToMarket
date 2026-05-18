## Step 0: First-run inline education

Read `.taketomarket/CONFIG.md`. Parse `first_run_seen` (object) and `inline_education` (boolean, default true).

If `inline_education` is false: skip this step. Else if `first_run_seen.ttm-new-campaign` is not `true`, print the explainer below verbatim, then mark this skill as seen:

```bash
node "${CLAUDE_PLUGIN_ROOT}/bin/ttm-tools.cjs" first-run mark ttm-new-campaign
```

Use this exact check (bash) to decide whether to print: `node "${CLAUDE_PLUGIN_ROOT}/bin/ttm-tools.cjs" first-run check ttm-new-campaign --raw` -- the JSON `seen` field is `true` once the explainer has run before.

### Explainer for `/ttm-new-campaign`

`/ttm-new-campaign` creates an isolated workspace under `.taketomarket/campaigns/<slug>/`
with its own STATE.md, brief slot, and asset directory. It's the marketing
equivalent of `git checkout -b feature/X`: campaigns are independent units that
can be at different lifecycle phases simultaneously, and the state machine
tracks each one separately.

Why it matters: takeToMarket is multi-campaign by design. Without a campaign
slug, briefs, assets, and verification results have no home and bleed into
each other. Run this before `/ttm-brief` for any new initiative -- it locks in
the campaign id that subsequent skills route work into.

(Canonical source: `references/inline-education-blurbs.md`. Embedded verbatim because workflows do not @-resolve files at runtime.)

---

<purpose>
Campaign scaffolding workflow that creates a CAMPAIGNS/<slug>/ directory with
initialized STATE.md, empty RESEARCH.md, empty BRIEF.md, and ASSETS/ directory.
Use when starting a new marketing campaign after /ttm-init has been run.
</purpose>

<required_reading>
@${CLAUDE_PLUGIN_ROOT}/references/context-loading.md
</required_reading>

<process>

## Step 1: Pre-flight Check

```
takeToMarket > CREATING CAMPAIGN
```

Run init status check:
```bash
node "${CLAUDE_PLUGIN_ROOT}/bin/ttm-tools.cjs" init --raw
```

**If result is "not initialized":**
Tell the user: "takeToMarket is not initialized yet. Run `/ttm-init` first to set up your marketing reference files."
Exit -- do not continue.

**If result is "initialized":**
Continue to Step 2.

---

## Step 2: Generate Slug

If `$ARGUMENTS` is empty or blank (after stripping any flags):
Ask the user: "What is the campaign name?"
Use the response as the campaign name input.

Generate the slug deterministically via CLI:
```bash
CAMPAIGN_SLUG=$(node "${CLAUDE_PLUGIN_ROOT}/bin/ttm-tools.cjs" slug "$ARGUMENTS" --raw)
```

Store the result as `CAMPAIGN_SLUG`. Store the original input as `CAMPAIGN_NAME`.

Display: `Campaign slug: ${CAMPAIGN_SLUG}`

**Important:** Never generate slugs via AI. Always use the `ttm-tools.cjs slug` command.

---

## Step 3: Check for Existing Campaign

```bash
ls .taketomarket/CAMPAIGNS/${CAMPAIGN_SLUG}/ 2>/dev/null && echo "exists" || echo "new"
```

**If "exists":**
Warn the user: "A campaign with slug `${CAMPAIGN_SLUG}` already exists. Would you like to overwrite it or pick a different name?"

- If user wants to overwrite: continue to Step 4 (existing files will be replaced).
- If user wants a different name: go back to Step 2 and ask for a new campaign name.

**If "new":**
Continue to Step 4.

---

## Step 4: Create Scaffold

Run the campaign init command:
```bash
node "${CLAUDE_PLUGIN_ROOT}/bin/ttm-tools.cjs" campaign init "${CAMPAIGN_SLUG}" "${CAMPAIGN_NAME}"
```

This creates:
- `CAMPAIGNS/<slug>/STATE.md` (phase: created)
- `CAMPAIGNS/<slug>/RESEARCH.md` (from template)
- `CAMPAIGNS/<slug>/BRIEF.md` (from template)
- `CAMPAIGNS/<slug>/ASSETS/` (empty directory)

Verify all 4 items exist:
```bash
ls .taketomarket/CAMPAIGNS/${CAMPAIGN_SLUG}/STATE.md && \
ls .taketomarket/CAMPAIGNS/${CAMPAIGN_SLUG}/RESEARCH.md && \
ls .taketomarket/CAMPAIGNS/${CAMPAIGN_SLUG}/BRIEF.md && \
ls -d .taketomarket/CAMPAIGNS/${CAMPAIGN_SLUG}/ASSETS/ && \
echo "scaffold complete"
```

If any item is missing, report the error and exit.

---

## Step 5: Update Global State

Set the current campaign in the global STATE.md:
```bash
node "${CLAUDE_PLUGIN_ROOT}/bin/ttm-tools.cjs" state update current_campaign "${CAMPAIGN_SLUG}"
```

---

## Step 6: Display Summary

```
takeToMarket > CAMPAIGN CREATED: ${CAMPAIGN_SLUG}

.taketomarket/CAMPAIGNS/${CAMPAIGN_SLUG}/
  STATE.md       (phase: created)
  RESEARCH.md    (pending -- run /ttm-discover)
  BRIEF.md       (pending -- run /ttm-brief)
  ASSETS/        (empty -- populated by /ttm-produce)

Next: Run /ttm-discover ${CAMPAIGN_SLUG}
```

</process>

<success_criteria>
- [ ] init check passed (system is initialized)
- [ ] slug generated deterministically via ttm-tools.cjs (NOT AI-generated)
- [ ] existing campaign check performed
- [ ] CAMPAIGNS/<slug>/ directory created with STATE.md, RESEARCH.md, BRIEF.md, ASSETS/
- [ ] global STATE.md current_campaign updated
- [ ] user sees next-step guidance
</success_criteria>

<output>
- `.taketomarket/CAMPAIGNS/<slug>/STATE.md`
- `.taketomarket/CAMPAIGNS/<slug>/RESEARCH.md`
- `.taketomarket/CAMPAIGNS/<slug>/BRIEF.md`
- `.taketomarket/CAMPAIGNS/<slug>/ASSETS/` (empty directory)
</output>

## What if this doesn't fit?

Looks like /ttm-new-campaign can't do that yet.

- Want a new skill? /ttm-request-skill
- Existing skill needs work? /ttm-improve-skill
