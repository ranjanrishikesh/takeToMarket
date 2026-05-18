---
discipline: youtube
asset_types: [long-form-video, short, tutorial, demo]
version: "2.0"
---

# YouTube Discipline Playbook

This playbook extends the base playbook contract (`base.md`) with YouTube-specific production guidance, discipline gates, and format rules. It is loaded by ttm-producer during content generation and parsed by ttm-verify for gate evaluation.

The framework is **The MrBeast Production Memo** — Hook → Crazy Progression → Re-engagement → Payoff — applied at engineer-solopreneur scale. You're not filming "I gave away a Lamborghini." You're filming a 5-15 minute demo, tutorial, or explainer. Same memo. Smaller budget. The principles are identical because the retention graph is identical: a viewer leaving at 0:42 doesn't care that your video cost $200 instead of $200,000.

See `references/playbook-leaders.md` for source research.

---

## Production Guidance

### The Viewer Is The Only Stakeholder

Before any other rule: the viewer is the only stakeholder that matters. Not your co-founder. Not your sponsor. Not your editor. Not your brand. If something on screen isn't earning the viewer's attention right now, it gets cut. Every other principle in this playbook is downstream of that one.

The retention graph is your only honest feedback loop. Views can be juiced. Likes can be polite. The retention graph cannot lie — it tells you exactly which second a human being decided you weren't worth their next breath.

### The Thumbnail-Title Pair Is 80% Of The Upload

A great video with a bad thumbnail dies in the impressions feed and never gets a chance. A mediocre video with a great thumbnail-title pair gets clicked, gets watched a bit, gets recommended, and lives. **Spend more time on the thumbnail-title pair than on editing.** Solopreneurs routinely invert this — they polish the cut for hours and slap on a thumbnail at midnight. Wrong order.

The thumbnail and title are a **single creative unit**:

- The **title** makes a specific, falsifiable promise. ("I rebuilt Stripe Checkout in 90 minutes.") No "Today we'll talk about…" No category labels.
- The **thumbnail** shows the **payoff state, the contrast, or the emotion** — never the words from the title. If the title says "90 minutes," the thumbnail shows the finished thing, not the words "90 MINUTES."
- Together they create a **curiosity gap** the viewer can only close by clicking. Curiosity-gap titles (specific number + surprising claim) outperform value-prop titles for cold traffic. Value-prop titles ("How to set up Postgres on Railway") work for warm/intent traffic via search. Pick deliberately.
- **Test the thumbnail at 90 pixels wide.** That's roughly the size it shows up in the mobile sidebar. If you can't read it on a phone, it doesn't exist.

### The First 30 Seconds Is The Entire Video

If retention drops in the first 30-60 seconds, the upload is dead — YouTube stops surfacing it and you've spent two weekends for 80 views. Treat 0:00–0:30 like it's the only thing you'll ever ship.

Three mandatory moves in the hook zone:

1. **Match the clickbait expectation in the first 5 seconds.** Whatever the title promised, deliver visible proof you're going to deliver it. Title says "rebuilt Stripe Checkout in 90 minutes"? Show the working clone in frame at 0:04.
2. **State the stakes by 0:15.** Why does this matter to the viewer who clicked? "If you ship this wrong, you'll lose 40% of conversions" — that's stakes. "Hey everyone, welcome back to the channel" — that's a goodbye.
3. **Tease the payoff by 0:30.** Show a glimpse of where the video lands. The viewer is deciding right now if you're worth the next 5 minutes. Give them a reason that's specific to *this* video, not your channel.

**Things that are banned in the first 30 seconds:** the words "Hey guys," channel intros, sponsor reads, animated logo idents, "before we get started," asking for the subscribe before delivering any value, explaining who you are.

### Crazy Progression — Skip The Slow Build

In the MrBeast memo: if the video is "I survived 7 days alone in the wilderness," cover days 1 through 4 in the first 2 minutes. Don't make the viewer earn the payoff with patience — they will leave.

At engineer-solopreneur scale, the same rule:

- If the video is "I deployed 10 side projects in a weekend," show projects 1, 2, and 3 inside the first 2 minutes — not the IDE setup.
- If it's a Postgres tutorial, the working query is on screen by minute 2, with the explanation interleaved — not after a 4-minute lecture on relational theory.
- If it's a product demo, the wow-moment that justified the title shows up in the first third, then you earn the rest by going deeper.

**Front-load the value. Backfill the context.** Most engineers do the opposite because that's how documentation is structured. YouTube is not documentation. The viewer can leave at any second and they will.

