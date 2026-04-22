# takeToMarket - Codex Instructions

## Core Invariant

Every marketing asset ships with a verifiable outcome metric and passes through a positioning-invariant quality gate wall. No asset ships without both, ever.

## Positioning as Invariant (positioning-as-invariant)

POSITIONING.md is the source of truth for all marketing content. It is:
- **Read-only during campaign execution** -- cannot be edited from within a campaign
- **Loaded into every phase context** -- compact summary in non-produce phases, full document in produce/verify
- **Enforced via quality gates** -- positioning drift gate is Tier 1 (blocking)

To change positioning, use `/ttm-positioning-shift` which requires:
1. Explicit reasoning for the shift
2. Migration plan for existing assets
3. Deprecation schedule
4. Human approval

## Outcome Over Output

Every campaign brief must define:
- **Outcome metric**: What business result we expect (e.g., "20% increase in trial starts")
- **Output metric**: What we produce (e.g., "4 blog posts, 2 emails")

Outcome is reported first. Output without outcome is not a campaign.

## Campaign Lifecycle

Campaigns follow a 9-phase lifecycle: Discover -> Brief -> Produce -> Verify -> Review -> Fix -> Ship -> Measure -> Learn

Each phase has a dedicated `/ttm-*` command. Phases cannot be skipped.

## File Paths

- Marketing state: `.marketing/`
- Reference files: `.marketing/POSITIONING.md`, `.marketing/BRAND.md`, etc.
- Campaigns: `.marketing/CAMPAIGNS/<slug>/`
- Campaign state: `.marketing/CAMPAIGNS/<slug>/STATE.md`

## Deterministic Operations

Always use `ttm-tools.cjs` for:
- Slug generation: `node ttm-tools.cjs slug "campaign name"`
- Timestamps: `node ttm-tools.cjs timestamp`
- State updates: `node ttm-tools.cjs state update <field> <value>`
- Health checks: `node ttm-tools.cjs health`

Never generate slugs or timestamps via AI -- they must be deterministic.

## Quality Gate Wall

Assets pass through 10 base quality gates:
1. Positioning drift (Tier 1 - blocking)
2. Claim accuracy (Tier 1 - blocking)
3. Voice drift
4. Outcome alignment (Tier 1 - blocking)
5. Funnel integrity
6. UTM hygiene
7. Compliance
8. Competitor collision
9. ICP fit
10. Format correctness

Tier 1 gates are blocking. Tier 2 gates are advisory.
