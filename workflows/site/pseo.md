# pSEO Workflow

## Step 0: First-run inline education

Read `.taketomarket/CONFIG.md`. Parse `first_run_seen` (object) and `inline_education` (boolean, default true).

If `inline_education` is false: skip this step. Else if `first_run_seen.ttm-pseo` is not `true`, print the explainer below verbatim, then mark this skill as seen:

```bash
node "${CLAUDE_PLUGIN_ROOT}/bin/ttm-tools.cjs" first-run mark ttm-pseo
```

Use this exact check (bash) to decide whether to print: `node "${CLAUDE_PLUGIN_ROOT}/bin/ttm-tools.cjs" first-run check ttm-pseo --raw` -- the JSON `seen` field is `true` once the explainer has run before.

### Explainer for `/ttm-pseo`

`/ttm-pseo` is programmatic SEO: given a template and a dataset
(competitors-vs-you, alternatives, integrations, etc.), it generates
N landing pages with consistent positioning across all of them. Each
page passes the same gate wall as a single landing page, but in bulk.

Why it matters: pSEO is one of the few SEO plays still worth running
in the AI-search era because the long tail of "X vs Y" queries doesn't
get cannibalized as quickly. The catch is that ungoverned pSEO produces
thousands of near-duplicate, positioning-drifted pages. The gate wall
is what makes pSEO defensible at scale.

(Canonical source: `references/inline-education-blurbs.md`. Embedded verbatim because workflows do not @-resolve files at runtime.)

---

**Required reading:**
- `${CLAUDE_PLUGIN_ROOT}/references/pseo-page-anatomy.md`
- `${CLAUDE_PLUGIN_ROOT}/references/pseo-templates/[template]-anatomy.md`
- `${CLAUDE_PLUGIN_ROOT}/references/pseo-templates/[template]-content-playbook.md`
- `${CLAUDE_PLUGIN_ROOT}/templates/pseo/[template]-cms-schema.json`
- `${CLAUDE_PLUGIN_ROOT}/playbooks/pseo.md` (delivered in P6)
- `.taketomarket/POSITIONING.md`, `BRAND.md`, `PRODUCT-DNA.md`, `ICP.md`

---

## Step 1: Verify /ttm-landing is run

Read `.taketomarket/CONFIG.md` for `landing_path`. If not set: print "Run /ttm-landing first" and exit.

## Step 2: Parse args

`<template>` must be one of: blog, use-case, comparison, alternative.
`<sub>` is either `new`, `from-json`, or `list`.

## Step 3 (new): Generate one page

Read appropriate anatomy + content playbook + CMS schema.

AskUserQuestion to gather CMS-schema-required fields, or:
- For blog: title, tldr, key sections (h2 list), takeaways, FAQ.
- For use-case: useCase name, problem, feature pillars, walkthrough steps.
- For comparison: competitor, comparison table rows, when-we-win, when-they-win.
- For alternative: competitor, why-people-leave, why-we-are-alternative, migration steps.

Validate against CMS schema. If invalid: prompt to fix.

Generate page using content playbook guidance.

Render as Next.js page at `[landing_path]/app/[route]/[slug]/page.tsx`:
- `/blog/[slug]` for blog
- `/use-cases/[slug]` for use-case
- `/vs/[slug]` for comparison
- `/alternatives/[slug]` for alternative

Include Schema.org markup (Article + FAQPage + BreadcrumbList).

Mandatory humanize step on the generated copy.

Update `sitemap.ts` and `public/llms.txt` to include new route.

## Step 4 (from-json): Batch generate

Parse JSON file. Validate each entry against schema. For each: same as Step 3 but skip user-question phase.

## Step 5 (list): Just enumerate

List all existing pSEO routes by scanning `[landing_path]/app/{blog,use-cases,vs,alternatives}/`.

## Step 6: Quality gates

Run gates from quality-gates.md on each new page.

## Step 7: Print next steps

## What if this doesn't fit?

Looks like /ttm-pseo can't do that yet.

- Want a new skill? /ttm-request-skill
- Existing skill needs work? /ttm-improve-skill
