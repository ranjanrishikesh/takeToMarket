---
discipline: affiliate
asset_types: [affiliate-creative-kit, affiliate-landing-page, affiliate-email-swipe]
version: "1.0"
---

# Affiliate Discipline Playbook

This playbook extends the base playbook contract (`base.md`) with affiliate-specific production guidance, discipline gates, and format rules. It is loaded by ttm-producer during content generation and parsed by ttm-verify for gate evaluation.

---

## Production Guidance

### Creative Kit Completeness

Every affiliate creative kit must include the full set of assets partners need to promote effectively:

- **Banner ads:** At least 3 standard IAB sizes (300x250, 728x90, 160x600). Provide high-resolution versions in PNG/JPG and optimized WebP. Each banner should include the product name, a clear value proposition, and a visible CTA.
- **Email swipe files:** At least 2 templates covering different angles (pain-point-led and benefit-led). Include subject lines, preview text, body copy with merge tag placeholders, and a clear CTA with tracking link.
- **Social copy snippets:** Platform-specific copy for X/Twitter (280 chars), LinkedIn (150-word hook + body), and Facebook/Instagram (caption + hashtag suggestions). Each snippet should include a tracking link.
- **Landing page copy:** Dedicated affiliate landing page copy with headline, subhead, 3-5 bullet points of key benefits, social proof element, and a primary CTA. The landing page must use a unique tracking parameter per affiliate.

Do NOT send affiliates to a generic homepage. Every link in the creative kit must route through a trackable landing page with affiliate-specific UTM parameters or affiliate platform tracking codes.

### Attribution and Cookie Logic

Specify the attribution model clearly in every creative kit:

- **Cookie duration:** State explicitly (e.g., 30-day, 60-day, 90-day). Longer windows favor affiliates; shorter windows favor the brand. Match industry norms for your product category.
- **Attribution model:** Declare first-touch or last-touch. First-touch credits the affiliate who introduced the customer; last-touch credits the affiliate whose link was clicked most recently before conversion.
- **Cross-device tracking:** Note whether your platform supports cross-device attribution. If not, disclose this limitation to affiliates.
- **Tracking parameters:** Define the URL parameter format (e.g., `?ref=AFFILIATE_ID` or `?utm_source=affiliate&utm_medium=AFFILIATE_ID`). Every link in creative must use this format.

### Commission Structure and LTV/CAC Math

Commission rates must pass a basic economic sanity check:

- Calculate customer LTV (lifetime value) for the product being promoted
- Determine customer acquisition cost (CAC) ceiling: LTV margin minus target profit
- Set commission at or below CAC ceiling to maintain positive unit economics
- Document payout terms: payment schedule (monthly, net-30, net-60), minimum payout threshold, and payment method

Example: If customer LTV is $500, gross margin is 70% ($350), and target profit per customer is $200, the CAC ceiling is $150. Commission must stay below $150 per conversion to maintain positive unit economics.

### Partner Enablement

Affiliates are external promoters who lack internal product knowledge. Every kit must include:

- **Product summary:** 2-3 paragraph overview of what the product does, who it serves, and why it matters
- **Target audience description:** ICP characteristics so affiliates know who to target
- **Key differentiators:** 3-5 points that distinguish the product from competitors
- **Approved messaging:** Exact claims affiliates can make, pulled from BRAND.md proof points
- **FAQ section:** 8-10 common questions prospects ask, with approved answers

### Compliance Guardrails

Affiliate marketing has specific regulatory requirements:

- **FTC disclosure:** All affiliate content must include clear disclosure of the commercial relationship. Provide affiliates with approved disclosure language (e.g., "This post contains affiliate links. I may earn a commission if you make a purchase.")
- **No income guarantees:** Creative must never promise specific income, results, or returns. Use language like "results may vary" when discussing outcomes.
- **Claim boundaries:** Affiliates may only use claims that appear in BRAND.md approved proof points. No fabricated statistics, no unsubstantiated testimonials.
- **Platform compliance:** Note any platform-specific rules (e.g., Google Ads restrictions on affiliate landing pages, Facebook ad policies on health/finance claims).

---

## Discipline Gates

### DISC-AFFILIATE-01: Creative Kit Completeness -- Tier 1

**Checks:** Creative kit includes all required asset types for affiliates per PLAY-09
**Against:** Asset content and kit manifest

#### Evaluation Criteria

1. **Asset category coverage**
   - PASS: Kit includes at least 3 banner sizes, 2 email swipe templates, social copy snippets for at least 2 platforms, and landing page copy with tracking links
   - WARN: Kit has 2 of 4 asset categories (banners, email swipes, social copy, landing page)
   - FAIL: Kit has fewer than 2 asset categories or no tracking links included in any asset

