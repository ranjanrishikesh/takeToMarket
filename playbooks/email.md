---
discipline: email
asset_types: [welcome-series, broadcast, lifecycle-email]
version: "2.0"
---

# Email Playbook

> **Framework: The Dinner Party Strategy — Val Geisler (Fix My Churn).** Every email is a course of a dinner party. You are the host. The reader is a guest who walked into your home. You do not greet a guest by handing them a logo, a discount code, and three buttons. You say hello, you pour them a drink, you ask how they are, and only much later — once they are full and comfortable — do you ask if they would like to see the renovation you did upstairs. Email is not a broadcast channel. Email is a dinner conversation that happens at scale.

## Production Guidance

If a reader read your email aloud at a real dinner table, would the table laugh, lean in, or push their plate away? That is the entire production target. Every rule below exists to keep your email in the first two categories.

### The Dinner Party metaphor (the spine)

Five course types. Every email in a lifecycle program is one of these — and the order matters.

1. **Welcome (the host moment).** They just walked in. Hang their coat. Tell them where the bathroom is. Tell them what's for dinner. Then stop talking and let them settle. The welcome email sets every expectation that follows. Pitching here is the equivalent of greeting a guest with a sales contract on the doormat.
2. **Appetizers (low-pressure value).** Short, useful, no ask. You're feeding them something small and good so they trust the kitchen before the main course arrives. One idea per email. No CTA-stuffing.
3. **Main course (the product talk).** You earned it. Now you can be direct about features, demos, expansion, pricing. The main course is allowed to be substantial — but only because you fed them appetizers first.
4. **Sides (complementary value).** Adjacent value that makes the main course better — integrations, recipes, use-case stories, customer rituals. Sides keep the main course in context.
5. **Dessert (delight + retention).** Post-purchase. Anniversary. Renewal. A check-in that asks for nothing. Dessert is what makes guests come back. Most B2B SaaS programs never serve it. That's why they have churn problems.

Before you write an email, classify it. *"This is an appetizer."* *"This is dessert."* If you can't name the course, you're not writing an email — you're broadcasting.

### Sender voice — a person, not a brand

The from-line says a human name. "Val from Fix My Churn." "Rishi at takeToMarket." Not "The takeToMarket Team." Not "noreply@". A guest does not get greeted by a logo. A guest gets greeted by *you*. The brand earns its place in the signature, not the sender field.

The body follows the same rule. Write the way you talk to one specific customer you know by name. If you can't picture that customer — go pull a support ticket, a sales-call transcript, an onboarding-chat log, and read it aloud. Their exact phrases are the script. Customer language beats marketing language every single time.

### Plain-text-first aesthetic

A real friend doesn't email you a glossy four-column HTML mailer with a hero image and a CTA button the size of a dinner plate. A real friend writes you a few sentences and signs off. The default rendering target is plain-text-feel — even if the underlying email is HTML, it should look like a person typed it. Heavy-HTML promotional layouts read as marketing-blasts the moment the inbox preview loads. The reader's mental category is set before they click.

This is not anti-design. It is anti-corporate-design. Logos belong at the bottom. Buttons belong below content. The first line of the body is a sentence, not a brand banner.

### Behavior-triggered, not time-triggered

"Day 1, day 3, day 7" is a lazy drip schedule that sends the same sequence to a champion and a no-show. Trigger on what the user did or didn't do: signed up but never invited a teammate; activated feature A but never feature B; opened the last three emails but never replied; downgraded; upgraded. The trigger is the entire reason this email exists. If you cannot name the behavior that triggered the email, you don't have a lifecycle program — you have a calendar.

### One ask per email

A guest can hear one question at a time. Multiple CTAs at equal weight dilute every click. The primary ask is a single button or a single inline link. Secondary asks live as smaller text-link "P.S." moves at the bottom. The primary ask is sometimes "reply to this email" — especially in welcome — because a reply is the highest-trust signal email can produce. An email that asks for a reply and gets one converts at a rate that no button ever will.

### Generosity before pitch

You feed before you sell. In the appetizer course, the value is given freely with no hook. The reader closes the email and thinks "that was useful" — not "they want my credit card." The pitch is what you earn after generosity. Inverting this is the single most common failure of B2B SaaS email programs.

---

## Discipline Gates

### DISC-EMAIL-01: Sender Is A Person -- Tier 1

**Checks:** From-name, from-address, and email opening identify a named human sender, not a corporate brand entity
**Against:** Email asset metadata (from-name, from-address) and the first 200 characters of body content

#### Evaluation Criteria

