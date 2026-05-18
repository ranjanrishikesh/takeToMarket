# Inline Education Blurbs -- Reference

Per-skill 2-paragraph explainer printed once on first run. Engineer-friendly tone,
no marketing-speak, analogies vary deliberately. Tone target: a colleague who's
read the docs explaining a new linter or build tool to a senior engineer.

Each blurb is embedded verbatim into the corresponding workflow's "Step 0:
First-run inline education" block. The runtime does not @-resolve files inside
workflows, so this reference exists for editorial review and regeneration -- the
canonical copy that actually runs is the one inside the workflow file.

Skip-list (no blurb, no Step 0 injection): `ttm-101` (the explainer itself),
`ttm-research`, `ttm-email-preflight`, `ttm-aeo-check`, `ttm-keyword-map`,
`ttm-seo-audit` (deprecation stubs that just route to their successor).

---

## ttm-init

`/ttm-init` is the bootstrap interview. It asks you ~30 structured questions
about your product, audience, positioning, and brand, then generates the
`.taketomarket/` reference files (POSITIONING.md, ICP.md, BRAND.md, PRODUCT-DNA.md,
plus brand colors and a logo set) and writes CLAUDE.md / AGENTS.md so the runtime
knows the rules. Think of it as `npm init` for marketing: one interactive pass
produces the config that every other `/ttm-*` skill reads.

Why it matters now: every downstream skill -- produce, verify, ship, measure --
loads these reference files as their context. If you skip init, every later
skill is operating without your positioning invariant and will drift. Run init
once per project; re-run only on a real positioning shift via `/ttm-positioning-shift`.

## ttm-new-campaign

`/ttm-new-campaign` creates an isolated workspace under `.taketomarket/campaigns/<slug>/`
with its own STATE.md, brief slot, and asset directory. It's the marketing
equivalent of `git checkout -b feature/X`: campaigns are independent units that
can be at different lifecycle phases simultaneously, and the state machine
tracks each one separately.

Why it matters: takeToMarket is multi-campaign by design. Without a campaign
slug, briefs, assets, and verification results have no home and bleed into
each other. Run this before `/ttm-brief` for any new initiative -- it locks in
the campaign id that subsequent skills route work into.

## ttm-brief

`/ttm-brief` is the spec-writing step. You describe the audience, the outcome
metric, the channel, and the angle; the skill writes a structured BRIEF.md that
the production wave will load. It also runs a positioning sanity check against
your `.taketomarket/POSITIONING.md` so the brief can't silently contradict the
invariant.

Why it matters: a brief is the request payload that fans out to multiple parallel
producer subagents. Vague briefs produce inconsistent assets that fail review.
The structured-question format is the equivalent of writing a typed function
signature before implementing the body.

## ttm-discover

`/ttm-discover` is the research phase. It scans your competitors, your category,
and your ICP's actual language to surface angles, claims, and proof points
worth building campaigns around. Output is a structured discovery doc with
candidate hooks, ranked by confidence, that feed into `/ttm-brief`.

Why it matters: without discovery, briefs come from your own head -- which is
how positioning drifts and how every campaign starts to sound the same. This
step is the marketing equivalent of profiling before you optimize: do not skip
to production until you know what's actually resonating.

## ttm-produce

`/ttm-produce` is the production wave. It loads the brief, positioning, brand,
ICP, and playbook into a fresh 200K-token Task() subagent context, generates
the hero asset, then fans out parallel subagents for derivatives. Each producer
runs in isolation and writes to `MANIFEST.json` for the verify step to consume.

Why it matters: producing in the main conversation context means your generic
chat history pollutes the output. Fresh contexts + structured inputs are why
takeToMarket assets pass verification at a higher rate than free-form prompts.
This is also the only place where multiple assets are built in parallel --
sequential production is two-to-five times slower at the same quality.

## ttm-verify

`/ttm-verify` runs every produced asset through the quality-gate wall:
positioning invariant, factual accuracy, brand-voice match, channel-format
compliance, and outcome-metric instrumentation. Failures are written as
structured findings the `/ttm-fix` skill can act on; passes get marked
ready-to-ship.

Why it matters: in marketing, "looks good" is the bug. Without an automated
gate wall, you ship assets that subtly contradict your positioning and only
discover it weeks later in analytics. Verify is the marketing equivalent of
CI: cheap to run, expensive to skip.

## ttm-fix

`/ttm-fix` reads the verification findings, opens the offending asset, applies
targeted corrections, and re-runs only the affected gates. It's deliberately
narrow -- it does not regenerate from scratch, it patches. The fix-verify loop
continues until either all gates pass or you escalate.

