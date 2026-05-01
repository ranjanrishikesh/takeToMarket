---
discipline: youtube
asset_types: [video-script, thumbnail-brief, description, community-post]
version: "1.0"
---

# YouTube Discipline Playbook

This playbook extends the base playbook contract (`base.md`) with YouTube-specific production guidance, discipline gates, and format rules. It is loaded by ttm-producer during content generation and parsed by ttm-verify for gate evaluation.

---

## Production Guidance

### Hook in the First 5 Seconds

The first 5 seconds determine whether a viewer stays or clicks away. Every video script must open with one of these hook patterns:

- **Problem statement:** Name a specific pain point the viewer recognizes ("You're losing 40% of your viewers in the first 10 seconds")
- **Bold claim:** Make a concrete, falsifiable promise ("This one change doubled our conversion rate")
- **Curiosity gap:** Tease a result without revealing the method ("Most creators get this completely wrong")
- **Pattern interrupt:** Open with something unexpected -- a visual, a question, or a contrarian take

Never open with a greeting ("Hey guys, welcome back"), a channel introduction, or a sponsor read before the hook. The hook comes first, always.

### Title + Thumbnail Click-Fit

Title and thumbnail are a single unit -- they must work as a complementary pair:

- **Title promises:** The title makes a specific, curiosity-driven promise. It tells the viewer WHAT they will learn or get.
- **Thumbnail amplifies visually:** The thumbnail shows the RESULT, EMOTION, or CONTRAST that makes the promise tangible. It does NOT repeat the title text.
- **Complementary, not redundant:** If the title says "I Tested 100 Hooks," the thumbnail shows the data chart or a shocked face -- not the words "100 Hooks."

Effective pairs create a "curiosity loop" -- the viewer needs to click to close the gap between what the title promises and what the thumbnail shows.

### Description SEO

YouTube descriptions are searchable. Optimize them:

- Place the target keyword in the first 2 lines (first 150 characters visible before "Show more")
- Include timestamps for videos over 10 minutes (YouTube uses these for chapters and key moments in search)
- Add 2-3 relevant links (related videos, resources mentioned, landing pages)
- Include 3-5 hashtags at the end (YouTube displays the first 3 above the title)
- Write 200+ words total -- longer descriptions improve discoverability

### End-Screen CTA Placement

Every video script must include an end-screen section in the final 20 seconds:

- Verbal CTA: Tell the viewer exactly what to do next ("Watch this video next" or "Subscribe if you want weekly breakdowns")
- Visual placement notes: Specify where end-screen elements appear (avoid covering important visuals)
- Link the CTA to a specific next video or playlist, not just "subscribe"

### Retention Curve Awareness

YouTube rewards watch time. Structure scripts to front-load value:

- Deliver the key value proposition within the first 30% of the script
- Use pattern interrupts every 2-3 minutes (change visual, ask a question, introduce a new sub-topic)
- Avoid extended tangents that pull away from the promised topic
- Use "open loops" -- tease upcoming sections to keep viewers watching ("In a moment I'll show you the exact template, but first...")
- Place the most valuable or surprising insight early, not as a "big reveal" at the end

### Community Post Strategy

Community posts maintain engagement between uploads:

- **Poll posts:** Ask binary or multiple-choice questions related to upcoming content
- **Text posts:** Share behind-the-scenes insights or early data from recent videos
- **Image posts:** Share screenshots, charts, or visual teasers for upcoming content
- Post 2-3 times per week between uploads to maintain algorithmic presence

---

## Discipline Gates

### DISC-YOUTUBE-01: Hook Strength -- Tier 1

**Checks:** First 5 seconds of video script contain a specific promise, question, or pattern interrupt
**Against:** Video script opening section

#### Evaluation Criteria

1. **Hook presence and quality**
   - PASS: Script opens with a concrete hook (problem statement, bold claim, or curiosity gap) within the first 3 sentences. The hook is audience-focused and specific.
   - WARN: Script has an opening but it is generic or brand-focused rather than audience-focused (e.g., "Today we're going to talk about...")
   - FAIL: Script opens with an introduction, greeting, or sponsor mention before the hook

2. **Hook specificity**
   - PASS: Hook contains a specific number, result, or named concept ("3 mistakes," "doubled our revenue," "the LinkedIn algorithm change")
   - WARN: Hook references a general topic without a specific angle ("Let's talk about marketing")
   - FAIL: No identifiable hook in the first 5 lines of the script

### DISC-YOUTUBE-02: Title-Thumbnail Click-Fit -- Tier 1

**Checks:** Title and thumbnail brief work as a complementary pair (title promises, thumbnail visualizes)
**Against:** Video title and thumbnail brief in the asset