### Re-engagement Spike Every 30-60 Seconds (Minutes 3-6)

Drop-off is **non-linear**. People don't leave at random — they leave at specific moments where nothing changed for too long. Defend against that by changing *something* every 30-60 seconds in the body of the video:

- **Scene cut** (different angle, different room, different shot).
- **New visual element** (chart, screen recording, text overlay, on-screen drawing).
- **New stake** ("but here's where it broke…").
- **Surprise** (an unexpected result, a counterintuitive number, a meme that lands).
- **Pace shift** (fast cut → slower beat to let something breathe → fast again).

You don't need a budget for any of this. A B-roll cut to your terminal output **is** a scene change. A whiteboard sketch **is** a visual. The bar isn't production value — it's *change*.

### No Dull Moments. Editors Have Permission To Cut.

If a section isn't earning its time, cut it. Out loud, write this rule on the wall of your edit bay (or your one-monitor desk): **anything that isn't earning attention is killing retention.** A 30-second tangent on your dev setup in the middle of a deployment tutorial doesn't make the video richer — it makes the next viewer leave at 4:12.

If you're editing yourself, you have to gain emotional distance from your own footage. The 90-second story about why you picked this stack is not as interesting as you remember it being while you filmed it. Cut.

### Payoff That Exceeds The Promise

The promise lives in the thumbnail-title pair. The payoff is what lands in the last 30-60% of the video. **The payoff must exceed the promise** — otherwise the viewer leaves with the right to feel scammed, and they will not come back for the next upload.

If the title promised "I rebuilt Stripe Checkout in 90 minutes," the payoff isn't "here's the code." The payoff is the live checkout flow processing a real test card on screen, with the timer showing 89:42, plus the link to the repo. Tangible. Visible. Better than the viewer expected. That's the upload that gets shared.

The retention graph will spike at the payoff zone if it lands. If your payoff zone retention is flat or declining, the payoff didn't land — even if you "delivered" what you promised.

### Abrupt Ending Beats Polished Outro

End sharp. The moment the payoff lands, you're 10-30 seconds away from outro. A long "thanks for watching, smash that like, here's three videos I recommend, here's my Patreon, here's…" causes retention to nosedive in the final minute. That nosedive **hurts the next video's recommendation**, because YouTube reads it as "viewers didn't want to keep watching this creator."

End-screen rules:

- Payoff lands → 1 sentence of context → 1 specific next-video CTA → cut.
- The end-screen visual element appears in the last 20 seconds, never blocking the payoff frame.
- "Watch this video next where I do [specific thing]" beats "subscribe for more" every time.

### Click-Rate Vs Average-View-Duration: The Tradeoff

This is the lever solopreneurs miss. Both metrics matter, but optimizing only one breaks the upload:

- **Maximize click-rate alone** → curiosity-gap or sensational titles that overpromise → viewers click, the body doesn't deliver → AVD collapses → YouTube stops recommending. This is what "clickbait" actually means in algorithmic terms: a CTR–AVD mismatch.
- **Maximize AVD alone** → safe, on-the-tin titles ("How to configure Postgres") → AVD is high among the small audience that clicks → CTR is low → impressions never grow.

The MrBeast-grade upload is **high CTR AND high AVD**: an interesting title-thumbnail pair that the body then *over*-delivers on. When the body exceeds the click-promise, AVD climbs and YouTube reads it as a quality signal and gives you more impressions, which gives you more clicks at the same CTR, which compounds. That's the loop. Optimize the pair, then optimize the body, then check the retention graph against both.

### A-Team / B-Team / C-Team — Resource-Rank Your Uploads

You don't have unlimited weekends. Rank your video ideas by expected payoff and budget effort accordingly:

- **A-team uploads (1-2 per quarter):** Your swing-for-the-fence ideas. The "I built a startup in 30 days" piece. Treat thumbnail like a Super Bowl ad. Spend 2-3x normal effort.
- **B-team uploads (1-2 per month):** Consistent, on-thesis content. Solid tutorials, breakdowns, build-logs. Standard effort.
- **C-team uploads (weekly/short-form):** Experiments. Shorts. Quick takes. Permission to fail. Low effort, high frequency, used as research for what resonates → graduate winners to B-team or A-team format.

Don't treat every upload as A-team. You'll burn out and you'll under-invest in the swings that actually move the channel.

---

## Discipline Gates

