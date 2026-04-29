---
discipline: seo
asset_types: [blog-post, landing-page, pillar-page, programmatic-seo]
version: "1.0"
---

# SEO Discipline Playbook

This playbook extends the base playbook contract (`base.md`) with SEO-specific production guidance, discipline gates, and format rules. It is loaded by ttm-producer during content generation and parsed by ttm-verify for gate evaluation.

---

## Production Guidance

### Search Intent First

Identify whether the target query is informational, commercial, navigational, or transactional. Match the content format to the intent:

- **Informational** ("how to X", "what is X"): long-form guide or explainer
- **Commercial** ("best X", "X vs Y"): comparison, listicle, or review
- **Navigational** ("brand X login", "X pricing"): direct landing page
- **Transactional** ("buy X", "X free trial"): conversion-focused landing page with CTA

If the content format does not match the dominant intent in top-ranking results, the asset will underperform regardless of quality.

### Keyword Placement

Place the target keyword in:

- Title tag (near the front)
- H1 heading
- First 100 words of body content
- At least one H2 subheading

Do NOT stuff keywords. Maintain 1-2% keyword density maximum. Keyword variants and synonyms count toward topical coverage but not density.

### Content Structure

Use H2/H3 hierarchy logically. Every H2 should answer a sub-question of the main query. Avoid skipping heading levels (H1 to H3). Each H2 section should be 150-400 words -- long enough for substance, short enough for scannability.

### Internal Linking

Weave 3-6 contextual internal links per 1000 words to related content. Use descriptive anchor text that tells the reader what they will find. Avoid generic anchors like "click here" or "read more."

### Schema Markup

Include Article schema at minimum for blog posts and pillar pages. Add FAQ schema if the content contains question-answer pairs. Add HowTo schema if the content has step-by-step instructions. Specify required fields (headline, author, datePublished for Article; name, acceptedAnswer for FAQ).

### Entity-Based SEO

Reference known entities (people, organizations, concepts, products) that search engines associate with the topic. Build topical authority by connecting to established knowledge graph entities rather than relying on keyword repetition alone.

### Performance Awareness

Content decisions impact Core Web Vitals. Follow these rules:

- Use optimized image formats (WebP/AVIF) with explicit width/height attributes
- Lazy-load images below the fold
- Avoid render-blocking embeds (video players, social widgets) above the fold
- Reserve space for ad slots and dynamic content to prevent layout shift
- Prefer native HTML elements (details/summary for accordions) over heavy JavaScript widgets

---

## Discipline Gates

### DISC-SEO-01: Title/H1 Alignment -- Tier 1

**Checks:** Title tag and H1 heading convey the same primary topic
**Against:** Asset content structure

#### Evaluation Criteria

1. **Title-H1 topic match**
   - PASS: Title tag and H1 contain the same primary keyword and address the same topic
   - WARN: Title and H1 address the same topic but use different keyword phrasing
   - FAIL: Title and H1 address different topics or target different keywords

2. **Title length**
   - PASS: Title tag is 50-60 characters
   - WARN: Title tag is 45-49 or 61-70 characters
   - FAIL: Title tag is under 30 or over 70 characters

### DISC-SEO-02: Search Intent Match -- Tier 1

**Checks:** Content matches the search intent of the target query
**Against:** Brief's target keyword and declared intent type

#### Evaluation Criteria

1. **Intent alignment**
   - PASS: First 100-150 words directly address the target query and match the declared intent
   - WARN: Content addresses the query but the direct answer is buried below introductory context
   - FAIL: Content does not match the declared intent type (e.g., informational content for a transactional query)

2. **Content format match**
   - PASS: Content format matches intent -- listicle for "best X", how-to guide for "how to X", comparison for "X vs Y"
   - WARN: Content partially matches the expected format but includes mixed intent signals
   - FAIL: Content format contradicts the search intent (e.g., a product page for an informational query)

### DISC-SEO-03: Schema Markup -- Tier 2

**Checks:** Structured data presence and correctness
**Against:** schema.org specification for the applicable type (Article, FAQPage, HowTo)

#### Evaluation Criteria

