---
discipline: aeo
asset_types: [answer-block, faq-schema, definition-section, llms-txt]
version: "2.0"
---

# AEO Discipline Playbook — Relevance Engineering

This playbook extends the base playbook contract (`base.md`) with AEO-specific production guidance, discipline gates, and format rules. It is loaded by ttm-producer during content generation and parsed by ttm-verify for gate evaluation.

The opinion that drives every section below comes from Mike King (iPullRank) and his **Relevance Engineering** framework. King's premise: classic SEO assumed deterministic ranking (write a page, it ranks). AI Mode is probabilistic — your content is decomposed into passages, recomposed by an LLM, scored against embedding-similarity to a fan-out of synthetic queries, and may never appear as a blue-link page. AEO is not a separate discipline you bolt onto SEO; it is the passage-level, entity-first, citation-aware engineering practice that subsumes SEO for AI-mediated retrieval.

If you are new to AEO operationally, also read `references/pseo-page-anatomy.md` — the "Above the fold" and "AI citability signals" sections are the operational counterpart to the King-flavored opinion in this playbook.

> If this asset also targets organic search, ensure SEO playbook gates are satisfied alongside these AEO gates. Relevance Engineering subsumes SEO — it does not exempt you from it.

---

## Production Guidance

### Engineer the Passage, Not the Page

The unit of optimization in Relevance Engineering is the **passage**, not the page. An AI Mode system runs a user query through a **query fan-out** — that single query expands into 8–30 synthetic sub-queries inside the model. Each synthetic query retrieves passages from across the index, scores them by **embedding similarity**, and stitches the winners into a synthesized answer. Your page does not "rank." Individual paragraphs from your page either survive the embedding sort and get composed into the answer, or they don't.

The engineering implication: every paragraph must be **semantically complete in isolation**. A paragraph that requires the paragraph above it to make sense will lose to a competitor paragraph that doesn't. Think of each H2 block as a public API endpoint — it must return a useful response without context-of-call. If you would not paste a paragraph into a Slack reply and have it stand on its own, an LLM will not lift it into an AI Overview.

Practical rule: open every H2 with a **citation-worthy definitional sentence** of the form `<Entity> is <Class> that <distinguishing claim>.` This is what King calls "fitting the reasoning target." The LLM is looking for a passage that can answer one of the synthetic sub-queries in its fan-out. Give it one.

### Query Fan-Out Replaces the Keyword

The old SEO mental model — pick a head keyword, write one page, measure rank — is dead. Relevance Engineering replaces the keyword with the **query fan-out cluster**: the set of synthetic queries an AI Mode system will generate from a single user prompt.

Before producing an AEO asset, enumerate the fan-out:

1. Start with the user-facing query (e.g., "how does Postgres handle replication").
2. List the synthetic sub-queries an LLM is likely to spawn from it: definitional ("what is Postgres replication"), procedural ("how to configure streaming replication in Postgres"), comparative ("Postgres replication vs MySQL replication"), troubleshooting ("Postgres replication lag"), entity-disambiguating ("Postgres logical vs physical replication"). Aim for 8–15.
3. Audit your draft against the fan-out. Every synthetic query should map to at least one passage in your asset that could be lifted verbatim to answer it.

Coverage of the fan-out — not keyword density — is the new ranking proxy. A page with one head keyword but zero passages answering the fan-out is invisible to AI Mode.

### Entity-First, Terms Second

AI Mode resolves **entities** before it resolves terms. When a user asks "compare Stripe and Adyen," the model first grounds "Stripe" and "Adyen" as Knowledge Graph entities (company nodes with type, founding date, product surface, geography) and only then retrieves passages about them. If your content mentions "Stripe" without disambiguating which Stripe (the payments company, not the journalist, not the typeface), you are losing the entity grounding step and your passages will be retrieved less.

Engineering rules for entity disambiguation:

- **Name entities precisely on first mention.** Use the full proper name plus class: "Stripe (the payments infrastructure company)", "Postgres (the open-source relational database)", "INP (Interaction to Next Paint, a Core Web Vital)."
- **Mark relationships explicitly.** "Stripe acquired Paystack in 2020" beats "they acquired Paystack" because the LLM doesn't have to resolve a pronoun against an embedding window.
- **Use canonical identifiers.** Where a Wikipedia / Wikidata page exists for the entity, link to it. This is the cheapest way to anchor your content to the model's entity graph.
- **Repeat entities by name, not by pronoun**, far more than feels natural in prose. LLMs do not penalize repetition the way human readers do; they reward it as a disambiguation signal.