Why it matters: regenerating an asset for a small drift wastes context and
loses good prose that was almost right. Fix is the surgical tool; produce is
the hammer. Most assets need one or two fix passes before shipping, and that
loop is where positioning drift gets caught before it leaves the repo.

## ttm-review

`/ttm-review` is human-in-the-loop sign-off. After verify passes the
automated wall, review surfaces the asset with diff context and the gate
results so you can sanity-check tone, claims, and channel fit before it
ships. You can approve, reject with feedback, or escalate to a positioning
shift.

Why it matters: automated gates catch invariant violations but not subjective
calls about whether an asset is the right one for this moment. Review is the
human commit-message step: the system stops, surfaces context, and waits for
your decision rather than auto-shipping.

## ttm-humanize

`/ttm-humanize` rewrites AI-flavored prose into something that sounds like a
person wrote it: varied sentence rhythm, fewer hedges, specific verbs, no
"furthermore" or "in today's fast-paced." It runs after verify, before review,
and only on assets flagged for tone tuning.

Why it matters: detection models and human readers both pattern-match on the
same tells, and AI-fingerprinted copy converts worse and damages trust. Think
of humanize as a code formatter that targets the LLM-prose anti-patterns the
way Prettier targets whitespace.

## ttm-ship

`/ttm-ship` is the publish step. It packages the approved asset for its
target channel, writes the canonical version into the campaign's `shipped/`
directory, updates STATE.md to `shipped`, and records the outcome metric
hooks so `/ttm-measure` knows what to read later.

Why it matters: shipping in marketing is when a campaign becomes a measurable
unit. Without the structured ship step, you've got files in a folder and no
way to attribute results back to the brief. Treat this like `git tag` plus
deployment: the moment the asset goes live and starts producing data.

## ttm-measure

`/ttm-measure` ingests analytics data (pasted in manually for the MVP) and
matches it against the outcome metric declared in the brief. Output is a
pass/fail per campaign plus a per-asset performance summary written to
MEASURE.md.

Why it matters: every brief committed to an outcome metric, and measure is
where that commitment gets checked. Skipping measure means you never learn
which positioning angles, channels, or hooks actually moved the number --
the production loop becomes vibes-driven. This is the closing parenthesis on
the spec-driven cycle.

## ttm-learn

`/ttm-learn` reads finished campaigns -- briefs, gate results, ship records,
measurement output -- and extracts compound learnings into
`.taketomarket/LEARNINGS.md`: what positioning angles converted, which
channels under- or over-delivered, which playbook variants worked. Future
briefs auto-load this file.

Why it matters: marketing learnings without a structured store dissolve into
folklore inside three months. Learn turns each campaign's data into a
versioned doc that biases the next brief toward what actually worked --
the marketing equivalent of a postmortem doc plus a regression suite of
tactics.

## ttm-positioning-check

`/ttm-positioning-check` audits a campaign's brief and assets against the
positioning invariant declared in POSITIONING.md. Output is a drift report:
which claims diverge, by how much, and whether the drift is small enough to
correct in-place or large enough to require a positioning shift.

Why it matters: positioning drift is the single most common cause of
inconsistent marketing across a year. This skill is the linter for that --
run it after producing if anything feels off, and absolutely run it before
shipping a campaign that hits a new channel or audience.

## ttm-positioning-shift

`/ttm-positioning-shift` is the only skill (besides init) that may modify
POSITIONING.md. It walks you through a deliberate positioning change:
documents the old position, captures the rationale, writes the new one,
and flags every existing campaign that needs re-verification under the
new invariant.

Why it matters: positioning changes are schema migrations. If you edit
POSITIONING.md ad-hoc, you've silently invalidated every shipped asset
and there's no audit trail. This skill makes the change explicit,
auditable, and propagates the consequences across active campaigns.

## ttm-brand-refresh

`/ttm-brand-refresh` updates `.taketomarket/BRAND.md`, the brand colors,
and the logo set. It re-asks the brand questions from init, regenerates
the color tokens, and either regenerates the logo or imports a new one
you supply. Existing campaigns get flagged for re-verification on brand
gates only.

Why it matters: brand and positioning are different invariants. You can
refresh brand (palette, logo, voice tweaks) without a full positioning
shift, and this skill keeps that boundary clean. Use it for visual
refreshes and voice retunes; use positioning-shift for what you're
actually saying.

## ttm-icp-refresh