1. **Schema presence**
   - PASS: Appropriate schema type (Article, FAQ, or HowTo) is specified in the asset with required fields populated
   - WARN: Schema type is mentioned but one or more required fields are missing or incomplete
   - FAIL: No schema markup specified for content that qualifies for structured data

2. **Schema accuracy**
   - PASS: All required fields present and correctly typed (e.g., datePublished is ISO 8601, author has name)
   - WARN: Required fields present but optional fields (image, dateModified) are missing
   - FAIL: Required fields missing, incorrect field types, or wrong schema type for the content

### DISC-SEO-04: Internal Link Density -- Tier 2

**Checks:** Contextual internal link quantity and anchor text quality
**Against:** Asset content (self-contained check)

#### Evaluation Criteria

1. **Link count**
   - PASS: 3-6 contextual internal links per 1000 words of content
   - WARN: 1-2 internal links per 1000 words
   - FAIL: 0 internal links in the asset

2. **Anchor text quality**
   - PASS: All internal links use descriptive anchor text that indicates the destination content
   - WARN: Some links use generic anchors ("click here", "read more", "learn more")
   - FAIL: N/A -- linked to link count result

### DISC-SEO-05: Thin Content Detection -- Tier 1

**Checks:** Content depth and uniqueness
**Against:** Asset content (self-contained check)

#### Evaluation Criteria

1. **Word count**
   - PASS: 800+ words for standard pages (blog-post, landing-page, pillar-page); 300+ words for programmatic-seo variants
   - WARN: 500-799 words for standard pages
   - FAIL: Under 500 words for standard pages or under 300 words for programmatic-seo

2. **Unique substance**
   - PASS: Content provides original analysis, proprietary data, unique perspective, or first-party research
   - WARN: Content summarizes existing publicly available information with minor original commentary
   - FAIL: Content is mostly boilerplate, template-generated text with only location/variable swaps, or restates common knowledge without adding value

### DISC-SEO-06: Meta Description -- Tier 2

**Checks:** Meta description presence, length, and keyword inclusion
**Against:** Asset metadata fields

#### Evaluation Criteria

1. **Presence and length**
   - PASS: Meta description is present and 120-160 characters in length
   - WARN: Meta description is present but under 120 or over 160 characters
   - FAIL: No meta description provided

2. **Keyword inclusion**
   - PASS: Target keyword appears naturally within the meta description
   - WARN: A keyword variant or close synonym is used instead of the exact target keyword
   - FAIL: Neither the target keyword nor any recognizable variant appears in the meta description

### DISC-SEO-07: Core Web Vitals Budget -- Tier 1

**Checks:** Content structure for Core Web Vitals impact -- whether the asset's content design stays within performance budgets
**Against:** Google Core Web Vitals thresholds (LCP < 2.5s, CLS < 0.1, INP < 200ms)

#### Evaluation Criteria

1. **LCP risk**
   - PASS: Hero/above-fold content uses optimized image formats (WebP/AVIF) with explicit width/height, lazy-loads below-fold images, no render-blocking embeds above fold
   - WARN: Images present above fold but missing explicit dimensions or using unoptimized formats (PNG/uncompressed JPEG)
   - FAIL: Above-fold content depends on heavy unoptimized media (>200KB hero image without dimensions), multiple render-blocking third-party embeds, or auto-playing video without poster frame

2. **CLS risk**
   - PASS: All images and embeds have explicit width/height or aspect-ratio CSS, no dynamically injected content above fold, ad slots have reserved space
   - WARN: Most media has dimensions but 1-2 elements are missing explicit sizing
   - FAIL: Images/embeds without dimensions that will cause layout shift, dynamically inserted banners or CTAs above existing content

3. **INP risk**
   - PASS: No heavy inline JavaScript or click handlers that would block interaction -- content relies on standard links and native form elements
   - WARN: Interactive elements present (accordions, tabs) but use standard HTML patterns or lightweight JS
   - FAIL: Content specifies complex interactive widgets, heavy carousels, or inline calculators without performance notes

---

## Base Gate Overrides

