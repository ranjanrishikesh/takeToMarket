# Brand Color Theory - Reference

**Purpose:** Knowledge base consumed by `/ttm-init` brand-color flow. Captures what makes a good color palette for SaaS, B2B, and DTC brands targeting engineers and technical buyers.

## Color theory fundamentals

### Color wheel relationships
- **Complementary** - opposite on wheel; high contrast; use sparingly for accents.
- **Analogous** - adjacent; harmonious; good for backgrounds + sections.
- **Triadic** - three equidistant; balanced, vibrant; needs careful weighting.
- **Split-complementary** - base + two adjacent to its complement; high contrast with less tension than complementary.
- **Monochromatic** - one hue, varying saturation/lightness; clean, modern, easy to apply.

### Color psychology in B2B SaaS

Blue signals trust, reliability, and institutional credibility. It dominates enterprise SaaS for this reason: Stripe, IBM, Salesforce, LinkedIn, and PayPal all anchor their palettes in blue. Studies on color and purchase intent (Satyendra Singh, 2006, "Impact of Color on Marketing", Management Decision) consistently rank blue as the top-performing hue for B2B trust. Green carries associations of growth, financial prosperity, and health. Robinhood, Spotify, and Whole Foods use green to imply momentum and positive outcomes. It performs especially well for fintech and health products where the message is "things are going up." Purple and violet read as innovative, creative, and premium. Stripe uses purple as an accent against its blue base to signal technical sophistication; Anthropic's brand leans into violet for the same AI-innovation positioning. The risk: so many AI startups adopted a highly saturated ~260-270 degree violet in 2022-2024 that it now reads as generic rather than distinctive. Orange and warm red convey urgency, energy, and action. HubSpot's orange communicates approachability and momentum. Notion uses an accent red for destructive actions and CTAs where high contrast is needed. These hues are effective for primary call-to-action buttons but exhausting as dominant brand colors. Black as a primary brand color - as used by Vercel and Linear - communicates premium quality, minimalism, and engineering precision. It pairs well with a single vibrant accent color and reads as confident. Developer tooling and infrastructure products disproportionately choose dark or neutral-anchored palettes because their users live in dark IDEs and terminals; a dark-mode-first palette feels native rather than forced.

### Accessibility (WCAG)
- **AA contrast:** 4.5:1 for normal text, 3:1 for large text.
- **AAA contrast:** 7:1 for normal text, 4.5:1 for large text.
- Never rely on color alone to convey state.

## Palette structure for a SaaS landing page

A complete palette has 7-9 colors:
1. **Primary** - main brand color, used for CTAs, links, key highlights.
2. **Primary variants** - lighter + darker shades of primary for hover/active.
3. **Secondary** - supporting brand color, used for secondary CTAs, illustrations.
4. **Accent** - high-saturation pop color used sparingly.
5. **Neutral scale** - 9 grays from #FAFAFA to #0A0A0A for text, borders, surfaces.
6. **Semantic** - success (green), warning (amber), error (red), info (blue).

## SaaS palette norms (developerneur audience)

- Default to dark mode-friendly choices. Engineers spend their day in dark themes.
- Avoid retro/playful palettes unless the product is consumer-facing.
- Avoid "AI startup purple" if you want to look distinct. The 260-270 degree, high-saturation violet has been used by so many AI products since 2022 that it no longer differentiates; consider desaturating, shifting hue toward blue-violet or red-violet, or choosing a different anchor color entirely.
- Avoid pure black (#000) and pure white (#FFF). Use near-black (~#0A0A0A) and near-white (~#FAFAFA) for softer, less harsh contrast that reads better at scale.

## Sources

- **Refactoring UI** (Adam Wathan + Steve Schoger, 2018) - The canonical practical guide for product UI color systems. Covers palette construction, HSL-based tint/shade generation, and why designers should start with saturation constraints rather than hex codes.
- **Material Design 3 color system** (Google, material.io/design/color) - Defines the tonal palette model (primary, secondary, tertiary, error, neutral, neutral-variant) and dynamic color generation. Useful reference for semantic token naming conventions.
- **Tailwind CSS palette documentation** (tailwindcss.com/docs/customizing-colors) - The 50-950 numeric scale for each hue is now a de facto standard for SaaS teams. Shows how consistent lightness steps across hues enable predictable component theming.
- **Open Color** (Haegu Yun, yeun.github.io/open-color) - Open-source color system optimized for UI; covers 13 hues with 10 steps each. Good starting reference for neutral and semantic color choices.
- **IBM Carbon design system** (carbondesignsystem.com) - Enterprise-grade color guidance with strong accessibility documentation. The gray scale and blue scale from Carbon are widely adopted as sensible defaults for B2B SaaS.
- **Anthropic brand guidelines** - Anthropic's own palette (violet anchor, neutral scale, dark mode-first) serves as a real-world example of positioning "AI innovation" while avoiding commodity purple by controlling saturation and pairing with restraint.
- **Stripe brand standards** (stripe.com/newsroom/brand-assets) - Stripe's palette (blue base + purple accent + clean neutrals) is a reference-grade example of a technical-product brand that reads as trustworthy and premium simultaneously. The use of gradient purple as an accent rather than a base avoids the saturation problem.