1. **From-name**
   - PASS: From-name is a human first name (optionally first + last), with the brand attached as a suffix (e.g., "Val from Fix My Churn", "Rishi at takeToMarket")
   - WARN: From-name is the brand alone but the body opens with a clearly named sender in the first paragraph (e.g., "Hey, Val here.")
   - FAIL: From-name is a brand/team string ("The takeToMarket Team", "Marketing", "noreply", "info"), AND the body has no named human sender in the first paragraph

2. **From-address**
   - PASS: From-address uses a personal mailbox at the brand domain (e.g., `val@fixmychurn.com`) and is reply-capable
   - WARN: From-address is a role mailbox (e.g., `hello@`, `team@`) but replies are monitored by a human
   - FAIL: From-address contains `noreply`, `no-reply`, or `donotreply` in any form

### DISC-EMAIL-02: Course Classification Present -- Tier 1

**Checks:** Email asset metadata declares which Dinner Party course this email is (welcome, appetizer, main, side, dessert), and the content matches that course's intent
**Against:** Email asset metadata course tag and body content

#### Evaluation Criteria

1. **Course declared**
   - PASS: Metadata explicitly tags the email as one of {welcome, appetizer, main, side, dessert}
   - WARN: Course can be unambiguously inferred from filename, sequence position, or content but is not explicitly tagged
   - FAIL: Course cannot be determined from metadata or content — the email exists without a place in the meal

2. **Course-content match**
   - PASS: Content matches the declared course's intent (welcome sets expectations and names next step; appetizer gives value with no pitch; main course is direct product talk; side is adjacent value; dessert asks for nothing)
   - WARN: Content mostly matches but contains one mild deviation (e.g., a welcome email with a soft secondary feature mention)
   - FAIL: Course-content mismatch (e.g., a "welcome" email that pitches paid upgrade in the first paragraph; an "appetizer" with a hard CTA above the fold)

### DISC-EMAIL-03: No Pitch In Welcome -- Tier 1

**Checks:** If course is "welcome", the email does not contain a direct product pitch, paid-tier promotion, or sales CTA above the signature
**Against:** Body content of welcome emails only (this gate is skipped for other course types)

#### Evaluation Criteria

1. **Welcome integrity**
   - PASS: Welcome email greets the reader, sets expectations for what's coming, names the next step, and asks for a reply or no action — no paid-tier pitch, no demo booking link, no "upgrade" CTA
   - WARN: Welcome contains a soft mention of a paid feature in the body but the primary CTA is reply-oriented or expectation-setting
   - FAIL: Welcome email's primary CTA is a paid-upgrade button, demo-booking link, or "buy now" action

### DISC-EMAIL-04: Single Ask -- Tier 1

**Checks:** Body contains exactly one primary call to action — one button or one inline link presented at primary visual weight. Secondary asks are permitted only as visually subordinate text links (e.g., P.S. moves)
**Against:** Body content link and button inventory

#### Evaluation Criteria

1. **Primary ask count**
   - PASS: Exactly one primary CTA at full visual weight (button or bold inline link). Any other asks are clearly subordinate (smaller text links, P.S. lines, footer)
   - WARN: One primary CTA plus one secondary that is visually close in weight (e.g., a button and a bold inline link in the same section)
   - FAIL: Two or more competing primary CTAs at equal visual weight, OR the email has no clear primary ask at all

2. **Reply-as-CTA bonus**
   - PASS: If the email is a welcome or appetizer, the primary ask is "reply to this email" or a reply-prompting question — this is the strongest valid CTA for those courses
   - WARN: Welcome/appetizer has a clickable CTA but no reply prompt anywhere
   - FAIL: N/A — informational signal only

### DISC-EMAIL-05: Subject Line Conversation Test -- Tier 1

**Checks:** Subject line sounds like something a human would actually write to another human. Length is short. Hype words, ALL CAPS, and stacked punctuation are absent
**Against:** Subject line text and known marketing-blast patterns

#### Evaluation Criteria

1. **Conversational length**
   - PASS: Subject line is between 3 and 9 words AND under 50 characters (a sentence fragment a friend would type)
   - WARN: Subject is 10-12 words or 50-70 characters — leans broadcast, may truncate on mobile
   - FAIL: Subject is over 12 words, over 70 characters, ALL CAPS, or contains stacked punctuation (`!!`, `??`, `$$`)

2. **Hype-word scan**
   - PASS: No marketing-hype words in subject (no "free", "guarantee", "act now", "limited time", "exclusive offer", "don't miss", "winner")
   - WARN: One borderline word with context that softens it (e.g., "free trial" in a clearly product context)
   - FAIL: Two or more hype words, or any combination of hype + ALL CAPS + stacked punctuation

