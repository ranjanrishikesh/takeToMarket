---
discipline: paid-ads
asset_types: [search-ad, display-ad, social-ad, video-ad, landing-page-ad]
version: "1.0"
---

# Paid Ads Discipline Playbook

This playbook extends the base playbook contract (`base.md`) with paid advertising-specific production guidance, discipline gates, and format rules. It is loaded by ttm-producer during content generation and parsed by ttm-verify for gate evaluation.

---

## Production Guidance

### Ad-to-Landing-Page Message Match

The single most important factor in paid ad performance is message match -- the ad copy promise must match the landing page headline and above-the-fold content exactly. When a user clicks an ad that says "Get 50% Off Your First Month," the landing page H1 must say "50% Off Your First Month" (or semantically equivalent). Any disconnect between ad promise and landing page delivery kills conversion rate and wastes ad spend.

For every ad creative, specify the landing page URL and confirm that:

- The ad headline claim appears in the landing page H1
- The ad CTA matches the landing page primary action button
- The visual style (colors, imagery, tone) is consistent between ad and landing page
- The offer terms visible in the ad are present above the fold on the landing page

### Creative Variety

Never run a single creative. Every campaign must include multiple creative variations for A/B testing:

- Minimum 3 distinct variations per ad set
- Each variation should test a different angle: different hook, different value proposition emphasis, different visual approach
- Variations should differ meaningfully -- changing one word does not count as a variation
- Label each variation clearly (e.g., "Pain Point Hook," "Social Proof Hook," "Benefit-First Hook")

Creative variety enables performance optimization. Without it, you cannot know which message resonates and you are guessing with budget.

### Audience-Creative Fit

Match creative angle to the target audience segment:

- Pull language directly from ICP.md customer language library -- use the words your audience uses, not internal product jargon
- Address specific pain points or jobs-to-be-done (JTBD) relevant to the audience segment
- Adjust tone for platform context: LinkedIn ads are professional, Instagram ads are visual-first, Google Search ads are intent-driven
- If targeting multiple segments, create segment-specific ad sets with tailored creative -- do not use one-size-fits-all copy

### Bid Strategy Awareness

Creative approach must align with the campaign bid strategy and objective:

- **Awareness campaigns** (CPM/reach): Broad messaging, brand-focused, emotional appeal. Creative drives impressions and recall.
- **Consideration campaigns** (CPC/engagement): Educational, value-driven. Creative drives clicks and engagement.
- **Conversion campaigns** (CPA/ROAS): Direct response, clear CTA, urgency. Creative drives specific actions.

Mismatching creative style and bid strategy wastes budget -- brand awareness copy with aggressive "Buy Now" CTAs confuses the audience; conversion campaigns with vague brand messaging fail to drive action.

### Platform-Specific Copy Constraints

Each platform has strict format requirements. Produce creative within these constraints from the start -- do not write long copy and then truncate:

- **Google Search Ads:** Headlines 1-3 (30 chars each), descriptions 1-2 (90 chars each)
- **Meta/Facebook:** Primary text (125 chars above fold), headline (40 chars), description (30 chars), image 1200x628px
- **LinkedIn:** Single image headline (70 chars), intro text (150 chars above fold), image 1200x627px
- **Display ads:** Varies by size (300x250, 728x90, 160x600) -- text must be legible at each size

Write to the constraint, not around it. If the headline must be 30 characters, write a 30-character headline -- do not write 50 characters and hope it fits.

---

## Discipline Gates

### DISC-PAID-ADS-01: Message Match -- Tier 1

**Checks:** Ad copy promise matches the landing page headline and above-the-fold content
**Against:** Ad creative and specified landing page content

#### Evaluation Criteria

1. **Headline-to-landing-page alignment**
   - PASS: Ad headline claim appears verbatim or semantically equivalent in the landing page H1, and the CTA matches the landing page primary action
   - WARN: Ad and landing page share the same topic but the specific promise differs (e.g., ad says "50% off" but LP says "save big")
   - FAIL: Ad copy makes a promise not present on the landing page, or landing page URL is missing from the brief

2. **Offer consistency**
   - PASS: Any pricing, discount, or offer terms in the ad are identically present on the landing page above the fold
   - WARN: Offer is present on the landing page but requires scrolling or clicking to find
   - FAIL: Ad mentions an offer or price not found on the landing page

### DISC-PAID-ADS-02: Creative Variety -- Tier 1

**Checks:** Campaign includes multiple creative variations for testing
**Against:** Ad brief creative set

#### Evaluation Criteria

1. **Variation count**
   - PASS: At least 3 distinct ad variations (different hooks, visuals, or angles) defined in the brief, each clearly labeled
   - WARN: 2 variations defined
   - FAIL: Single creative with no variation plan

2. **Variation distinctiveness**
   - PASS: Each variation tests a meaningfully different angle (different pain point, different value prop, different emotional appeal)
   - WARN: Variations exist but differ only in minor wording changes (synonym swaps)
   - FAIL: "Variations" are identical copy with only formatting changes

### DISC-PAID-ADS-03: Audience-Creative Fit -- Tier 2