### DISC-YOUTUBE-01: Thumbnail-Title Pair Click-Fit -- Tier 1

**Checks:** Thumbnail and title work as a complementary pair, are readable at 90px wide, and create a curiosity gap.
**Against:** Asset's title field and thumbnail brief.

#### Evaluation Criteria

1. **Complementary, not redundant**
   - PASS: Title contains a specific number/claim/promise AND the thumbnail brief describes a visual that shows the *result, contrast, or emotion* — not the title text repeated.
   - WARN: Title and thumbnail are on-topic but overlap in message (e.g., title says "10 mistakes," thumbnail prominently reads "10 MISTAKES").
   - FAIL: Title is generic ("YouTube Tips"), or thumbnail brief is missing, or thumbnail is unrelated/contradictory to the title.

2. **Readable at 90 pixels wide**
   - PASS: Thumbnail brief specifies max 3 elements, high-contrast color pair, and any text is limited to 3-4 words at large/bold size. Mobile-readability is explicitly noted.
   - WARN: Brief is present but does not specify text size or contrast; or has 4 elements.
   - FAIL: Brief describes a busy/cluttered design (5+ elements) or relies on small text that cannot be parsed at thumbnail scale.

### DISC-YOUTUBE-02: Hook Delivered In First 15 Seconds -- Tier 1

**Checks:** First 15 seconds of the script match the clickbait expectation, state stakes, and tease the payoff. No greetings, no sponsor reads.
**Against:** Script opening, lines covering 0:00–0:15.

#### Evaluation Criteria

1. **Match-the-promise hook**
   - PASS: Script opens with concrete proof that the title's promise is real (a visible artifact, a specific number, a falsifiable claim) within the first 3 sentences / 5 seconds.
   - WARN: Hook is on-topic but generic ("Let's talk about…", "In this video I'll show you…") — no specific promise visible in the first 5 seconds.
   - FAIL: Script opens with a greeting ("Hey guys"), channel intro, animated ident, or sponsor read before any hook content.

2. **Stakes stated by 0:15**
   - PASS: Within the first 15 seconds the script names *why this matters to the viewer who clicked* — a cost, a benefit, a risk, or a payoff stake.
   - WARN: Stakes are implied but not explicit.
   - FAIL: No stake established in the first 30 seconds; the opening is purely descriptive ("This is a tutorial about X").

### DISC-YOUTUBE-03: Crazy Progression In Minutes 1-3 -- Tier 1

**Checks:** The script front-loads value and shows visible progression early, rather than building slowly to a payoff.
**Against:** Script structure across the 0:00–3:00 section.

#### Evaluation Criteria

1. **Value visible by minute 2**
   - PASS: A tangible value moment (working demo, specific result, key insight, on-screen artifact) appears within the first 2 minutes of the script, not just setup/context.
   - WARN: Value appears between minutes 2 and 3, OR the first 2 minutes are heavy on context with a single short value teaser.
   - FAIL: First 3 minutes are setup, intro, "who I am," tool setup, or backstory — no value moment in sight.

2. **Re-engagement cadence in minutes 3-6**
   - PASS: Script includes explicit re-engagement beats (scene cuts, new stakes, surprises, visual changes) at intervals of 30-60 seconds across minutes 3-6.
   - WARN: Some re-engagement is present but gaps exceed 90 seconds in places.
   - FAIL: Script reads as a continuous monologue with no marked scene changes, visual cues, or pace shifts.

### DISC-YOUTUBE-04: Payoff Present In Last 30% -- Tier 1

**Checks:** The video has an identifiable payoff zone in the final third that delivers (and ideally exceeds) the title's promise.
**Against:** Script section covering the final ~30% of runtime.

#### Evaluation Criteria

1. **Payoff zone exists**
   - PASS: Script contains an explicit payoff moment in the final 30% of runtime that visibly delivers the title-thumbnail promise (working result, summarized number, named conclusion).
   - WARN: A payoff is implied but not staged as a distinct moment — it's diffused across the second half rather than landing.
   - FAIL: Video ends without delivering on the title's promise, OR the "payoff" is just "subscribe / check the description."

2. **Payoff exceeds promise**
   - PASS: The payoff includes an extra element the title did not pre-commit to — a bonus insight, a deeper number, a follow-up artifact, a "and one more thing" — that rewards the viewer for finishing.
   - WARN: Payoff exactly meets the title's promise with no extra.
   - FAIL: Payoff underdelivers vs the title (title overpromised), creating a CTR–AVD mismatch risk.