3. **First-line preview test**
   - PASS: Body's first sentence (the inbox preview slot) is a sentence written to a human — not "View in browser", not a logo alt-text, not a navigation header
   - WARN: First line is generic but readable (e.g., "Hi there,")
   - FAIL: First line is "View in browser", a tracking pixel reference, or a navigation/menu bar

### DISC-EMAIL-06: Compliance Footer -- Tier 1

**Checks:** Legally required elements (unsubscribe link, physical mailing address, accurate sender identification) and deliverability hygiene
**Against:** Footer content and email asset metadata

#### Evaluation Criteria

1. **Unsubscribe**
   - PASS: One-click unsubscribe link present, visible, and functional (one-click is required by Gmail/Yahoo for bulk senders as of Feb 2024)
   - WARN: Unsubscribe present but requires multiple steps or is buried in small text under 8px
   - FAIL: No unsubscribe mechanism in the email

2. **Physical address**
   - PASS: Physical mailing address present (street address, suite, or PO Box). CAN-SPAM requirement
   - WARN: Partial address (city/country only, no street or PO Box)
   - FAIL: No physical address present

3. **DNS authentication (sending domain)**
   - PASS: `dig TXT {domain}` confirms valid SPF (`v=spf1` with ESP include), DKIM (`v=DKIM1; k=rsa; p=...` at the ESP's selector), and DMARC (`p=quarantine` or `p=reject`) records
   - WARN: All three records exist but DMARC is `p=none` (monitoring only, not enforcing)
   - FAIL: Any of SPF, DKIM, or DMARC missing for the sending domain

---

## Base Gate Overrides

| Base Gate ID | Default Tier | Override Tier | Reason |
|-------------|-------------|---------------|--------|
| GATE-07 | Tier 2 (advisory) | Tier 1 (blocking) | Email compliance (CAN-SPAM, GDPR, CASL, Gmail/Yahoo bulk-sender rules) is legally required and directly tied to inbox placement. A compliance miss is not advisory — it harms every future send from the same domain. |

---

## Format Rules

Geisler-style format rules. Each one exists to keep the email feeling like a dinner conversation, not a brochure.

- **From-name:** A human name + brand suffix. Never a team string. Never `noreply`.
- **Subject line:** 3-9 words, under 50 characters. Sentence-fragment voice. No ALL CAPS. No stacked punctuation. No hype words.
- **Preview text:** 40-130 characters, distinct from subject, extends the subject's promise. If left blank the inbox will pull "View in browser" — do not let that happen.
- **First body line:** A sentence written to a person. Not a logo. Not a banner. Not a menu bar.
- **Body length:** Short. A welcome email is 60-150 words. An appetizer is 80-250 words. A main course can be longer but stays under 500 words. Dessert is often the shortest of all — 40-100 words.
- **Layout:** Single column. Plain-text-feel even when HTML. Logo at the bottom, not the top.
- **CTA:** One primary ask. Button or inline link at primary weight. Action-oriented verb ("Reply with your one stuck point", "Watch the 90-second demo", "Pick a time"). Never "Click here." Never "Learn more."
- **Reply path:** From-address accepts replies. A human reads them.
- **Link count:** Under 10 unique URLs. Most appetizers should have 0-2 links total.
- **Image ratio:** Text-dominant. The email must read end-to-end with images off. Every image carries descriptive alt text.
- **Compliance footer:** Unsubscribe + physical address + sender identification. Every email. Every time.

---

## Examples

### Good — Welcome (the host moment)

```
From: Val from Fix My Churn <val@fixmychurn.com>
Subject: you're in — here's what happens next   (6 words, 36 chars)
Preview: A note from me, plus the one thing I'd love for you to do.

Hey {first_name} —

Val here. Real human, currently drinking coffee that's gone cold.

You just joined Fix My Churn. Here is what to expect from me:

- One email every Tuesday. Short. About one churn pattern I see this week.
- Zero pitches in the next three emails. I want to be useful first.
- After that, I'll occasionally mention the Incubator — only when it
  actually fits what you wrote me about.

One ask, and it's not a button:

Hit reply and tell me the single stuck point in your retention right now.
One sentence is plenty. I read every reply myself.

Talk soon,
Val

P.S. If Tuesday isn't your day, you can unsubscribe at the bottom and
I will not be offended — I'd rather you stay because you want to.

---
Fix My Churn · 123 Real Street, Real City, MA 02114
Unsubscribe (one-click)
```

**Why it works:** Course = welcome, explicitly. Sender is a person, reply-capable. No pitch. Single ask is a reply. Subject is 6 words and sounds like a text message. First body line is "Hey {first_name} —", not a logo. P.S. handles compliance without breaking voice.

### Good — Churn-recovery (dessert that doubles as save)

```
From: Val from Fix My Churn <val@fixmychurn.com>
Subject: did something go sideways?   (4 words, 29 chars)
Preview: No pitch. Just checking in — and a way out if you need it.

Hey {first_name},

I noticed your account moved to canceled yesterday. I'm not writing to
talk you out of it. I'm writing because I'd genuinely like to know what
happened, so I can either fix it for the next person or learn that we
weren't the right fit.

If you have 30 seconds, hit reply with one of these:

  A. Wrong tool for what I needed
  B. Too expensive for the value I got
  C. Something else (please say what)

Whatever you say, I'll read it. No follow-up sales sequence.

— Val

---
Fix My Churn · 123 Real Street, Real City, MA 02114
Unsubscribe (one-click)
```

**Why it works:** Behavior-triggered (cancellation event). Course = dessert / save. No CTA button — the reply IS the CTA. Customer-language options. Promises no follow-up sales sequence and means it.

### Good — Broadcast appetizer

```
From: Val from Fix My Churn <val@fixmychurn.com>
Subject: the 4-word welcome email test   (6 words, 32 chars)
Preview: If your welcome email fails this, your churn starts on day one.

Hey {first_name},

Quick test you can run on your own welcome email in 10 seconds.

Open it. Read it out loud. If the first four words sound like something
a marketing department would say — "We're so excited to..." — your guest
just walked into a sales pitch instead of a dinner party.

The fix is short. The first four words should pass this test:

"Could a human have actually typed this to one other human?"

That's the whole thing for this week.

— Val

P.S. If you want the full Welcome Email Audit checklist I use with
Incubator members, hit reply with the word "audit" and I'll send it over.

---
Fix My Churn · 123 Real Street, Real City, MA 02114
Unsubscribe (one-click)
```

**Why it works:** Course = appetizer. One idea. No button. P.S. is the soft ask, gated on a reply (still single-ask). Generosity-first — the test is given fully in the body, the checklist offer is optional dessert.

### Bad — Corporate broadcast ("the buffet line")

```
From: The Acme Marketing Team <marketing@acme.io>
Subject: 🎉 HUGE NEWS FROM ACME! Don't miss our biggest launch ever!!! 🎉
Preview: (none — pulls "View in browser | Update preferences | Acme Logo")

[Hero image: 1200x600 product render, no alt text]
[Three side-by-side CTA buttons of identical weight:
  "Start Free Trial" | "Book a Demo" | "Download the eBook"]
[Body is 90% image, ~30 words of text]
[Footer: 6px gray unsubscribe link in #DDDDDD on #FFFFFF]
```

**Why it fails:** Sender is a team string (DISC-EMAIL-01 FAIL). No course classification — and the content is incoherent as any course (DISC-EMAIL-02 FAIL). Three competing primary CTAs (DISC-EMAIL-04 FAIL). Subject is 11 words, ALL CAPS, stacked punctuation, hype words (DISC-EMAIL-05 FAIL). First line is "View in browser" (DISC-EMAIL-05 FAIL again). Image-heavy. Footer is hidden. This is a broadcast, not a dinner conversation — and the inbox will treat it accordingly.

### Bad — "Newsletter"-branded image-heavy mailer

```
From: Acme Newsletter <newsletter@acme.io>
Subject: 📰 The Acme Newsletter — Issue #47 — November 2026 Edition
Preview: (none)

[Banner image with "THE ACME NEWSLETTER" in 72pt type]
[Five sections, each with its own image header and its own CTA button]
[No reply path — noreply@ in headers]
```

**Why it fails:** Calling it a "newsletter" sets the reader's mental category to "marketing material I can ignore" before they read a word. Five competing CTAs (DISC-EMAIL-04 FAIL). `noreply@` (DISC-EMAIL-01 FAIL). Subject leads with an emoji and a magazine-style edition number — nobody texts their friend "📰 Issue #47." No course classification. The reader has been served a buffet of cold appetizers instead of a meal.

---

## Anti-Patterns

1. **Pitching in the welcome.** The single most common Geisler-named failure. The welcome is the host moment. Selling in the welcome is greeting a dinner guest with a sales contract on the doormat. Welcome emails set the tone for every email that follows — burning that moment burns the entire program.

2. **Day-N drip schedules.** "Day 1, day 3, day 7" treats every signup like every other signup. The user who invited five teammates on day one and the user who never logged in get the same email. Lifecycle is behavior, not time. If you cannot name the user behavior that triggered the email, you do not have a lifecycle — you have a calendar.

3. **"The {Brand} Team" or `noreply@` from-lines.** Brands cannot greet guests. People can. A from-line that hides the human kills the reply path before the reader even decides whether to open. Reply rate is the single most underrated email KPI; `noreply@` makes it zero by design.

4. **Image-only / "newsletter"-branded layouts.** A heavy-HTML mailer with a hero banner, a magazine masthead, and five buttons sets the reader's mental category to "marketing" the moment the preview pane loads. Plain-text-feel emails get read; magazine layouts get archived.

5. **Multiple competing CTAs at equal weight.** A guest can answer one question at a time. Three buttons next to each other dilute every click. One primary ask per email, always.

6. **"Hi {first_name}!" with nothing behind it.** Personalization tokens with no actual personalization are the email equivalent of a stranger using your name at a networking event. The token is fine only when the rest of the email reads as something a real person could have written specifically to a real reader.

7. **Marketing language over customer language.** "Leverage our cutting-edge platform to unlock enterprise-grade outcomes" is a sentence no customer ever spoke. Mine support tickets, sales calls, and onboarding chats. Use customer phrases verbatim. The body should sound like the reader's own vocabulary read back to them.

8. **No reply path / no dessert course.** Programs that only send pre-purchase emails optimize for acquisition and starve retention. Dessert — anniversary, check-in, "anything I can fix?" emails that ask for nothing — is what makes guests come back. Most B2B SaaS programs never serve it. That is why their churn graphs trend the way they do.

9. **Batch-and-blast broadcasts.** Sending the same email to every contact at the same time treats the list as an audience instead of as guests at a table. Segment by behavior. Send fewer emails to more specific people.

---

## Metrics

Geisler reorders the conventional email metric stack. Reply rate and retention sit above open rate.

- **Reply rate (KPI).** The strongest signal email can produce. Welcome and appetizer courses should specifically engineer for replies — the primary ask is often a reply. Target: 2-5% reply rate on welcome emails; 0.5-2% on appetizer broadcasts. Below 0.5% across courses means the email reads as a broadcast, not a conversation.
- **Retention / churn rate (KPI).** Lifecycle email's actual job. Measure cancellation rate, downgrade rate, and dormant-account rate in the cohort that received the program vs. the cohort that did not. Dessert-course emails earn their place against this metric.
- **Expansion revenue from email.** The main-course test. What percentage of upgrades, seat-adds, and plan-changes can be attributed to a specific main-course email? Geisler's bar: main-course emails should drive measurable expansion, not just opens.
- **Open rate.** Useful but downgraded — Apple Mail Privacy Protection inflates this number for ~40% of opens. Use it for subject-line A/B comparisons, never as a primary success metric. Benchmark: 25-45% for behavior-triggered sends; lower for broadcast.
- **Click-through rate.** Useful when the email has a real button. Less meaningful when the primary ask is a reply (clicks ≈ 0 by design). Always interpret CTR in the context of the course type.
- **Unsubscribe rate.** Healthy floor; do not drive to zero. An unsubscribe is a guest politely leaving the dinner — far better than a guest staying and ignoring you. Target: under 0.5% per send.
- **Spam complaint rate.** Hard ceiling. Must stay under 0.1% (Gmail/Yahoo enforcement threshold). A single bad send above this floor can damage the sending domain for months.
- **DNS authentication pass rate.** SPF/DKIM/DMARC alignment per ESP reports. Target: 100%.
- **Dinner-party feel (qualitative).** Pull 5 random emails from the last quarter. Read each aloud at a real table. Does it sound like a host or a megaphone? This is not a number, but it is the only metric Geisler herself trusts to detect drift before the quantitative metrics do.

---

## Sources

- Val Geisler — official site & writing index: https://www.valgeisler.com/
- MicroConf talk archive (Val Geisler, "The Dinner Party Strategy" foundational talk): https://microconf.gen.co/val-geisler/
- Fix My Churn Incubator (productized lifecycle-email program — the canonical application of the framework): https://fixmychurn.com/incubator/
- Val Geisler on LinkedIn — "lifecycle marketing is a misnomer if it's time-based" (behavior-trigger principle): https://www.linkedin.com/posts/lovevalgeisler_lifecycle-marketing-is-a-misnomer-if-in-activity-7057708444811755521-LmxB
- Churn.fm podcast — Val Geisler on customer-language email strategy: https://www.churn.fm/episode/customer-email-strategy