`/ttm-icp-refresh` updates `.taketomarket/ICP.md` -- the Ideal Customer
Profile reference. It asks updated questions about the audience: their
jobs, pains, sophistication level, channels, and the exact words they
use. The new ICP propagates to every brief written afterward.

Why it matters: ICPs drift as your real customer base shifts away from
who you thought you were selling to. If your last three campaigns
under-performed and you can't explain why, the ICP doc is usually six
months stale. Refresh is cheap insurance against marketing to a
customer who no longer exists.

## ttm-competitor-scan

`/ttm-competitor-scan` surveys your declared competitors' positioning,
recent campaigns, and channel mix, then writes a structured comparison
into `.taketomarket/COMPETITORS.md`. Discover and brief consume this to
avoid sounding identical to whoever you're against.

Why it matters: differentiation is a verifiable property only if you
have an explicit competitor reference. Without one, your assets drift
toward the category mean because that's what the model has seen most.
Run this periodically -- competitor positioning is the input that
goes stalest fastest.

## ttm-landing

`/ttm-landing` produces a landing page from your positioning, brand,
ICP, and a brief. It generates the HTML, applies the brand tokens,
writes the page into your site directory, and queues the four landing
quality gates (positioning, copy clarity, conversion fundamentals,
visual review via Playwright).

Why it matters: landing pages are the highest-leverage marketing
asset for developerneurs because they're the conversion surface for
every other campaign. Treating them as one-off prose vs. spec-driven
generation is the difference between A/B testing your way upward
and rewriting from scratch every two months.

## ttm-pseo

`/ttm-pseo` is programmatic SEO: given a template and a dataset
(competitors-vs-you, alternatives, integrations, etc.), it generates
N landing pages with consistent positioning across all of them. Each
page passes the same gate wall as a single landing page, but in bulk.

Why it matters: pSEO is one of the few SEO plays still worth running
in the AI-search era because the long tail of "X vs Y" queries doesn't
get cannibalized as quickly. The catch is that ungoverned pSEO produces
thousands of near-duplicate, positioning-drifted pages. The gate wall
is what makes pSEO defensible at scale.

## ttm-deploy

`/ttm-deploy` ships your generated site (landing + pSEO + any static
assets) to the deploy target detected from your project (Vercel,
Netlify, Cloudflare Pages, etc.) or guides manual deployment if no
target is detected. It does not bypass the gate wall -- only verified,
reviewed assets are pushed.

Why it matters: a verified asset that isn't deployed is functionally
equivalent to no asset. This skill is the bridge between the
spec-driven pipeline and the live URL, and it preserves the audit trail
so you can correlate a deployed page back to its brief and gate results.

## ttm-affiliate-kit

`/ttm-affiliate-kit` generates a complete affiliate / partner enablement
package: positioned creative, copy variants per channel, claim cards
with substantiation, and a one-pager partners can drop into their
own funnels. Everything inherits your positioning invariant.

Why it matters: affiliates and partners are the highest-drift channel
because the assets leave your control. A structured kit with explicit
positioning rails is the difference between affiliate-driven growth
that compounds and affiliate-driven content that contradicts your
own site within a quarter.

## ttm-email-check

`/ttm-email-check` is the email pre-flight. It runs a draft email
through deliverability checks (spam-trigger phrases, structural red
flags, list-hygiene reminders) and the positioning gate, plus a
voice check against your BRAND.md. Output is a pass/fix-list.

Why it matters: email is unforgiving -- one drift-laden send to a
warm list can damage open rates for weeks. Treat this skill like a
pre-commit hook for outbound: cheap, fast, and the only thing
standing between your draft and your domain reputation.

## ttm-linkedin-post

`/ttm-linkedin-post` generates a LinkedIn post from a campaign brief or
a raw thought, applies the LinkedIn-specific patterns (hook, scannable
structure, comment-bait, no link in body), and routes it through the
gate wall. Output is a ready-to-post draft plus a comment-thread plan.

Why it matters: LinkedIn rewards a specific format that violates
general copywriting rules (short lines, deliberate whitespace,
no-link bodies). Generic LLM output writes essays; this skill writes
posts that match the platform's actual distribution mechanics.

## ttm-repurpose

`/ttm-repurpose` takes a shipped hero asset and generates derivative
assets for other channels (LinkedIn from a blog, email from a landing
page, threads from a podcast transcript) while preserving the
positioning invariant. Each derivative runs the full gate wall.

Why it matters: most marketing teams produce one-off assets; the
compound advantage comes from making one hero work across five
channels. Repurpose is the systematic version of that, with explicit
provenance so you can trace any channel asset back to the parent and
the brief.

## ttm-seo

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

## ttm-improve-skill