### Citation-Worthiness Is a Two-Way Street

LLMs preferentially cite **content that itself cites**. King's observation: a passage that names a source, an author, and a number is far more likely to survive the embedding sort than a passage that asserts the same fact without provenance. Citation-worthiness is not just "be quotable" — it is "demonstrate that you are downstream of verifiable evidence."

Every substantive claim in an AEO asset must include at least one of: a named source (with link), a named author (with credential), or a concrete number (with unit and date). "Most teams use Kubernetes" is unciteable. "65% of CNCF survey respondents reported Kubernetes in production in 2024 ([CNCF Annual Survey 2024](https://cncf.io/...))" is composition-bait — the LLM can lift this passage with attribution and the attribution itself buys you the citation.

### Composition-Friendly Structure (NLU-Readable Markup)

LLMs synthesize **structured** content more reliably than flowing prose. The reason is mechanical: passage extractors run on structural boundaries — H2 blocks, list items, table rows, `<dfn>` tags. Prose that flows across these boundaries gets chopped mid-thought and loses the embedding match.

Make your markup NLU-readable:

- **One question per H2.** Phrase H2s as the question a user would type. "How does Postgres streaming replication work?" beats "Streaming replication."
- **One claim per list item.** Bullets are passage units. A bullet with three claims will retrieve worse than three bullets with one claim each.
- **Definitions get `<dfn>` or bold + `is`.** First mention of any term that could be the subject of a synthetic query must be marked structurally — either via `<dfn>X</dfn> is Y` or via `**X** is Y`.
- **Tables for comparative content.** "X vs Y" queries retrieve from tables before they retrieve from prose. A 3-column table (feature, X, Y) outperforms two paragraphs.
- **FAQ schema for explicit Q&A pairs.** Schema.org FAQPage is not decorative — it is the only structural signal that a passage is intended as a question-answer unit.

### Multimodal Is Mandatory

AI Mode retrieves from text, image, audio, video, and transcript indexes simultaneously. A page with only prose is competing with one hand tied. For any AEO asset:

- Include at least one **labeled diagram or chart** with a `<figcaption>` that itself is a citation-worthy sentence. The figcaption is what the multimodal retriever indexes.
- For procedural content, include a **transcript-style numbered HowTo** with named action verbs (so video and how-to retrievers both have a target).
- For comparative content, the table above is also the image — render it as an HTML table, not a screenshot of one. HTML tables are passage-extractable; image-of-table is not.

### llms.txt Is the Site-Level Equivalent of a Citation

At the site root, publish `/llms.txt` listing your AEO-eligible routes with one-sentence descriptions. This file is the site-level analogue of a per-page citation: it tells AI crawlers which URLs to prioritize and what each URL is *about* in your own words. See the "llms.txt" section of `references/pseo-page-anatomy.md` for the format.

### Cross-References

- For per-page structural anatomy: `references/pseo-page-anatomy.md` (sections: "Above the fold", "AI citability signals", "llms.txt").
- For SEO foundations Relevance Engineering builds on: `playbooks/seo.md`.

---

## Discipline Gates

### DISC-AEO-01: Citation-Worthy Definitional Sentence -- Tier 1

**Checks:** Each major section opens with a passage that can be lifted verbatim to answer one synthetic query from the fan-out.
**Against:** Asset content (H2 section openers).

#### Evaluation Criteria

1. **Definitional opener present**
   - PASS: Every H2 section opens with a sentence of the form `<Entity> is <Class> that <claim>` or `<Procedure> involves <N> steps: <enumeration>` within the first 1–2 sentences after the heading, with the entity named precisely (no pronouns, no "it", no "this").
   - WARN: Most H2s open with definitional sentences but 1–2 sections open with context, history, or preamble before the definition.
   - FAIL: Sections consistently open with narrative context, hedging, or backstory ("The history of X dates back to...") instead of a passage-extractable definition.

