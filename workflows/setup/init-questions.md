# Interview Question Bank

## Usage

This file is referenced by the main init workflow via `@workflows/setup/init-questions.md`.
It defines all questions -- both AskUserQuestion (structured) and inline freeform.
The workflow orchestrates the sequence; this file provides the question content.

---

## Priority convention (v2.3.0)

Every question is tagged `priority: critical` or `priority: non-critical`.

When `.taketomarket/CONFIG.md` has `yolo: true`:
- `critical` questions are ALWAYS asked.
- `non-critical` questions are skipped and answered with the documented `default:` value.

A question becomes critical if its answer feeds the meta-gate wall (positioning drift, must-not-say, banned words, ICP boundary) OR the manifesto/identity foundation.

---

## Section 1: Product and Positioning

### Structured Questions (AskUserQuestion)

**Product Category**
- header: "Category"
- question: "What category does your product compete in?"
- priority: critical
- default: null
- multiSelect: false
- options:
  - label: "SaaS / Software"
    description: "Software product or service"
  - label: "E-commerce / DTC"
    description: "Direct-to-consumer physical product"
  - label: "Professional Services"
    description: "Agency, consulting, or services business"
  - label: "Developer Tools"
    description: "Tools for software developers"
  - label: "Other"
    description: "Something else (you will describe it)"

### Freeform Questions

1. **Product description**
   - question: "Tell me about your product or service. What does it do, and who is it for?"
   - priority: critical
   - default: null

2. **Primary differentiator**
   - question: "What's the ONE thing your product does that competitors don't? Not a general advantage -- a specific capability or mechanism."
   - priority: critical
   - default: null

3. **Proof points**
   - question: "Give me 3 proof points -- specific numbers, case studies, or benchmarks that back up your differentiator. Each needs a source."
   - priority: critical
   - default: null

4. **Must-not-say terms**
   - question: "What terms or phrases should we NEVER use in our marketing? Give a reason for each."
   - priority: critical
   - default: null

5. **Competitive frame**
   - question: "Who are you positioning against? Not just competitors -- what alternatives does your target audience use today?"
   - priority: critical
   - default: null

### Template Fields Collected

positioning.md: Category, Target audience, Primary differentiator, Proof points (3+), Must-not-say, Competitive frame, Positioning History

---

## Section 2: Brand and Voice

### Structured Questions (AskUserQuestion)

**Voice Archetype**
- header: "Voice"
- question: "Which voice archetype best describes your brand?"
- priority: critical
- default: null
- multiSelect: false
- options:
  - label: "Authoritative Expert"
    description: "Confident, data-driven, thought leadership"
  - label: "Friendly Guide"
    description: "Warm, approachable, educational"
  - label: "Bold Challenger"
    description: "Direct, provocative, convention-breaking"
  - label: "Analytical Observer"
    description: "Measured, precise, evidence-based"
  - label: "Empathetic Advisor"
    description: "Understanding, supportive, solution-oriented"
  - label: "Other"
    description: "Something else (you will describe it)"

**Formality Level**
- header: "Formality"
- question: "How formal is your brand's communication?"
- priority: non-critical
- default: "Conversational"
- multiSelect: false
- options:
  - label: "Very formal"
    description: "Academic, institutional, regulatory"
  - label: "Professional"
    description: "Business-appropriate, polished"
  - label: "Conversational"
    description: "Natural, relaxed but informed"
  - label: "Casual"
    description: "Informal, colloquial, personality-forward"
  - label: "Varies by channel"
    description: "Different formality per context"

### Freeform Questions

1. **Brand personality**
   - question: "Describe your brand's personality in 2-3 sentences. How should your content sound?"
   - priority: critical
   - default: null

2. **Example sentences**
   - question: "Give me an example of a sentence that sounds exactly like your brand. Then give me one that sounds nothing like it."
   - priority: non-critical
   - default: null

3. **Banned words**
   - question: "What words or phrases are absolutely banned from your marketing? Why?"
   - priority: critical
   - default: null

4. **Tone shift per channel**
   - question: "How should your tone shift between blog posts, social media, email, and landing pages?"
   - priority: non-critical
   - default: "Match section 2 voice archetype across all channels"

### Template Fields Collected

brand.md: Voice archetype, Voice attributes, Tone per context (Blog/Social/Email/Landing/Support), Banned words with reasoning, Proof points, Good examples, Bad examples

---

## Section 3: ICP and Audience

### Structured Questions (AskUserQuestion)

None -- this section is entirely freeform to capture rich qualitative data.

### Freeform Questions

1. **Ideal customer description**
   - question: "Describe your ideal customer. Include their role, company size, industry, and any geographic focus."
   - priority: critical
   - default: null

2. **Jobs to be done**
   - question: "What is the main job your customer is trying to get done when they find your product?"
   - priority: critical
   - default: null

3. **Pain points**
   - question: "What are the top 3 pain points that drive them to look for a solution like yours? How severe and frequent is each?"
   - priority: critical
   - default: null

4. **Buying triggers**
   - question: "What events or situations trigger them to start looking for a solution?"
   - priority: non-critical
   - default: null

5. **Anti-ICP**
   - question: "Who should we explicitly NOT target? Describe your anti-ICP and why they are a bad fit."
   - priority: critical
   - default: null

6. **Customer language**
   - question: "Share 3-5 exact phrases your customers use to describe their problems. These can come from support tickets, reviews, sales calls, or interviews."
   - priority: non-critical
   - default: null

### Template Fields Collected

