# Base Quality Gates

**Status:** Gate definitions will be implemented in Phase 4

## Tier 1 (Blocking)

1. **Positioning Drift** -- GATE-01
   Verifies asset content aligns with POSITIONING.md. Any deviation from approved positioning, use of must-not-say terms, or claims not backed by proof points triggers a block.

2. **Claim Accuracy** -- GATE-02
   Verifies every factual claim has a proof point with a valid source and non-expired verification date. Unverifiable claims trigger a block.

3. **Outcome Alignment** -- GATE-04
   Verifies the asset serves the campaign's stated outcome metric. Assets that cannot be traced to the outcome are blocked.

## Tier 2 (Advisory)

4. **Voice Drift** -- GATE-03
   Checks content tone and vocabulary against BRAND.md voice archetype and banned words list.

5. **Funnel Integrity** -- GATE-05
   Verifies CTAs link to correct destinations, forms work, and the conversion path is unbroken.

6. **UTM Hygiene** -- GATE-06
   Validates UTM parameters follow naming conventions, are present on all trackable links, and align with attribution model.

7. **Compliance** -- GATE-07
   Checks for regulatory requirements (disclaimers, disclosures, opt-out links) per channel and jurisdiction.

8. **Competitor Collision** -- GATE-08
   Flags content that inadvertently promotes a competitor, uses competitor trademarks, or makes comparative claims without substantiation.

9. **ICP Fit** -- GATE-09
   Verifies content addresses the target ICP segment's pains, language, and context rather than the anti-ICP.

10. **Format Correctness** -- GATE-10
    Validates asset meets channel-specific format requirements (character limits, image dimensions, file types, metadata).