### DISC-YOUTUBE-05: Abrupt End-Screen, No Slow Outro -- Tier 2

**Checks:** The video ends sharply after the payoff with a specific next-video CTA, not a long outro sequence.
**Against:** Final 30 seconds of the script.

#### Evaluation Criteria

1. **Sharp ending**
   - PASS: Within 30 seconds of the payoff landing, the script wraps with one specific CTA pointing to a named next video / playlist / link. End-screen elements appear in the last 20 seconds without blocking the payoff frame.
   - WARN: Outro is present but generic ("like and subscribe for more videos like this") with no specific next destination.
   - FAIL: Outro exceeds 60 seconds, includes multiple sponsor reads/CTAs/Patreon plugs, or buries the CTA behind unrelated content.

### DISC-YOUTUBE-06: Description SEO + Chapters -- Tier 2

**Checks:** Description supports discovery: target query in the first 150 characters, chapters/timestamps for long-form, 2+ relevant links, hashtags.
**Against:** Video description content.

#### Evaluation Criteria

1. **Searchable opening**
   - PASS: Target search query / keyword appears in the first 150 characters; description is 200+ words; chapters/timestamps included for videos 10+ minutes.
   - WARN: Keyword present but not in the first 150 characters, OR description is 100-200 words, OR timestamps missing for a 10+ min video.
   - FAIL: One-line description with no keyword, no links, no timestamps.

2. **Structural completeness**
   - PASS: At least 2 relevant links + 3 hashtags at the end.
   - WARN: 1 link OR fewer than 3 hashtags.
   - FAIL: No links and no hashtags.

---

## Base Gate Overrides

| Base Gate ID | Default Tier | Override Tier | Reason |
|-------------|-------------|---------------|--------|
| GATE-10 (Format Correctness) | Tier 2 | Tier 1 | Video scripts have strict timestamp + shot-note format requirements that drive the actual shoot/edit. Format errors caught post-record force a reshoot — they cannot be patched the way text-asset format issues can. |

---

## Format Rules

### Long-Form Video Script (5-15 min)

```
[THUMBNAIL-TITLE PAIR]
Title: {Specific promise, ≤60 chars, ideally ≤50 for mobile}
Thumbnail: {3 elements max, contrast pair, mobile-readable at 90px}

[0:00-0:05 — HOOK / MATCH-THE-PROMISE]
{Visible proof the title is real — specific artifact, number, claim}

[0:05-0:15 — STAKES + PAYOFF TEASE]
{Why the viewer should care + glimpse of where this lands}

[0:15-2:00 — CRAZY PROGRESSION]
{Cover the "obvious" first 30% of the journey in fast cuts. Skip setup.}
[VISUAL: {scene/B-roll/screencap}]

[2:00-{midpoint} — BODY, RE-ENGAGEMENT EVERY 30-60s]
{Each beat ends with a scene cut, new stake, or visual change}
[BEAT 1 — VISUAL CUE: {what changes}]
[BEAT 2 — STAKE: {new tension}]
[BEAT 3 — SURPRISE: {unexpected result}]

[{Last 30%} — PAYOFF ZONE]
{Deliver the title's promise on screen, then exceed it with one bonus}

[FINAL 0:30 — SHARP END + END-SCREEN CTA]
{One sentence wrap → one named next-video CTA → cut}
[END-SCREEN ELEMENT: {appears last 20s, off the payoff frame}]
```

### YouTube Short (≤60 sec) Script

```
[0:00-0:02 — PATTERN INTERRUPT HOOK]
{Visual or claim that stops the scroll}

[0:02-0:50 — SINGLE-IDEA PAYOFF]
{One idea, delivered. No setup, no intro. Pure crazy-progression.}

[0:50-0:60 — LOOPABLE END or CTA]
{Either loop the hook (vertical retention trick) or one CTA}
```

### Thumbnail Brief

```
Elements (max 3):
1. {Subject — face/object/result, taking ~50% of frame}
2. {Text overlay — 3-4 words MAX, bold, sans-serif, 100px+ at full size}
3. {Contrast background element}

Color pair: {High-contrast pair, e.g., yellow #FFD600 on charcoal #1A1A1A}
Emotion (if face): {one word — shocked, focused, skeptical}
90px test: {Confirmed readable at 90 pixels wide (mobile sidebar size)}
A/B variant: {Optional — alternate frame/text for thumbnail testing}
```

### Description Template