2. **Standalone citability**
   - PASS: 3+ sentences in the asset can be quoted verbatim by an LLM as a complete answer — they contain the named entity, the claim, and no unresolved pronouns or anaphora.
   - WARN: 1–2 standalone citable sentences exist; the rest require surrounding sentences to make sense.
   - FAIL: Zero sentences are independently citable — every claim requires reading neighboring sentences for entity resolution or context.

### DISC-AEO-02: Query Fan-Out Coverage -- Tier 1

**Checks:** The asset covers the synthetic query fan-out, not just the head query.
**Against:** Brief's target query plus the enumerated fan-out (definitional, procedural, comparative, troubleshooting, entity-disambiguating sub-queries).

#### Evaluation Criteria

1. **Fan-out enumeration**
   - PASS: The brief or asset front-matter enumerates 8+ synthetic sub-queries spanning at least 4 of the 5 fan-out categories (definitional, procedural, comparative, troubleshooting, disambiguating).
   - WARN: 4–7 sub-queries listed, or fan-out covers only 2–3 categories.
   - FAIL: No fan-out enumerated, or only the head query targeted.

2. **Passage coverage of fan-out**
   - PASS: Every enumerated sub-query maps to at least one passage (paragraph, list, or table row) in the asset that could be lifted as a verbatim answer to it.
   - WARN: 70–99% of sub-queries have a mapped passage; 1–2 sub-queries have no passage answering them.
   - FAIL: Under 70% of enumerated sub-queries have a passage answer in the asset.

### DISC-AEO-03: Entity Disambiguation and Linking -- Tier 1

**Checks:** Named entities are disambiguated structurally so AI Mode can ground them against the Knowledge Graph.
**Against:** Asset content; Wikidata / Wikipedia entity database for canonical identifiers.

#### Evaluation Criteria

1. **First-mention disambiguation**
   - PASS: Every proper noun on first mention is named with full proper name + class qualifier ("Stripe (the payments infrastructure company)", "INP (Interaction to Next Paint)"), and every entity that has a Wikipedia/Wikidata page is linked on first mention.
   - WARN: Most first mentions are disambiguated but 1–2 entities are introduced bare (no class qualifier and no canonical link).
   - FAIL: Entities are introduced without class qualifiers or canonical links; ambiguity remains (e.g., "Stripe" with no qualifier in a payments article that competes with non-payments senses).

2. **Pronoun and anaphora load**
   - PASS: In each H2 section, named entities are referred to by name (not by pronoun) at least 60% of the time; key claims contain the entity name explicitly.
   - WARN: 40–59% by-name reference rate; some passages rely on "it" or "they" where the entity name would improve passage independence.
   - FAIL: Sections rely heavily on pronouns ("it", "they", "this") to refer to entities, breaking passage-level independence.

### DISC-AEO-04: Citation Provenance Density -- Tier 1

**Checks:** Substantive claims demonstrate downstream-of-evidence status via sources, authors, or numbers.
**Against:** Asset content; external sources cited.

#### Evaluation Criteria

1. **Provenance per claim**
   - PASS: Every quantitative claim (percentages, counts, dates, dollar amounts) names a source (with link) or an author (with credential), and at least 3 distinct external sources are cited in the asset.
   - WARN: Some quantitative claims have provenance, but 1–2 numeric claims appear without a named source or author.
   - FAIL: Numeric claims appear unsourced, or fewer than 2 distinct external sources are cited in the entire asset.

2. **Author and expertise signals**
   - PASS: Author name and a credential or expertise indicator (title, organization, relevant first-party experience) are present in asset metadata or byline; the content references at least one piece of first-party experience, proprietary data, or original analysis.
   - WARN: Author name present but no credential, or credential present but content makes no first-party claim.
   - FAIL: No author attribution and no first-party signal — content could have been written by anyone.

### DISC-AEO-05: Composition-Friendly Structural Markup -- Tier 1

**Checks:** Markup is NLU-readable: structural boundaries align with passage boundaries, schema is present for Q&A and definitional content.
**Against:** Asset HTML / Markdown structure and schema.org markup.

#### Evaluation Criteria

