---
name: ttm-seo
description: >
  Unified SEO + AEO toolkit. Subcommands: audit (URL/sitemap technical+content audit),
  keyword-map (cluster generation with intent tags), aeo (citation status across AI engines).
disable-model-invocation: true
allowed-tools: Read Write Bash Glob Grep WebSearch WebFetch
---

# /ttm-seo

## Step 0: First-run inline education

Read `.taketomarket/CONFIG.md`. Parse `first_run_seen` (object) and `inline_education` (boolean, default true).

If `inline_education` is false: skip this step. Else if `first_run_seen.ttm-seo` is not `true`, print the explainer below verbatim, then mark this skill as seen:

```bash
node "${CLAUDE_PLUGIN_ROOT}/bin/ttm-tools.cjs" first-run mark ttm-seo
```

Use this exact check (bash) to decide whether to print: `node "${CLAUDE_PLUGIN_ROOT}/bin/ttm-tools.cjs" first-run check ttm-seo --raw` -- the JSON `seen` field is `true` once the explainer has run before.

### Explainer for `/ttm-seo`

`/ttm-seo` is the unified SEO + AEO toolkit. Subcommands: `audit`
runs a URL or sitemap through technical and content checks;
`keyword-map` generates a topic cluster with intent tags;
`aeo` measures your citation status across Google AI Overviews,
ChatGPT search, and Perplexity for a target query.

Why it matters: SEO and Answer Engine Optimization (AEO) share most
fundamentals -- structured content, clear claims, citation-worthy
formatting -- but diverge on a few signals. Treating them as one
toolkit with three modes prevents the trap of optimizing for Google
in a way that breaks AEO citation.

(Canonical source: `references/inline-education-blurbs.md`. Embedded verbatim because workflows do not @-resolve files at runtime.)

---

Routes to one of three subcommand workflows based on the first argument.

## Usage

```
/ttm-seo audit <url-or-sitemap>     → workflows/discipline/seo/audit.md
/ttm-seo keyword-map [seed-keyword] → workflows/discipline/seo/keyword-map.md
/ttm-seo aeo <query>                → workflows/discipline/seo/aeo.md
```

## Workflow

Parse first positional arg:
- `audit` → read and follow `${CLAUDE_PLUGIN_ROOT}/workflows/discipline/seo/audit.md`
- `keyword-map` → read and follow `${CLAUDE_PLUGIN_ROOT}/workflows/discipline/seo/keyword-map.md`
- `aeo` → read and follow `${CLAUDE_PLUGIN_ROOT}/workflows/discipline/seo/aeo.md`
- anything else: print usage and exit.
- After matching a subcommand, strip it from `$ARGUMENTS` and forward the remainder to the workflow as the new `$ARGUMENTS` value. Example: `/ttm-seo audit https://example.com` → workflow receives `$ARGUMENTS=https://example.com`.

## Next steps

See `${CLAUDE_PLUGIN_ROOT}/templates/next-step-footer.md`.
<!-- next-step-footer -->