icp.md: Primary segment, Demographics, Psychographics, JTBD, Pain points (severity + frequency), Buying triggers, Anti-ICP, Customer language library

---

## Section 4: Channels

### Structured Questions (AskUserQuestion)

**Primary Channel**
- header: "Channel"
- question: "What is your primary marketing channel?"
- priority: critical
- default: null
- multiSelect: false
- options:
  - label: "Organic Search / SEO"
    description: "Search engine traffic and rankings"
  - label: "LinkedIn"
    description: "LinkedIn organic and/or ads"
  - label: "Email"
    description: "Email marketing and newsletters"
  - label: "Social Media"
    description: "Twitter/X, Instagram, TikTok, etc."
  - label: "Paid Ads"
    description: "Google Ads, Meta Ads, etc."
  - label: "Content / Blog"
    description: "Long-form content marketing"
  - label: "YouTube"
    description: "Video content marketing"
  - label: "Events"
    description: "Conferences, webinars, meetups"
  - label: "Other"
    description: "Something else (you will describe it)"

### Freeform Questions

1. **Active channels baselines**
   - question: "List all your active marketing channels with their current performance baselines (traffic, engagement, conversion rate)."
   - priority: non-critical
   - default: null

2. **Paused channels**
   - question: "Are there channels you tried and paused? Which ones and why?"
   - priority: non-critical
   - default: null

3. **Banned channels**
   - question: "Are there channels you will never use? Which ones and why?"
   - priority: non-critical
   - default: null

4. **Budget split**
   - question: "How is your marketing budget split across channels? Approximate percentages are fine."
   - priority: non-critical
   - default: null

### Template Fields Collected

channels.md: Active channels with baselines, Primary channel, Dormant channels with reasons, Banned channels with reasons, Budget allocation, Channel-specific rules

---

## Section 5: Competitors

### Structured Questions (AskUserQuestion)

None -- competitor analysis requires nuanced freeform answers.

### Freeform Questions

1. **Top 3 competitors**
   - question: "Name your top 3 direct competitors. For each: what is their positioning, key strength, and key weakness?"
   - priority: critical
   - default: null

2. **2x2 positioning map**
   - question: "If you drew a 2x2 positioning map for your category, what would the two axes be? Where do you and your competitors fall on it?"
   - priority: non-critical
   - default: null

3. **Share of voice**
   - question: "Estimate share of voice: who dominates the conversation in your space? On which channels?"
   - priority: non-critical
   - default: null

4. **Competitor content**
   - question: "What content do your competitors publish? Which formats and channels do they focus on, and what seems to work for them?"
   - priority: non-critical
   - default: null

### Template Fields Collected

competitors.md: Direct competitors (positioning, strength, weakness), Positioning map (axes + positions), Share of voice baseline, Competitor content analysis

---

## Section 6: Metrics and Calendar

### Structured Questions (AskUserQuestion)

**Attribution Model**
- header: "Attribution"
- question: "Which attribution model do you use (or want to use)?"
- priority: non-critical
- default: "Last-touch"
- multiSelect: false
- options:
  - label: "Last-touch"
    description: "100% credit to last interaction before conversion"
  - label: "First-touch"
    description: "100% credit to first interaction"
  - label: "Linear"
    description: "Equal credit across all touchpoints"
  - label: "Time-decay"
    description: "More credit to recent touchpoints"
  - label: "Custom"
    description: "Custom model (you will describe it)"
  - label: "Not sure"
    description: "Need help deciding"

### Freeform Questions

1. **Primary outcome metric**
   - question: "What is your primary outcome metric for marketing? (e.g., qualified pipeline, revenue, signups). What is your target?"
   - priority: critical
   - default: null

2. **Secondary metrics**
   - question: "What secondary metrics do you track? What leading indicators help you predict outcomes?"
   - priority: non-critical
   - default: null

3. **Current baselines**
   - question: "What are your current baselines for key metrics? (Include metric name, current value, and date measured.)"
   - priority: non-critical
   - default: null

4. **Quarterly theme**
   - question: "What is your theme or key initiative for this quarter?"
   - priority: non-critical
   - default: null

5. **Upcoming launches**
   - question: "Do you have any upcoming launches or campaigns already planned? Dates and descriptions."
   - priority: non-critical
   - default: null

6. **Publishing cadence**
   - question: "What is your content publishing cadence per channel? (e.g., blog 2x/week, email weekly)"
   - priority: non-critical
   - default: null

7. **Blackout dates**
   - question: "Are there any blackout dates -- holidays, company events, industry events where you should not publish?"
   - priority: non-critical
   - default: null

### Template Fields Collected

metrics.md: Primary outcome metric (metric/target/window/source), Secondary metrics, Leading indicators, Baselines, Attribution model configuration
calendar.md: Quarterly themes, Launch calendar, Always-on cadence, Blackout dates

---

## Question-to-Template Mapping

| Section | Template File | Key Fields Collected |
|---------|--------------|---------------------|
| 1 | positioning.md | Category, Target audience, Primary differentiator, Proof points, Must-not-say, Competitive frame |
| 2 | brand.md | Voice archetype, Tone per context, Banned words, Proof points, Examples |
| 3 | icp.md | Primary segment, JTBD, Pains, Triggers, Anti-ICP, Customer language |
| 4 | channels.md | Active channels, Baselines, Dormant, Banned, Budget allocation |
| 5 | competitors.md | Direct competitors, Positioning map, Share of voice |
| 6 | metrics.md, calendar.md | Primary metric, Secondary metrics, Attribution, Baselines, Themes, Launches, Cadence, Blackout dates |