| Base Gate ID | Default Tier | Override Tier | Reason |
|-------------|-------------|---------------|--------|
| GATE-10 | Tier 2 (advisory) | Tier 1 (blocking) | SEO format correctness directly impacts search rankings; structural errors (missing H1, broken title tag) prevent proper indexing and SERP display |

---

## Format Rules

- **Title tag:** 50-60 characters, target keyword placed near the front
- **Meta description:** 120-160 characters, action-oriented with target keyword included
- **H1:** Exactly one per page, must address the same topic as the title tag
- **URL structure:** Short, hyphenated, includes primary keyword (e.g., `/seo-content-guide` not `/page?id=123`)
- **Image alt text:** Descriptive of the image content, includes target keyword where naturally appropriate
- **Images:** Explicit width/height attributes required, WebP/AVIF format preferred, lazy-load attribute on below-fold images
- **Heading hierarchy:** H1 > H2 > H3 in order, no skipped levels
- **Canonical URL:** Specified for every page to prevent duplicate content issues

---

## Examples

### Good: Intent-Matching Blog Post Structure

```
Title: "How to Optimize Core Web Vitals in 2024" (48 chars)
H1: "How to Optimize Core Web Vitals: A Step-by-Step Guide"
First 100 words: Directly explains what CWV optimization involves and why it matters.
Schema: HowTo with 6 numbered steps.
Internal links: 4 links to related performance articles with descriptive anchors.
```

### Good: Programmatic SEO with Sufficient Depth

```
Title: "Best Coffee Shops in Austin, TX" (33 chars -- variant page)
H1: "Best Coffee Shops in Austin, Texas"
Content: 450 words with 3 unique reviews, local entity references, original ratings.
Schema: Article with LocalBusiness references.
Unique content ratio: 70%+ original text beyond the template.
```

### Bad: Keyword-Stuffed Landing Page

```
Title: "Best SEO Tools | SEO Tools Reviews | Top SEO Tools 2024"
Problem: Title is 56 chars but keyword "SEO Tools" appears 3 times (stuffing).
H1: "SEO Tools" -- does not match the multi-topic title.
Body: "SEO tools" appears every other sentence (4%+ density).
```

### Bad: Thin Programmatic SEO Template

```
Title: "Best Coffee Shops in [City], [State]"
Content: 120 words. Only the city name changes between variants.
Unique content: Template boilerplate with location swap only.
No schema, no internal links, no original substance.
```

---

## Anti-Patterns

1. **Keyword stuffing** -- Keyword density exceeding 2%. Search engines penalize unnatural repetition. Use synonyms and topical variants instead.

2. **Title/H1 mismatch** -- Title tag targeting one keyword while H1 targets a different topic. This confuses search engines about the page's primary topic.

3. **Missing schema markup** -- Publishing content that qualifies for Article, FAQ, or HowTo structured data without specifying the schema. Missed opportunity for rich results.

4. **Generic internal link anchors** -- Using "click here", "read more", or "learn more" as anchor text. Descriptive anchors help search engines understand link relationships.

5. **Duplicate/thin programmatic pages** -- Generating hundreds of pages where only a location or variable name changes. Each page must contain substantive unique content (300+ words unique).

6. **Ignoring search intent** -- Serving informational content for a transactional query, or a product page for an informational query. Match the dominant intent visible in current SERP results.

7. **Hero images without explicit dimensions** -- Placing large images above the fold without width/height attributes causes Cumulative Layout Shift (CLS), degrading Core Web Vitals scores and user experience.

---

## Metrics

Track these indicators for SEO content after shipping:

- **Organic impressions and clicks** -- Google Search Console, measured weekly for first 90 days
- **Average position for target keyword** -- GSC, track trend over 30/60/90 day windows
- **Click-through rate (CTR) from SERP** -- GSC, compare against position-adjusted benchmarks
- **Time on page / scroll depth** -- Analytics platform, indicates content engagement
- **Internal link click-through** -- Track clicks on internal links within the asset
- **Core Web Vitals pass rate** -- PageSpeed Insights or CrUX data, must maintain "Good" threshold
- **Indexed status** -- Confirm page is indexed within 7 days of publication via GSC