#### Evaluation Criteria

1. **Complementary messaging**
   - PASS: Title contains a specific promise or curiosity gap AND thumbnail brief describes a contrasting visual element that amplifies (not duplicates) the title
   - WARN: Title and thumbnail overlap in message (both say the same thing in words and visuals)
   - FAIL: Title is generic or clickbait with no matching thumbnail concept, OR thumbnail brief is missing

2. **Curiosity loop**
   - PASS: Together, title and thumbnail create an information gap that requires clicking to resolve
   - WARN: Title and thumbnail are on-topic but do not create tension or curiosity
   - FAIL: Title and thumbnail are unrelated or contradictory

### DISC-YOUTUBE-03: Description SEO -- Tier 2

**Checks:** Description includes target keyword in first 2 lines, timestamps, and relevant links
**Against:** Video description content

#### Evaluation Criteria

1. **Keyword placement**
   - PASS: Target keyword appears in the first 150 characters of the description
   - WARN: Keyword present in the description but not in the first 150 characters
   - FAIL: No target keyword in the description, or description is under 100 characters

2. **Structural completeness**
   - PASS: Timestamps present for videos 10+ minutes, at least 2 links included, 3+ hashtags at the end
   - WARN: Timestamps missing for long-form content, OR fewer than 2 links
   - FAIL: No timestamps, no links, and no hashtags -- description is just a single sentence

### DISC-YOUTUBE-04: Retention Structure -- Tier 2

**Checks:** Script front-loads value and avoids retention killers
**Against:** Video script structure and pacing

#### Evaluation Criteria

1. **Value delivery timing**
   - PASS: Key value proposition delivered within the first 30% of the script, with pattern interrupts every 2-3 minutes
   - WARN: Value delivered but after a long preamble (more than 20% of script before any substantive content)
   - FAIL: Script buries the main point past the halfway mark or has no structural variety

2. **Retention techniques**
   - PASS: Script uses open loops, sub-topic transitions, or visual change notes to maintain engagement throughout
   - WARN: Script is linear with no pacing variation but content is solid
   - FAIL: Script is a single unbroken monologue with no engagement hooks after the opening

### DISC-YOUTUBE-05: End-Screen CTA -- Tier 2

**Checks:** Script includes a clear end-screen call-to-action
**Against:** Final section of the video script

#### Evaluation Criteria

1. **CTA presence and specificity**
   - PASS: Final section includes a specific CTA (subscribe, watch next video, click link) with verbal direction and visual placement notes for end-screen elements
   - WARN: CTA exists but is generic ("like and subscribe") with no specific next action or visual placement
   - FAIL: No end-screen CTA in the script

### DISC-YOUTUBE-06: Thumbnail Contrast -- Tier 2

**Checks:** Thumbnail brief specifies high-contrast, low-clutter visual design
**Against:** Thumbnail brief content

#### Evaluation Criteria

1. **Visual clarity**
   - PASS: Thumbnail brief specifies max 3 elements, contrasting colors, readable text at mobile size, and face/emotion if applicable
   - WARN: Thumbnail brief exists but includes more than 3 text elements or lacks contrast specification
   - FAIL: No thumbnail brief provided, or brief describes a busy/cluttered design with 5+ elements

2. **Mobile readability**
   - PASS: Any text in the thumbnail is specified as large, bold, and limited to 3-4 words maximum
   - WARN: Text is included but no size or readability specification
   - FAIL: Thumbnail relies on small text or detailed graphics that would be illegible at mobile thumbnail size

---

## Base Gate Overrides

| Base Gate ID | Default Tier | Override Tier | Reason |
|-------------|-------------|---------------|--------|
| GATE-10 (Format Correctness) | Tier 2 | Tier 1 | Video scripts have strict format requirements (timestamps, shot notes, scene markers) that directly affect production workflow and cannot be fixed post-recording |

---

## Format Rules

### Video Script Format

```
[HOOK - 0:00-0:05]
{Opening hook -- problem, claim, or curiosity gap}

[INTRO - 0:05-0:30]
{Brief context setting -- who this is for, what they will learn}

[SECTION 1 - 0:30-3:00]
{Main content section}
[B-ROLL: {description of supporting visual}]
[LOWER THIRD: {text overlay content}]

[PATTERN INTERRUPT - 3:00]
{Re-engagement moment -- question, visual change, new angle}

[SECTION 2 - 3:00-6:00]
{Continued content}

[END SCREEN - final 20 seconds]
{Verbal CTA + visual placement notes}
[END CARD: {specific video/playlist to link}]
```

### Thumbnail Brief Format