```
{Target search query in line 1 — what this video covers, ≤150 chars}
{Line 2: specific takeaway / promise}

⏱ Chapters
0:00 - Hook
0:30 - {Crazy progression starts}
3:00 - {Section 2}
{...continue for all major beats}

🔗 Links mentioned
- {Resource 1}: {URL}
- {Resource 2}: {URL}

📺 Watch next: {specific video URL}

{2-3 line channel about — who this is for, what the channel covers}

#hashtag1 #hashtag2 #hashtag3
```

---

## Examples

### Good: Thumbnail-Title Pair + Hook + Payoff Land Together

```
Title: "I Rebuilt Stripe Checkout in 90 Minutes"

Thumbnail brief:
- Element 1: Split screen — official Stripe checkout (left), creator's clone (right), both showing the same charge
- Element 2: Bold yellow text "90 MIN" overlaid bottom-right
- Element 3: Dark charcoal background, subtle grid
- Color pair: Yellow #FFD600 on charcoal #1A1A1A
- Emotion: n/a (no face)
- 90px test: "90 MIN" + split layout both legible at sidebar size

Script opening (0:00-0:15):
"Here's Stripe's checkout. Here's mine. Same test card, same flow,
both work. Stripe charges 2.9% plus 30 cents. Mine was built in 90 minutes
on Hono and Postgres — and if you ship payments wrong, you're either
leaking money or leaking customers. By the end of this, you'll have
every line of code I used."

Crazy progression (0:15-2:00):
Skips IDE setup, skips Hono install, skips Postgres schema lecture.
At 0:42 the database is already up. At 1:15 the first charge is on screen.
At 1:50 a real test card has cleared. THEN the explanation rewinds and
fills in the why.

Payoff zone (final 30%):
The clone processes a $20 test charge live on screen. Timer reads 89:42.
Bonus: a webhook fires to Slack, which the title didn't promise but
the viewer didn't see coming.

End (final 30 sec):
"Repo's linked below. Next, watch me actually deploy this thing to
production without breaking anything — link's on screen." Cut.
```

Why it works: thumbnail-title pair creates a curiosity gap (is the clone actually any good?), hook proves the promise visually in 5 seconds, the first 2 minutes skip the boring middle, the payoff exceeds the promise with the unannounced webhook, and the outro is one sentence. CTR–AVD will both clear.

### Bad: Slow Open, No Progression, No Payoff

```
Title: "Building a Payments App"

Thumbnail brief:
- Element 1: Stock photo of a credit card
- Element 2: Channel logo bottom-right
- Element 3: Subscribe button graphic
- Element 4: Text "Building a Payments App" — same words as title
- Element 5: Arrow pointing at the credit card

Script opening:
"Hey guys, welcome back to the channel! If you're new here, my name is
[name] and on this channel we talk about software development. Today
we're going to be building a payments application. But before we get
into it, a quick word from this video's sponsor..."

Body:
Minutes 1-4 walk through installing Node, setting up the dev environment,
explaining REST. The actual payment flow shows up at 7:30.

Ending:
"So yeah, that's pretty much it. Make sure to like and subscribe,
hit the bell icon, check out my Patreon, here are three other videos
I recommend, and shoutout to today's sponsor again..."
```

Why it fails: title is generic with no falsifiable promise → low CTR; thumbnail has 5 elements and repeats the title text → unreadable at 90px; opening is greeting + sponsor → retention dies before 0:30; no crazy progression (4 minutes on env setup); no payoff zone; outro is 90 seconds of CTAs → next-video recommendation tanks.

---

## Anti-Patterns

1. **"Hey guys, welcome back to the channel."** The single most retention-destructive sentence on the platform. The viewer clicked because of the title-thumbnail pair, not because of you. Deliver on what they clicked for. Greet them with proof.

2. **Sponsor reads in the first 60 seconds.** Sponsor integrations belong after the hook lands and the body is rolling — minutes 2-4 for short videos, minutes 3-6 for longer. A sponsor at 0:15 trades retention for $40 and kills the upload's reach for $4,000.

3. **Title-thumbnail mismatch (the actual definition of clickbait).** Title overpromises, body doesn't deliver, retention craters in minutes 1-2, YouTube reads "viewers regretted clicking," your impressions die. The pair must promise something the body actually delivers. Aspirational ≠ deceptive.

4. **Thumbnail text duplicating title text.** You have two click-driving surfaces. If both say the same words, you've wasted one. The thumbnail SHOWS, the title TELLS. Burn this into your eyes.