1. **H2-as-question and one-claim-per-bullet**
   - PASS: H2 headings are phrased as questions matching likely user queries; bullet lists contain one claim per item; comparative content uses HTML tables, not prose paragraphs.
   - WARN: Most H2s are question-phrased but 1–2 are noun-phrase ("About X"); some bullets contain multiple claims; comparative content uses prose where a table would retrieve better.
   - FAIL: H2s are noun-phrase labels ("Overview", "Background", "About"); bullets contain paragraph-length multi-claim content; comparative content is delivered entirely in prose.

2. **Schema markup for definitional and Q&A content**
   - PASS: Definitional content uses `<dfn>` or `**term** is` patterns on first mention; FAQ content has schema.org `FAQPage` with 3+ well-formed Q&A pairs (every answer 2+ sentences); HowTo content has schema.org `HowTo` with named steps and action-verb openers.
   - WARN: Some structural markup present but incomplete — FAQPage with under 3 pairs, or HowTo with steps missing descriptions, or definitions present but not marked structurally.
   - FAIL: No schema markup on content that contains explicit Q&A or step-by-step procedures; no `<dfn>` or equivalent on definitional content.

### DISC-AEO-06: Cross-Asset Fact Consistency -- Tier 1

**Checks:** Claims in this asset do not contradict claims in other campaign assets — AI Mode will retrieve passages from across your site and surface contradictions to users.
**Against:** Other assets in the same campaign (via MANIFEST.json cross-reference).

#### Evaluation Criteria

1. **Numeric consistency**
   - PASS: All numeric claims (percentages, counts, dates, prices) in this asset match the same claims in other campaign assets exactly, or are dated/sourced explicitly so the LLM can resolve the freshness.
   - WARN: Numeric claims use different rounding or timeframes but are directionally consistent ("over 50%" vs "53%") and the difference is explainable from dates/sources.
   - FAIL: Numeric claims directly contradict claims in other campaign assets ("30% faster" here, "50% faster" elsewhere) with no dated explanation, creating a contradiction the LLM may surface.

2. **Entity and positioning consistency**
   - PASS: Named entities (product, ICP role, alternative beaten) and positioning claims are referenced with identical naming across all campaign assets.
   - WARN: Minor phrasing differences for the same entity or claim that an LLM could resolve as the same intent.
   - FAIL: Same entity referred to by inconsistent names across assets, or positioning claims that contradict each other (different ICP role named, different alternative beaten).

---

## Base Gate Overrides

| Base Gate ID | Default Tier | Override Tier | Reason |
|-------------|-------------|---------------|--------|
| GATE-10 | Tier 2 (advisory) | Tier 1 (blocking) | Structural markup correctness (H1, H2 hierarchy, schema validity) is load-bearing for passage extraction in AI Mode. Malformed structure does not just degrade SEO display — it makes the asset invisible to passage retrievers. |

---

## Format Rules

- **Answer block (TL;DR):** 2–3 sentences, 40–80 words, immediately after H1. Contains the named entity, the class, and the distinguishing claim. This is the single most-extracted passage on the page.
- **H2 headings:** Phrased as full natural-language questions matching the fan-out ("How does X work?", "What is the difference between X and Y?"). No noun-phrase labels.
- **Definitional sentences:** Marked with `<dfn>` on first mention, or rendered as `**term** is <class> that <claim>`. Each H2 section opens with one.
- **FAQ schema:** Minimum 3 Q&A pairs when using FAQPage schema; each answer 2+ sentences (40+ words) and self-contained.
- **HowTo schema:** Numbered steps with action-verb openers ("Install the package", not "The package should be installed"); each step has a name and description.
- **Comparative content:** HTML tables, not prose. Minimum 3 columns (feature, option A, option B); minimum 5 rows.
- **Citations:** Every numeric claim cites a named source with link; at least 3 distinct external sources across the asset.
- **Entity links:** First mention of any entity with a Wikipedia/Wikidata page links to it.
- **Sentence length for answer passages:** 15–30 words — long enough to be complete, short enough to be lifted.
- **llms.txt:** Site root must publish `/llms.txt` listing AEO routes with one-sentence descriptions. Updated on each new AEO route.
- **Word count:** No fixed minimum — depth follows the fan-out. A 6-query fan-out may need 800 words; a 20-query fan-out may need 2500. Coverage, not word count, is the rule.