`/ttm-improve-skill` opens a feedback loop on a specific takeToMarket
skill. It diffs your last few invocations of a skill, asks what felt
wrong or missing, and either drafts a local skill override or files a
structured issue against the takeToMarket repo so the change can land
upstream.

Why it matters: takeToMarket is opinionated, which means it'll be
wrong about your context sometimes. This skill is the structured
escape hatch -- instead of fighting the skill in-conversation, you
record the friction, get a fix, and avoid that friction permanently.
Treat it like filing a linter rule exemption.

## ttm-request-skill

`/ttm-request-skill` is the proposal pipeline for new skills. You
describe a marketing job you keep doing manually, the skill asks
structured questions (inputs, outputs, gates, frequency), and
produces either a local SKILL.md draft you can iterate on or a
formatted feature request against the upstream repo.

Why it matters: solopreneurs hit recurring marketing tasks that
nobody else's playbook covers because nobody else has your product.
Rather than re-prompting from scratch each time, this skill turns
your repeated workflow into a versioned, gated skill -- the same
way you'd extract a utility function after writing the same code
three times.

## ttm-resume

`/ttm-resume` is the session-recovery skill. It loads the active
campaign's STATE.md, summarizes the last completed phase, lists
pending work and known blockers, and recommends the exact next
`/ttm-*` command. It also detects interrupted verify/fix loops so
you continue from where the loop stopped.

Why it matters: marketing campaigns run across many sessions over
many days, and context loss between sessions is where things get
silently dropped. Resume is the equivalent of restoring a debugger
state: you don't have to remember where you were because the state
files do.

## ttm-next

`/ttm-next` scans every active campaign in the project and proposes
the single highest-priority next move across the whole portfolio.
Output is a ranked list with one top recommendation plus up to
three alternatives, each as a runnable `/ttm-*` command.

Why it matters: when more than two campaigns are active, "what
should I do next" becomes a meaningful decision that depends on
which campaigns are stuck, which are about to lose momentum, and
which have the soonest measurable outcome. This skill is the
scheduler for your marketing pipeline.

## ttm-state

`/ttm-state` is the read-only dashboard. With no argument it prints
every campaign (active and archived) with its current phase, blockers,
shipped-asset count, and last activity timestamp. With a slug, it
prints the per-campaign detail view from that campaign's STATE.md.

Why it matters: state is the truth file in takeToMarket -- not your
memory, not the conversation history. This skill is how you check
that truth without mutating it. Use it before running any campaign
action when you're not sure where you left off.

## ttm-archive

`/ttm-archive` moves a finished campaign out of the active set into
`.taketomarket/archive/`. It freezes STATE.md, preserves the gate
results and ship records, and removes the campaign from the
`/ttm-next` queue. Archived campaigns still feed `/ttm-learn`.

Why it matters: campaigns that should be done but stay marked active
pollute scheduling and waste cognitive budget every time you run
`/ttm-state`. Archive is the marketing equivalent of merging and
deleting a branch -- the work is preserved, but it's out of your
active workspace.

## ttm-health

`/ttm-health` audits the integrity of your `.taketomarket/` directory.
It checks that reference files exist and aren't suspiciously empty,
flags stale references, validates per-campaign STATE.md against the
file system, surfaces DRIFT-LOG anomalies, and reports gate-result
inconsistencies. It only reports -- it does not self-heal.

Why it matters: state corruption in a long-running multi-campaign
project is silent until something breaks. Running health periodically
(or letting it auto-trigger on detected issues) catches drift like a
filesystem fsck -- before it forces a manual rebuild of a campaign's
state.

## ttm-playwright-setup

`/ttm-playwright-setup` installs and configures the Playwright MCP
required for the visual landing-page gate (gate 4) and any future
browser-based verification. It detects your existing MCP config,
adds the Playwright entry, and confirms the tool is reachable from
the runtime.

Why it matters: the landing-page gate wall includes a Playwright-driven
visual check, and without the MCP installed it falls back to a softer
gate. This skill turns the soft gate into a hard one. Treat it as the
runtime equivalent of installing a missing test dependency.

## ttm-update

`/ttm-update` checks your installed takeToMarket version against the
npm registry, detects whether you installed via npm or git clone,
runs the appropriate upgrade path, then reconciles any locally-edited
skill files against the new source and offers per-file diffs.

Why it matters: skills evolve quickly and an out-of-date install
silently misses gate improvements and bug fixes. This skill is the
opinionated upgrader -- it knows the right command for your install
method and preserves your local edits behind explicit prompts rather
than overwriting them.