2. **Asset completeness**
   - PASS: Each asset includes all required elements (banners have CTA, emails have subject lines and preview text, social has platform-specific lengths)
   - WARN: Assets present but missing secondary elements (e.g., emails without preview text)
   - FAIL: Assets are placeholder-only or missing primary elements (e.g., banners without CTA)

### DISC-AFFILIATE-02: Attribution Logic -- Tier 1

**Checks:** Cookie duration, attribution model, and tracking are specified per PLAY-09
**Against:** Creative kit documentation and link structure

#### Evaluation Criteria

1. **Attribution specification**
   - PASS: Creative kit specifies cookie duration (e.g., 30-day, 90-day), attribution model (first-touch or last-touch), and all links use proper tracking parameters
   - WARN: Tracking links present but cookie duration or attribution model not documented
   - FAIL: No tracking infrastructure specified, or creative uses non-trackable links

2. **Link integrity**
   - PASS: Every link in every asset uses the declared tracking parameter format consistently
   - WARN: Most links use tracking parameters but 1-2 links are missing them
   - FAIL: Links use inconsistent formats or multiple assets have untracked links

### DISC-AFFILIATE-03: Commission Sanity -- Tier 2

**Checks:** Commission structure passes LTV/CAC math per PLAY-09
**Against:** Commission documentation and financial projections

#### Evaluation Criteria

1. **Economic viability**
   - PASS: Commission percentage documented, LTV/CAC ratio calculated and shows positive unit economics (commission < customer LTV margin), payout terms stated
   - WARN: Commission stated but LTV/CAC math not shown
   - FAIL: No commission structure documented, or commission exceeds estimated customer LTV margin

2. **Payout clarity**
   - PASS: Payment schedule, minimum threshold, and payment method are all documented
   - WARN: Payment schedule stated but threshold or method missing
   - FAIL: No payout terms documented

### DISC-AFFILIATE-04: Claim Accuracy for Partners -- Tier 1

**Checks:** Affiliate copy does not make claims beyond what is approved in BRAND.md proof points
**Against:** BRAND.md approved claims and proof points

#### Evaluation Criteria

1. **Claim sourcing**
   - PASS: All claims in affiliate creative map to approved proof points in BRAND.md, no income or results guarantees
   - WARN: Claims are technically accurate but use amplified language not present in BRAND.md
   - FAIL: Creative includes unapproved claims, income guarantees, or unsubstantiated statistics

2. **Disclaimer presence**
   - PASS: Creative includes FTC-compliant disclosure language and any required disclaimers for the product category
   - WARN: Disclosure language is present but vague or not prominently placed
   - FAIL: No disclosure language provided for affiliate creative

### DISC-AFFILIATE-05: Partner Enablement -- Tier 2

**Checks:** Affiliates have enough context to sell accurately without access to internal docs
**Against:** Creative kit supplementary materials

#### Evaluation Criteria

1. **Context completeness**
   - PASS: Kit includes product summary, target audience description, key differentiators, approved messaging, and FAQ section
   - WARN: Kit has product summary and messaging but missing FAQ or differentiators
   - FAIL: Kit provides creative assets only with no product context or messaging guidance

2. **FAQ coverage**
   - PASS: FAQ section has 5+ questions covering product functionality, pricing, support, and common objections
   - WARN: FAQ has 2-4 questions but misses a major category (e.g., no pricing FAQ)
   - FAIL: No FAQ section or fewer than 2 questions

---

## Base Gate Overrides

| Base Gate ID | Default Tier | Override Tier | Reason |
|-------------|-------------|---------------|--------|
| GATE-02 (Claim Accuracy) | Tier 2 | Tier 1 | Affiliate claims are amplified by third parties outside brand control; inaccurate claims create legal and brand risk at scale |
| GATE-07 (Compliance) | Tier 2 | Tier 1 | FTC requires affiliate disclosure; non-compliance exposes the brand to regulatory action regardless of which affiliate violated the rule |

---

## Format Rules

### Banner Specifications

- **300x250 (Medium Rectangle):** Most common size. Include product name, one benefit line, CTA button.
- **728x90 (Leaderboard):** Horizontal layout. Product name left, benefit center, CTA right.
- **160x600 (Wide Skyscraper):** Vertical layout. Product name top, benefit middle, CTA bottom.
- **File formats:** Provide PNG (high quality) and WebP (optimized). Max file size 150KB per banner.
- **Text:** Maximum 20% of banner area. Use brand fonts from BRAND.md.