---

## Examples

### Good: Citation-Worthy Definitional Opener (King-flavored)

```
## What is Interaction to Next Paint (INP)?

Interaction to Next Paint (INP) is a Core Web Vital that measures the latency of every user
interaction with a page and reports the worst-case latency observed during the visit
(Google Web Vitals, March 2024). INP replaced First Input Delay (FID) as a Core Web Vital
in March 2024 because FID only measured the first interaction, missing the 95% of slow
interactions that occur after page load.
```

Why this works: H2 is question-phrased. First sentence is the definitional passage — entity named with full proper name and class qualifier, claim is concrete, source is cited inline. Second sentence performs entity disambiguation (INP vs FID) and supplies a comparative passage for the "INP vs FID" synthetic query in the fan-out. Both sentences are standalone-citable.

### Good: Composition-Friendly Comparative Table

```
## How does Postgres logical replication differ from physical replication?

Postgres supports two replication modes — logical and physical — with different trade-offs:

| Property              | Physical Replication              | Logical Replication               |
|-----------------------|-----------------------------------|-----------------------------------|
| Replication unit      | WAL records (byte-for-byte)       | Logical changes (row-level)       |
| Cross-version support | No (same major version only)      | Yes (cross-version permitted)     |
| Selective tables      | No (whole cluster replicated)     | Yes (per-table publication)       |
| Use case              | High-availability standby         | Migration, ETL, partial sync      |
```

Why this works: Table is HTML-renderable (passage-extractable per row). Each row is a single comparative claim — an LLM can lift one row to answer one synthetic sub-query. Entity disambiguation is explicit ("Postgres logical replication" vs "Postgres physical replication" — both terms appear in the header so the embedding match resolves cleanly).

### Bad: Keyword-Stuffed, Entity-Ambiguous Passage

```
## INP

INP is important. Many sites are tracking INP because INP is a new metric.
It can be slow if the page has too much JavaScript. You should improve INP
to make your site faster. INP optimization is a key part of SEO.
```

Why this fails: H2 is a noun-phrase label, not a question. The entity is named but never disambiguated — "INP" appears 5 times but the class qualifier ("a Core Web Vital", "Interaction to Next Paint") never appears, so the LLM cannot ground the entity. Pronoun "it" breaks passage independence. No citation, no numbers, no source. Keyword repetition without semantic distance variation produces a low-similarity score against the fan-out, not a high one.

### Bad: Buried Answer, Narrative Preamble

```
## What is Answer Engine Optimization?

In the early days of search, Archie indexed FTP servers and Yahoo built directories.
As the web grew, ranking became algorithmic with PageRank, and then semantic with BERT.
Now a new paradigm is emerging — one driven by large language models and probabilistic
retrieval. In this new world, marketers are scrambling to adapt. [Answer appears in paragraph 4.]
```

Why this fails: The first sentence after the H2 is narrative history, not a definitional passage. The passage extractor will lift sentence 1 as the candidate answer to "what is AEO" — and sentence 1 is about Archie and Yahoo, not about AEO. The asset loses the fan-out match to a competitor who opens with the definition.

---

## Anti-Patterns

1. **Opening sections with history/context instead of the definitional passage.** AI Mode passage extractors lift the first 1–2 sentences after a heading. If those sentences are backstory, the actual definition is invisible and a competitor's passage wins the fan-out match. Lead with the definition; supply history later in the section if at all.

2. **Hedging language as a substitute for evidence.** "It could be argued", "Some believe", "Arguably" all signal absence of citation. LLMs preferentially cite content that itself cites — a hedge tells the model your passage is downstream of nothing. Replace hedges with sources, authors, and numbers.

3. **Pronoun-heavy passages that break passage independence.** "It", "they", "this approach" all force the embedding model to resolve anaphora against a context window it doesn't carry into retrieval. Every passage must name the entity explicitly, even at the cost of "unnatural" prose repetition. LLMs reward this; human readers tolerate it.

4. **Entity ambiguity on first mention.** Introducing "Stripe" or "Postgres" or "INP" without a class qualifier and without a canonical link forces the model to guess which entity you mean. The guess often goes wrong, and your passage never participates in the right fan-out cluster.