5. **The slow build.** Most engineers structure videos like documentation: setup → theory → implementation → result. That's the wrong order for YouTube. Show the result first, then earn back the context. Crazy progression beats clean pedagogy on the retention graph every time.

6. **Long polished outros.** The 30-60 seconds after the payoff is where retention falls off a cliff and takes your next-video recommendation with it. Land payoff → one CTA → cut. Anything else is vanity.

7. **Treating every video as A-team.** You'll burn out by upload #6. Rank ideas. Spend 2-3x effort on the 1-2 swings per quarter that could break out. Ship the rest as B-team consistency. Use Shorts as C-team experiments.

8. **Optimizing CTR or AVD alone.** Both or neither. Curiosity-gap titles + on-the-tin bodies = unsustainable. Safe titles + great bodies = invisible. The goal is high-CTR title that the body *exceeds* — that's where the compounding loop opens.

9. **No re-engagement after minute 3.** A script with no scene cuts, new stakes, or visual changes from minute 3 onward will have a smooth downward retention slope, no spikes, no recoveries. Non-linear drop-off is the enemy — break the line.

10. **Saving the best for the end.** "Stick around to the end and I'll show you the surprise" only works if the first 90% earns the wait. At engineer-solopreneur scale, very few uploads earn that. Front-load the best stuff; backfill the rest.

---

## Metrics

Track these post-ship — the retention graph is the only honest one, the rest are inputs to it:

- **Average view duration (AVD) and AVD %** — Mean watch time per view, absolute and as a percentage of video length. The single most important quality signal. Target: ≥50% on long-form, ≥70% on Shorts.
- **Retention graph shape** — Not just AVD: look at the actual curve. Where's the steepest drop? (Usually the hook.) Is there a spike at the payoff zone? (If yes, payoff landed.) Is there a cliff at the outro? (Shorten it.)
- **Payoff-zone retention spike** — The retention curve should *spike or hold* in the final 30%. A flat or declining payoff zone means the payoff didn't land — even if you delivered what the title promised.
- **Click-through rate (CTR)** — Impressions → clicks ratio from YouTube Studio. Measures the thumbnail-title pair. Benchmark: 4-10% on most channels; under 4% means the pair is failing.
- **CTR × AVD composite (the real signal)** — High CTR with low AVD = clickbait, will be punished. Low CTR with high AVD = invisible, no impressions to convert. The compounding loop opens when both are high.
- **Watch time (hours)** — Total cumulative watch time. YouTube's primary ranking signal for surfacing the video.
- **Suggested-video click-through** — How often this video drives clicks to *the next video* via end-screen and sidebar. Measures whether your sharp ending + specific CTA is working.
- **First-30-seconds retention** — Specifically the retention number at 0:30. If you're losing >30% of viewers in the first 30 seconds, the hook (or the thumbnail-title match) is broken. Fix this before fixing anything else.
- **Subscribers gained per 1000 views** — Did the upload convert browsing viewers into subscribers? Strong indicator that the payoff exceeded the promise.
- **Traffic sources** — Browse / Search / Suggested / External breakdown. A-team uploads should be Browse + Suggested heavy. B-team tutorials should be Search heavy. Mismatch tells you which surface to optimize.

---

## Sources

- [The MrBeast Production Memo (leaked, Shaan Puri breakdown)](https://www.shaanpuri.com/essays/mrbeast-leaked-memo) — primary source for the Hook → Crazy Progression → Re-engagement → Payoff framework, the "first minute is the entire video" rule, and the thumbnail-title prioritization.
- [Alexander Jarvis — How to Succeed in MrBeast Production](https://www.alexanderjarvis.com/memo-how-to-succeed-in-mrbeast-production/) — detailed breakdown of the "no dull moments" rule, A-team/B-team/C-team resource-ranking, and the editor's permission to cut.
- [Sherwood News — MrBeast's Leaked Internal Success Document](https://sherwood.news/culture/mrbeast-youtube-leaked-internal-success-document/) — news coverage of the original 36-page memo with quoted excerpts on retention math and the "viewer is the only stakeholder" north star.
- [Creator Science (Jay Clouse) — runner-up reference for creator-business monetization layer](https://creatorscience.com/) — used for context on how engineer-solopreneurs translate audience into revenue once the production memo is working.
- [Awesome Creator (Roberto Blake) — runner-up reference for personal-brand professionalization](https://robertoblake.com/) — used for context on personal-brand layer above the production framework.