### Email Swipe Format

```
Subject: [Subject line -- 40-60 characters, no spam trigger words]
Preview: [Preview text -- 40-90 characters, complements subject]

Hi [FIRST_NAME],

[Opening hook -- 1-2 sentences addressing a pain point or benefit]

[Body -- 3-5 short paragraphs or bullet points]

[CTA -- single clear action with tracking link]

[Disclosure -- FTC affiliate disclosure]
```

### Social Copy Format

- **X/Twitter:** 200-250 characters (leave room for link). No more than 2 hashtags.
- **LinkedIn:** 150-word hook paragraph + 2-3 supporting points + CTA with tracking link.
- **Facebook/Instagram:** 125-word caption + 3-5 relevant hashtags + tracking link in bio/comments.

### Landing Page Copy Structure

1. **Headline:** 8-12 words, addresses primary benefit
2. **Subhead:** 15-25 words, expands on headline with specificity
3. **Bullet points:** 3-5 key benefits with proof points
4. **Social proof:** Testimonial, customer count, or trust badge
5. **CTA:** Single primary action, above the fold
6. **Tracking:** Unique affiliate parameter in URL

---

## Examples

### Good: Complete Creative Kit

```
Kit includes:
- 3 banner sizes (300x250, 728x90, 160x600) in PNG + WebP
- 2 email swipes (pain-point angle, benefit angle) with subject lines,
  preview text, merge tags, and tracking links
- Social copy for X, LinkedIn, and Facebook with platform-specific lengths
- Landing page copy with headline, benefits, testimonial, CTA
- Product summary (3 paragraphs), ICP description, 5 differentiators
- FAQ with 10 questions covering product, pricing, support, objections
- Attribution doc: 30-day cookie, last-touch model, ?ref=AFFILIATE_ID format
- Commission: 20% recurring, LTV $600, margin $420, commission cap $120/yr
- FTC disclosure template included
```

### Bad: Incomplete Kit

```
Kit includes:
- 1 banner size (300x250 only)
- Generic homepage link (no tracking parameter)
- No email swipes
- No product summary or FAQ
- Commission "to be discussed"
- No disclosure language provided
```

**Problems:** Single banner size limits placement options. No tracking makes attribution impossible. Missing product context means affiliates will make up their own claims. Undefined commission deters quality affiliates.

---

## Anti-Patterns

1. **Creative without product context** -- Sending banners and email templates with no product summary, ICP description, or approved messaging. Affiliates fill the gap with inaccurate or exaggerated claims.

2. **Income or results guarantees** -- Any language promising specific income, conversion rates, or guaranteed results. Violates FTC guidelines and exposes the brand to legal action. Use "results may vary" and focus on product benefits, not partner earnings.

3. **Ignoring FTC disclosure requirements** -- Providing creative without disclosure templates. Even if affiliates are responsible for compliance, the brand shares liability. Always include approved disclosure language in every kit.

4. **Single banner size** -- Providing only one banner size limits where affiliates can place ads. The top 3 IAB sizes (300x250, 728x90, 160x600) cover 80%+ of available placements.

5. **Non-trackable links** -- Using generic URLs, link shorteners without tracking, or links that do not identify the affiliate. Without attribution, neither the brand nor the affiliate can measure performance.

6. **Commission above LTV margin** -- Setting commission rates that exceed the customer's lifetime value margin. This creates negative unit economics where every affiliate-driven sale loses money.

7. **Same pitch for all affiliate tiers** -- Sending identical creative to micro-affiliates and enterprise partners. Tailor kit depth and commission structure to partner tier and audience size.

---

## Metrics

Track these indicators for affiliate content after shipping:

- **Affiliate-driven revenue** -- Total revenue attributed to affiliate links, measured monthly
- **Conversion rate by affiliate** -- Per-affiliate conversion rate to identify top performers and optimize kit for underperformers
- **EPC (Earnings Per Click)** -- Revenue divided by total affiliate link clicks; primary affiliate program health metric
- **Active affiliate rate** -- Percentage of enrolled affiliates who generated at least 1 click in the last 30 days
- **Creative usage rate** -- Which assets from the kit are actually being used by affiliates (tracked via unique creative IDs)
- **Refund/chargeback rate** -- Per-affiliate refund rate to detect fraud or misleading promotion
- **Time to first conversion** -- Days between affiliate enrollment and first attributed sale
- **Kit download/access rate** -- How many enrolled affiliates actually access the creative kit