```
Elements (max 3):
1. {Primary element -- face, object, or result}
2. {Text overlay -- 3-4 words max, bold}
3. {Background/contrast element}

Colors: {Primary contrast pair, e.g., "Yellow text on dark blue background"}
Emotion: {If face is included -- shocked, excited, skeptical, etc.}
Mobile test: {Confirm readability at 168x94px}
```

### Description Template

```
{Target keyword in the first line -- what this video covers}
{Second line -- specific promise or key takeaway}

{Timestamps / Chapters}
0:00 - {Hook}
0:30 - {Section 1 title}
3:00 - {Section 2 title}
...

{Resources / Links}
- {Resource 1}: {URL}
- {Resource 2}: {URL}

{About section -- 2-3 sentences about the channel}

#hashtag1 #hashtag2 #hashtag3
```

### Community Post Format

- **Poll:** Question (under 65 characters) + 2-4 options (under 25 characters each)
- **Text:** 1-3 paragraphs, conversational tone, end with a question to drive comments
- **Image:** High-contrast image with minimal text, paired with 1-2 sentence caption

---

## Examples

### Good: Strong Hook + Complementary Title-Thumbnail

```
Title: "I Analyzed 1,000 YouTube Thumbnails -- Here's What Actually Works"

Thumbnail brief:
- Element 1: Creator's face with surprised expression
- Element 2: Bold text "1,000 THUMBNAILS" in yellow
- Element 3: Dark background with faded grid of thumbnail images
- Colors: Yellow text on dark charcoal
- Mobile test: Face and text readable at 168x94px

Script opening:
"The average YouTube thumbnail gets mass-ignored. Out of 1,000 thumbnails
I analyzed across 50 channels, only 12% followed the pattern that
correlates with above-average CTR. Here's what they all had in common."
```

Why it works: Title promises data-driven insight. Thumbnail shows the scale (face + "1,000") without repeating the title. Hook delivers a specific stat immediately.

### Bad: Weak Hook + Redundant Title-Thumbnail

```
Title: "YouTube Thumbnail Tips"

Thumbnail brief:
- Element 1: Text "Thumbnail Tips"
- Element 2: Stock photo of a computer screen
- Element 3: Channel logo
- Element 4: Subscribe button graphic
- Element 5: Arrow pointing at screen

Script opening:
"Hey guys, welcome back to the channel! Today we're going to be talking
about thumbnails. Before we get into it, a quick word from our sponsor..."
```

Why it fails: Title is generic (no promise, no number, no curiosity). Thumbnail repeats the title text and has 5 elements (cluttered). Script opens with greeting + sponsor before any hook.

---

## Anti-Patterns

1. **Opening with "Hey guys"** -- Greetings before the hook lose viewers in the first 3 seconds. YouTube's retention graph shows the steepest drop in the first 5 seconds. The hook must come first.

2. **Burying the hook after a sponsor read** -- Sponsor integrations in the first 30 seconds kill retention. Place sponsor reads after the hook and initial value delivery (typically 2-4 minutes in).

3. **Thumbnail text duplicating the title** -- If the thumbnail says the same words as the title, you have wasted one of your two click-driving elements. The thumbnail should SHOW what the title TELLS.

4. **Description with no keywords or links** -- A one-sentence description like "New video!" wastes SEO opportunity. YouTube indexes description text for search -- treat it as a mini blog post.

5. **Scripts without retention markers** -- A script that reads as a continuous essay without scene breaks, B-roll notes, or pattern interrupts will produce a monotonous video. Mark structural variety explicitly.

6. **Generic end-screen CTA** -- "Like and subscribe" is background noise. Specific CTAs ("Watch this video next where I show the exact template") drive measurable end-screen click rates.

7. **Cluttered thumbnails** -- More than 3 visual elements compete for attention at mobile size. Thumbnails must be readable at 168x94 pixels -- the size they appear in mobile feeds.

---

## Metrics

Track these indicators for YouTube content after shipping:

- **Views** -- Total views over 7/30/90 day windows. Compare against channel average.
- **Watch time (hours)** -- Total accumulated watch time. YouTube's primary ranking signal.
- **Average view duration** -- Mean watch time per view. Indicates content quality and retention. Target: above 50% of video length.
- **Click-through rate (CTR)** -- Impressions to views ratio from YouTube Studio. Measures title + thumbnail effectiveness. Channel benchmark: 4-10%.
- **Subscriber conversion** -- New subscribers attributed to the video. Measures audience growth impact.
- **End-screen click rate** -- Percentage of viewers who click end-screen elements. Measures CTA effectiveness.
- **Comments and engagement rate** -- Comments, likes, shares as a percentage of views. Measures community engagement.
- **Traffic sources** -- Breakdown of Browse, Search, Suggested, External. Indicates discovery path.