**Checks:** Creative angle matches the target audience segment's pain points and language
**Against:** ICP.md customer language library and audience segment definition

#### Evaluation Criteria

1. **Language alignment**
   - PASS: Ad copy uses language from ICP.md customer language library, addresses a specific pain point or JTBD relevant to the audience segment
   - WARN: Ad copy addresses the right topic but uses generic rather than ICP-specific language
   - FAIL: Ad copy uses internal/product jargon or addresses pain points not in the ICP definition

2. **Segment specificity**
   - PASS: Creative is tailored to a specific audience segment with named pain points from that segment's profile
   - WARN: Creative is broadly relevant to the target market but not tailored to a specific segment
   - FAIL: Creative uses one-size-fits-all messaging with no audience segment consideration

### DISC-PAID-ADS-04: Platform Format Compliance -- Tier 2

**Checks:** Ad copy respects platform character limits and format rules
**Against:** Platform specifications (Google, Meta, LinkedIn, Display)

#### Evaluation Criteria

1. **Character limits**
   - PASS: All headlines under platform limit (Google: 30 chars, Meta: 40 chars, LinkedIn: 70 chars), descriptions under limit (Google: 90 chars, Meta: 125 chars primary text), all copy verified against the target platform
   - WARN: Copy is within 10% of limits but could be tighter to avoid truncation on some devices
   - FAIL: Copy exceeds platform character limits or uses formats unsupported by the target platform

2. **Asset specifications**
   - PASS: Image dimensions, video length, and file format match platform requirements (e.g., Meta: 1200x628px, Google Display: specified banner sizes)
   - WARN: Specs are close but not exact (e.g., slightly off aspect ratio)
   - FAIL: No image/video specs provided, or specs are incompatible with the target platform

### DISC-PAID-ADS-05: Bid Strategy Alignment -- Tier 2

**Checks:** Creative approach aligns with the stated bid strategy and campaign objective
**Against:** Campaign brief bid strategy and objective declaration

#### Evaluation Criteria

1. **Strategy-creative coherence**
   - PASS: Awareness campaigns use broad/engagement-focused creative, conversion campaigns use direct-response creative with clear CTA, the brief explicitly states bid strategy
   - WARN: Bid strategy stated but creative style does not clearly match the objective (e.g., awareness campaign with aggressive CTA)
   - FAIL: No bid strategy stated in the brief, or creative contradicts the campaign objective

2. **CTA appropriateness**
   - PASS: CTA strength matches funnel stage -- soft CTAs ("Learn more") for awareness, strong CTAs ("Start free trial") for conversion
   - WARN: CTA is present but mismatched to the funnel stage
   - FAIL: No CTA in conversion-focused ads, or aggressive sales CTA in awareness-stage ads

---

## Base Gate Overrides

| Base Gate ID | Default Tier | Override Tier | Reason |
|-------------|-------------|---------------|--------|
| GATE-05 (Funnel Integrity) | Tier 2 | Tier 1 | Paid traffic with broken funnels wastes ad spend directly -- every click costs money, so the funnel must be verified before launch |
| GATE-06 (UTM Hygiene) | Tier 2 | Tier 1 | Paid channels require precise attribution to justify spend and optimize campaigns. Missing or incorrect UTMs make ROAS unmeasurable. |

---

## Format Rules

### Google Search Ads

```
Headline 1: {30 characters max -- primary keyword + value prop}
Headline 2: {30 characters max -- differentiator or benefit}
Headline 3: {30 characters max -- CTA or brand}
Description 1: {90 characters max -- expand on the promise, include keyword}
Description 2: {90 characters max -- social proof, urgency, or secondary benefit}
Display URL path: {15 chars}/{15 chars}
```

### Meta / Facebook Ads

```
Primary text: {125 characters visible above fold -- hook + value prop}
  Extended text: {up to 500 chars total, but only 125 visible before "See more"}
Headline: {40 characters max}
Description: {30 characters max -- appears below headline}
CTA button: {Select from platform options: Learn More, Sign Up, Shop Now, etc.}
Image: 1200x628px (1.91:1 ratio), max 20% text overlay
Video: 1:1 or 4:5 for feed, 9:16 for Stories/Reels, 15-60 seconds
```

### LinkedIn Ads

```
Single Image:
  Intro text: {150 characters visible above fold, up to 600 total}
  Headline: {70 characters max}
  Image: 1200x627px (1.91:1 ratio)
  CTA button: {Platform options: Learn More, Sign Up, Download, etc.}

Carousel:
  Cards: 2-10 cards
  Card headline: {45 characters max}
  Card image: 1080x1080px (1:1 ratio)
```

### Display Ad Sizes

| Size | Use Case | Text Guidelines |
|------|----------|-----------------|
| 300x250 | Medium rectangle -- sidebars and in-content | Max 2 lines of headline text, 1 line CTA |
| 728x90 | Leaderboard -- page headers | Single headline + CTA, horizontal layout |
| 160x600 | Wide skyscraper -- sidebars | Stacked layout, headline on top, CTA at bottom |
| 320x50 | Mobile banner | Ultra-short: 5-7 word headline + CTA |
| 300x600 | Half page -- high impact | More room for messaging, image-heavy |