5. **Treating schema as decoration.** Sprinkling `FAQPage` schema with single-word answers, or `HowTo` schema with no step descriptions, is worse than no schema — it tells the parser to expect structured Q&A and then disappoints it. Schema is the contract that says "this content is genuinely composition-ready"; if the content doesn't honor the contract, the page is downranked.

6. **One-page-per-keyword thinking.** The 2015 SEO playbook said "one keyword, one page." Relevance Engineering says "one fan-out, one cluster of passages distributed across as many surfaces as the fan-out demands." A single page rarely answers an entire fan-out. Plan content as a cluster: pillar page + answer-block pages + comparison pages + FAQ pages, cross-linked, with each cluster member optimized for a sub-region of the fan-out.

7. **Treating AEO as a separate vendor / discipline from SEO.** Outsourcing "AEO" to a different team or tool while running SEO separately produces contradictory assets. Relevance Engineering subsumes both — the same passages need to serve both deterministic SEO retrieval and probabilistic AI-Mode composition. See `playbooks/seo.md`.

8. **Single-format content in a multimodal index.** Text-only assets compete against text + image + video + transcript on the same query. A well-labeled HTML table (which is also a chart), a diagram with a citation-worthy `<figcaption>`, and a transcript-style HowTo each open a different retrieval surface. Skipping them concedes those surfaces to competitors.

9. **Rank-tracking via logged-out searches.** King explicitly flags this: logged-out SERPs no longer reflect what most users see in personalized AI Mode results. AEO measurement must be presence-based (citation tracking) not rank-based.

---

## Metrics

Track these indicators for AEO content after shipping. The bias here is **presence** (am I cited?) and **readiness** (is my content eligible to be cited?), not rank.

- **AI Mode citation rate** — Manual or scripted check across ChatGPT, Perplexity, Gemini, Claude, and Google AI Overviews for the head query and 3–5 sub-queries from the fan-out; check monthly. The metric is "cited / not cited" per surface, not a position number.
- **Brand mention frequency in AI summaries** — For broad queries adjacent to your category, count how often your brand or product is mentioned (even without a click-through link). This is the AI-Mode equivalent of share-of-voice.
- **Fan-out coverage rate** — For each enumerated synthetic sub-query, did at least one passage in your asset cluster get cited? Target 70%+ coverage.
- **Featured snippet / Position 0 capture** — Google Search Console SERP monitoring; featured snippet capture is a strong leading indicator of AI Overview inclusion.
- **FAQ rich result appearances** — GSC Rich Results report; tracks how often FAQPage schema generates rich results, which doubles as a proxy for whether the schema is being parsed correctly.
- **Citation accuracy** — When cited by an AI engine, verify the cited text matches your source verbatim. Drift (LLM paraphrases that introduce errors) is a signal that your passages are not standalone-citable enough — the model is rewriting them to make them work, and rewrites introduce error.
- **llms.txt crawl hits** — Server-log check for AI-crawler hits on `/llms.txt`; presence of crawler hits is a readiness signal that AI systems are using the route map.
- **Cross-asset contradiction count** — Diff numeric claims across all campaign assets monthly; target zero contradictions. AI Mode will surface contradictions between two of your own pages to a user, eroding trust faster than any single bad page.

---

## Sources

Mike King's Relevance Engineering framework as cited throughout this playbook:

- Mike King, "How AI Mode Works" — iPullRank, 2025. https://ipullrank.com/how-ai-mode-works
- Mike King, "Optimizing for New Search: How Relevance Engineering Is Reshaping SEO" — Advanced Web Ranking blog. https://www.advancedwebranking.com/blog/optimizing-new-search-how-relevance-engineering-is-reshaping-seo
- Search Engine Land, "Mike King — SMX Advanced 2025 interview" (named 2025 Search Marketer of the Year for Relevance Engineering work). https://searchengineland.com/mike-king-smx-advanced-2025-interview-456186

Supporting material:

- AirOps, "10x Content Engineer: Michael King" interview (entity-first SEO and passage-level optimization). https://www.airops.com/blog/10x-content-engineer-michael-king
- Operational AEO anatomy used by takeToMarket: `references/pseo-page-anatomy.md`.
