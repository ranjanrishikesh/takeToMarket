# Logo Design Principles - Reference

**Purpose:** Knowledge base consumed by `/ttm-init` logo flow. Captures what makes a logo work for a SaaS brand and a developerneur audience.

## Logo types

- **Wordmark** - brand name in distinctive typography. Best for short, distinctive names (Stripe, Vercel, Linear).
- **Lettermark** - initials only. Works when name is long (IBM, NASA).
- **Symbol/icon** - abstract mark. Hard to do well; requires brand recognition to read.
- **Combination mark** - wordmark + symbol together. Most flexible.

**Recommendation default for developerneurs:** start with wordmark or combination mark. Symbol-only logos require brand equity you don't have yet.

## Principles

1. **Scalable** - readable at 16x16 favicon and on a billboard.
2. **Monochrome-safe** - works in single color when printed/embossed/etched.
3. **Distinctive** - passes the "if I removed the name, would you recognize it?" test.
4. **Memorable** - simple enough to redraw from memory.
5. **Versatile** - works on light, dark, and image backgrounds.
6. **Era-resistant** - avoid trendy fads (gradients, 3D bevels, fake metallic).

## Anti-patterns
- Generic "tech wing" or "abstract orbit" shapes (template-derived).
- Three offset circles. Everyone does this.
- Cliche motifs: lightbulb (idea), gear (tech), brain (smart), rocket (launch). Used to death.
- Heavy gradients unless they're load-bearing brand-recognition (rare).
- Drop shadows.

## Format checklist
For each finished logo, produce:
- `logo.svg` - vector primary.
- `logo-mark.svg` - symbol only (if a combination mark).
- `logo-wordmark.svg` - text only (if a combination mark).
- `logo-mono-light.svg` - single-color version for light bg.
- `logo-mono-dark.svg` - single-color version for dark bg.
- `logo-favicon.svg` - 32x32 simplified.
- `logo@1x.png`, `logo@2x.png` - raster fallbacks (for runtimes/embeds that don't support SVG).

## Vision-review checklist (what the AI evaluates)
1. **Legibility at small size** - render at 32x32, can you still tell what it is?
2. **Composition balance** - visual weight is even, not pulling left/right.
3. **Mark + wordmark spacing** - wordmark not crammed against the mark.
4. **Typography choice** - distinct enough; not Helvetica unless deliberately neutral.
5. **Color matches palette** - primary color from BRAND.md, not a one-off hue.
6. **Originality vs cliche** - is this Generic Startup Logo #427 or genuinely distinct?

## Sources
- Logo Design Love by David Airey - blog and book covering identity design fundamentals, including scalability, simplicity, and mark durability. https://www.logodesignlove.com
- Brand New (UnderConsideration) - daily critique of corporate identity work; strong signal for what is overused vs. genuinely fresh. https://www.underconsideration.com/brandnew
- Sagi Haviv (Chermayeff & Geismar Haviv) - interviews and talks on logo design longevity; key insight: the best logos work because they are simple enough to survive context change. https://www.cgstudionyc.com
- Lyft brand evolution case study (2019 refresh) - Lyft Design team articles on Medium documenting the shift from gradient-heavy to a bolder, simpler mark. https://design.lyft.com
- Mailchimp brand evolution case study (2018 refresh) - Collins agency case study on stripping back a mascot-driven identity into a flexible modern system. https://www.wearecollins.com/work/mailchimp
- Vercel design system - real-world wordmark example for developer tools; demonstrates how restraint and monochrome-first thinking work for a technical audience. https://vercel.com/design
- Linear brand guidelines - example of a restrained mark + wordmark combination that reads well for SaaS; minimal, geometric, scalable. https://linear.app/brand