### Video Ad Specs

| Format | Duration | Platform | Notes |
|--------|----------|----------|-------|
| Bumper | 6 seconds | YouTube, Meta | Single message, no CTA click-through |
| Short | 15 seconds | All platforms | Hook in first 2 seconds, CTA at end |
| Standard | 30 seconds | YouTube, Meta, LinkedIn | Full structure: hook, value, CTA |
| Long-form | 60+ seconds | YouTube (skippable) | Hook in first 5 seconds before skip option |

---

## Examples

### Good: Strong Message Match Pair

```
Google Search Ad:
  Headline 1: "50% Off First 3 Months"        (25 chars)
  Headline 2: "Marketing OS for Startups"      (27 chars)
  Headline 3: "Start Free Trial Today"         (23 chars)
  Description 1: "Ship marketing campaigns with built-in quality gates. No more guessing." (73 chars)
  Description 2: "Trusted by 500+ startups. Cancel anytime. No credit card required."       (68 chars)

Landing Page H1: "Get 50% Off Your First 3 Months"
Landing Page CTA: "Start Free Trial"
Above fold: Pricing table showing the 50% discount, feature highlights, "No credit card required"
```

Why it works: Ad headline promise ("50% Off First 3 Months") matches LP H1 exactly. CTA matches. Offer terms are consistent. No surprises after the click.

### Bad: Broken Message Match

```
Meta Ad:
  Primary text: "The #1 marketing tool for growing teams"
  Headline: "Try It Free"
  CTA: Sign Up

Landing Page H1: "Enterprise Marketing Platform"
Landing Page CTA: "Request a Demo"
Above fold: Enterprise features, case studies from Fortune 500 companies
```

Why it fails: Ad targets "growing teams" but LP targets "enterprise." Ad says "Try It Free" but LP says "Request a Demo." The user who clicked expecting a free trial for a small team lands on an enterprise sales page. Conversion rate: near zero.

### Good: Creative Variety Set

```
Variation A - Pain Point Hook:
  "Tired of marketing campaigns that ship without quality checks?"

Variation B - Social Proof Hook:
  "500+ startups use this to ship marketing 3x faster"

Variation C - Benefit-First Hook:
  "Ship campaigns with built-in quality gates -- no more guessing"
```

Why it works: Each tests a fundamentally different angle (pain, proof, benefit). Clear labels. Measurable differences in CTR will reveal which angle resonates.

### Bad: Monotone Creative Set

```
Variation A: "Great marketing tool for your team"
Variation B: "Amazing marketing tool for your team"
Variation C: "Excellent marketing tool for your team"
```

Why it fails: Only the adjective changes. No meaningful test. CTR differences will be noise, not signal.

---

## Anti-Patterns

1. **Sending all ad traffic to the homepage** -- Homepage is not a landing page. It serves multiple audiences and purposes. Paid traffic needs a dedicated landing page with a single message and CTA that matches the ad.

2. **Single creative with no A/B variants** -- Running one ad creative means you cannot optimize. You are paying for traffic with no ability to learn what works. Always launch with 3+ variations.

3. **Awareness creative with conversion bid strategy** -- Running brand awareness copy ("Introducing our new platform") with a CPA bid tells the algorithm to optimize for conversions, but the creative is not designed to convert. Match creative intent to bid strategy.

4. **Ignoring platform character limits** -- Writing 50-character headlines for Google Ads (30-char limit) means the platform truncates your message. Write to the constraint from the start.

5. **Same copy across all platforms** -- LinkedIn professional audience, Instagram visual-first audience, and Google search-intent audience require different creative approaches. Cross-posting identical copy shows audience blindness.

6. **Missing landing page URL in brief** -- An ad brief without a specified landing page cannot be verified for message match. The landing page is half the ad -- always include it.

7. **No bid strategy declaration** -- If the brief does not state whether this is an awareness, consideration, or conversion campaign, the creative cannot be evaluated for strategy alignment. Always declare the objective.

---

## Metrics

Track these indicators for paid ad campaigns after launch:

- **Cost per click (CPC)** -- Average cost per click. Compare against industry benchmarks and historical campaign data.
- **Click-through rate (CTR)** -- Impressions to clicks. Measures ad creative effectiveness. Google Search benchmark: 3-5%. Display benchmark: 0.5-1%.
- **Conversion rate** -- Clicks to desired action (signup, purchase, download). Measures landing page effectiveness post-click.
- **Return on ad spend (ROAS)** -- Revenue generated per dollar spent. Primary efficiency metric for conversion campaigns.
- **Cost per acquisition (CPA)** -- Total spend divided by conversions. Measures efficiency of the full funnel.
- **Quality Score (Google)** -- 1-10 rating based on expected CTR, ad relevance, and landing page experience. Higher scores reduce CPC.
- **Relevance Score (Meta)** -- Ad relevance diagnostics: quality ranking, engagement rate ranking, conversion rate ranking. Low scores indicate audience-creative mismatch.
- **Impression share** -- Percentage of eligible impressions captured. Low impression share may indicate budget or bid constraints.
