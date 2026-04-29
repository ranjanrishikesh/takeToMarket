---
discipline: aeo
asset_types: [blog-post, pillar-page, knowledge-base, faq-page]
version: "1.0"
---

# AEO Discipline Playbook

This playbook extends the base playbook contract (`base.md`) with AEO-specific (Answer Engine Optimization) production guidance, discipline gates, and format rules. AEO optimizes content for AI-powered answer engines (ChatGPT, Perplexity, Gemini, Copilot) that extract and cite web content in their responses.

> If this asset also targets organic search, ensure SEO playbook gates are also satisfied. AEO and SEO are complementary -- AEO builds on SEO foundations.

---

## Production Guidance

### SEO Cross-Reference

AEO does not replace SEO -- it extends it. If the asset targets organic search in addition to AI engine citations, apply the SEO playbook gates alongside these AEO gates. Well-structured SEO content (clear headings, schema markup, keyword-aligned structure) forms the foundation that AI engines parse when extracting answers.

### Citation-Worthiness

Write sentences that can be quoted verbatim by AI engines. Use definitive, concise statements that stand alone as complete answers:

- **Do:** "Core Web Vitals consist of three metrics: LCP, CLS, and INP."
- **Do not:** "It might be said that Core Web Vitals could potentially include several metrics."

Avoid hedging language ("it might be", "some believe", "arguably", "it could be said"). AI engines skip uncertain statements in favor of definitive ones.

### Structure for AI Extraction

Use clear H2 headings phrased as questions. Follow each H2 with a 1-2 sentence definitive answer, then elaborate. This maps to how AI engines extract answers:

```
## What Are Core Web Vitals?

Core Web Vitals are three performance metrics that Google uses to measure user experience: Largest Contentful Paint (LCP), Cumulative Layout Shift (CLS), and Interaction to Next Paint (INP). [Elaboration follows...]
```

### FAQ Patterns

Include explicit question-answer pairs using natural language question formats:

- "What is [X]?"
- "How does [X] work?"
- "Why is [X] important?"

These match the query patterns users submit to AI engines and increase the likelihood of citation.

### Fact Density

Concentrate verifiable facts in the first paragraph and at the start of each section. AI engines prioritize high-fact-density passages over opinion or narrative. Lead with data, statistics, and concrete claims.

### Multi-Source Corroboration

Ensure claims made in the asset can be verified against multiple authoritative sources. AI engines prefer claims that appear consistently across the web. Avoid making claims that only appear in your content -- they are less likely to be cited.

---

## Discipline Gates

### DISC-AEO-01: Quote-Worthy Sentences -- Tier 1

**Checks:** Presence of verbatim-quotable standalone answer sentences
**Against:** Asset content

#### Evaluation Criteria

1. **Quote count**
   - PASS: 3+ sentences that could be quoted verbatim as standalone answers by an AI engine (complete, factual, no surrounding context needed)
   - WARN: 1-2 quotable sentences in the asset
   - FAIL: 0 quotable sentences -- all sentences require surrounding context to make sense

2. **Quote placement**
   - PASS: Quotable sentences appear in section openers (immediately after H2 headings) and first paragraphs
   - WARN: Quotable sentences exist but are buried in mid-body paragraphs rather than section openers
   - FAIL: N/A -- linked to quote count result

### DISC-AEO-02: FAQ/HowTo Schema -- Tier 1

**Checks:** Structured data for AI engine consumption
**Against:** schema.org FAQPage or HowTo specification

#### Evaluation Criteria

1. **Schema presence**
   - PASS: FAQPage or HowTo schema is specified with well-formed Q&A pairs or numbered steps
   - WARN: Schema type is specified but incomplete -- missing answers, missing step descriptions, or fewer than 3 Q&A pairs
   - FAIL: No FAQ/HowTo schema on content that contains question-answer pairs or step-by-step instructions

2. **Q&A completeness**
   - PASS: Every FAQ pair has a substantive answer of 2+ sentences; every HowTo step has a clear action description
   - WARN: Some answers are single-sentence or thin (under 20 words); some steps lack detail
   - FAIL: FAQ has questions without answers, placeholder text in answers, or HowTo steps with no description

### DISC-AEO-03: Author/Expert Markup -- Tier 2

**Checks:** Author attribution and expertise signals
**Against:** Asset content and metadata

#### Evaluation Criteria

1. **Author schema**
   - PASS: Author name and credentials (title, organization, relevant expertise area) specified in asset metadata or byline
   - WARN: Author name is present but no credentials, bio, or expertise indicators
   - FAIL: No author attribution -- content has no byline or author metadata

2. **Expertise signals**
   - PASS: Content references the author's specific experience, proprietary data, original research, or direct domain expertise
   - WARN: Generic expertise claim ("written by an expert") without specific supporting details
   - FAIL: No expertise signals present -- content could have been written by anyone without domain knowledge

### DISC-AEO-04: Cross-Domain Fact Consistency -- Tier 1

**Checks:** Claims do not contradict other campaign assets
**Against:** Other assets in the same campaign (via MANIFEST.json cross-reference)

