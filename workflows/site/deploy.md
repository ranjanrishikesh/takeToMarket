# Deploy Workflow

## Step 0: First-run inline education

Read `.taketomarket/CONFIG.md`. Parse `first_run_seen` (object) and `inline_education` (boolean, default true).

If `inline_education` is false: skip this step. Else if `first_run_seen.ttm-deploy` is not `true`, print the explainer below verbatim, then mark this skill as seen:

```bash
node "${CLAUDE_PLUGIN_ROOT}/bin/ttm-tools.cjs" first-run mark ttm-deploy
```

Use this exact check (bash) to decide whether to print: `node "${CLAUDE_PLUGIN_ROOT}/bin/ttm-tools.cjs" first-run check ttm-deploy --raw` -- the JSON `seen` field is `true` once the explainer has run before.

### Explainer for `/ttm-deploy`

`/ttm-deploy` ships your generated site (landing + pSEO + any static
assets) to the deploy target detected from your project (Vercel,
Netlify, Cloudflare Pages, etc.) or guides manual deployment if no
target is detected. It does not bypass the gate wall -- only verified,
reviewed assets are pushed.

Why it matters: a verified asset that isn't deployed is functionally
equivalent to no asset. This skill is the bridge between the
spec-driven pipeline and the live URL, and it preserves the audit trail
so you can correlate a deployed page back to its brief and gate results.

(Canonical source: `references/inline-education-blurbs.md`. Embedded verbatim because workflows do not @-resolve files at runtime.)

---

## Step 1: Read landing path

```bash
node ${CLAUDE_PLUGIN_ROOT}/bin/ttm-tools.cjs config read --raw
```

Extract `landing_path`. If missing: print "Run /ttm-landing first" and exit.

## Step 2: Detect deploy path

```bash
cd <landing_path> && node ${CLAUDE_PLUGIN_ROOT}/bin/ttm-tools.cjs deploy detect --raw
```

Parse JSON. Branch on `preferred`:

### preferred = "git-push"

Inside landing path:
1. `git add . && git commit -m "deploy: takeToMarket landing update"` (if changes).
2. `git push origin <current-branch>`.
3. Print Vercel dashboard URL and "Deploy in progress — check dashboard."

### preferred = "cli"

Inside landing path:
1. `vercel deploy [--prod]` (depending on flag).
2. CLI outputs deploy URL. Print it.

### preferred = "api-token"

Print: "API-token deploy not yet implemented for v2.3.0. Either install vercel CLI or connect this repo to Vercel and use git-push."

### preferred = null (nothing available)

Walk user through setup:
1. AskUserQuestion: "No Vercel deploy path detected. Which would you like to set up?"
   - "Connect repo to Vercel dashboard (recommended)" — print instructions.
   - "Install Vercel CLI" — `npm i -g vercel && vercel login`.
   - "Skip — I'll deploy manually."

## Step 3: Verify deploy URL responds

If a deploy URL was produced, fetch the homepage:
```bash
curl -sI <url> | head -1
```
Expected: `HTTP/2 200`.

If non-200: print warning + URL.

## Step 4: Update CONFIG.md

Append:
```
last_deploy_url: <url>
last_deploy_at: <timestamp>
```

## Step 5: Print next steps

## What if this doesn't fit?

Looks like /ttm-deploy can't do that yet.

- Want a new skill? /ttm-request-skill
- Existing skill needs work? /ttm-improve-skill