#### Evaluation Criteria

1. **Number consistency**
   - PASS: All numeric claims (percentages, counts, dates, prices) in this asset match the same claims in other campaign assets
   - WARN: Numeric claims use different rounding or timeframes but are directionally consistent (e.g., "over 50%" vs "53%")
   - FAIL: Numeric claims directly contradict claims in other campaign assets (e.g., "30% improvement" here vs "50% improvement" elsewhere)

2. **Positioning consistency**
   - PASS: Key product/service claims and positioning statements are consistent across all campaign assets
   - WARN: Minor phrasing differences that could be interpreted differently by AI engines citing different assets
   - FAIL: Direct contradictions in product claims, feature descriptions, or positioning across campaign assets

### DISC-AEO-05: Direct Answer Format -- Tier 2

**Checks:** Sections open with definitive answers before elaboration
**Against:** Asset content structure (H2 sections)

#### Evaluation Criteria

1. **Section opener quality**
   - PASS: Each major section (H2) opens with a 1-2 sentence definitive answer to the section's implicit question before any elaboration
   - WARN: Most sections open with direct answers but 1-2 sections start with context, background, or preamble before answering
   - FAIL: Sections consistently open with context, history, or preamble instead of answering the implicit question first

2. **Independent citability**
   - PASS: Key facts and answers can be extracted from individual paragraphs without needing surrounding paragraphs for context
   - WARN: Some facts require reading 2+ paragraphs together to get the full context
   - FAIL: Facts are spread across multiple sections with no self-contained, independently extractable statements

---

## Base Gate Overrides

None -- all base gates keep default tiers.

---

## Format Rules

- **H2 headings:** Phrased as questions matching user queries ("What Is X?" not "About X")
- **First paragraph:** Must contain a definitive answer to the page's primary question within the first 2 sentences
- **FAQ section:** Minimum 3 Q&A pairs when using FAQPage schema; each answer must be 2+ sentences
- **HowTo section:** Numbered steps with clear action verbs as step openers (e.g., "Install the package" not "The package should be installed")
- **Word count:** 1,500+ words for comprehensive AEO content -- AI engines favor depth and thoroughness over brevity
- **Sentence structure:** Key answer sentences should be 15-30 words -- long enough to be complete, short enough to be quotable

---

## Examples

### Good: Definitive Section Opener

```
## What Is Answer Engine Optimization?

Answer Engine Optimization (AEO) is the practice of structuring web content so AI-powered answer engines can accurately extract, attribute, and cite it in their responses. Unlike traditional SEO, AEO prioritizes citation-worthiness and fact density over keyword placement.
```

### Good: Quotable Standalone Sentence

```
"Core Web Vitals consist of three metrics: Largest Contentful Paint (LCP), Cumulative Layout Shift (CLS), and Interaction to Next Paint (INP)."
-- This sentence can be lifted verbatim by any AI engine as a complete, accurate answer.
```

### Bad: Hedging Language

```
"It could be argued that Core Web Vitals might include several important metrics that some developers believe are essential."
-- No AI engine will quote this. Too uncertain, no concrete facts, no standalone value.
```

### Bad: Buried Answer

```
## What Is AEO?

The history of search engines dates back to the 1990s when Archie first indexed FTP sites. Over the decades, search evolved through directories, PageRank, and semantic search. Today, a new paradigm is emerging... [answer finally appears in paragraph 4]
-- The actual answer is buried under context. AI engines extract from the first 1-2 sentences after a heading.
```

---

## Anti-Patterns

1. **Opening sections with history/context instead of direct answers** -- AI engines extract from the first sentences after a heading. If those sentences are background context, the actual answer is missed or a less authoritative source is cited instead.

2. **Hedging language** -- Phrases like "It could be argued", "Some experts believe", "It might be the case" signal uncertainty. AI engines prefer definitive statements and will skip hedged claims in favor of direct ones from other sources.

3. **FAQ schema with thin answers** -- FAQPage schema where answers are single words, sentence fragments, or placeholder text ("Coming soon"). This provides no value to AI engines and may cause schema validation warnings.

4. **Self-contradicting facts across assets** -- Publishing different numbers or claims in different campaign assets (blog says "30% faster", landing page says "2x faster"). AI engines may cite both, surfacing the contradiction to users.

5. **No author attribution on expertise-dependent content** -- Publishing authoritative claims about health, finance, legal, or technical topics without author credentials. AI engines increasingly weight E-E-A-T signals when selecting citation sources.

---

## Metrics

Track these indicators for AEO content after shipping:

- **AI engine citations** -- Manual check across ChatGPT, Perplexity, Gemini, and Copilot for brand/product queries; check monthly
- **Featured snippet captures** -- Google Search Console and SERP monitoring tools; featured snippets indicate extraction-worthy content
- **FAQ rich result appearances** -- GSC Rich Results report; tracks how often FAQ schema generates rich results
- **Direct answer box presence** -- Monitor target queries in Google for Position 0 / direct answer box appearances
- **Citation accuracy** -- When cited by AI engines, verify the cited content matches the source accurately (no hallucinated claims attributed to you)
