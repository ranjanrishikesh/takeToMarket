# Base Playbook Inheritance Contract

This file defines the structure all discipline playbooks must follow. It is a contract and template -- NOT a discipline playbook itself. It is NOT loaded by the produce workflow and NOT loaded by verify for gate evaluation.

Discipline playbooks (e.g., `seo.md`, `email.md`) extend this contract by implementing all required sections below with channel-specific content.

---

## YAML Frontmatter Specification

Every discipline playbook must include this frontmatter:

```yaml
---
discipline: {name}        # e.g., seo, aeo, email, linkedin, social
asset_types: [{types}]     # e.g., [blog-post, landing-page, pillar-page]
version: "1.0"
---
```

---

## Required Sections

Every discipline playbook must contain all 7 sections below, in this order:

### 1. `## Production Guidance`

Channel-specific writing instructions loaded by ttm-producer during content generation. Covers tone, structure, and channel conventions.

### 2. `## Discipline Gates`

Quality checks using `DISC-{DISCIPLINE}-{NN}` gate IDs (see Gate Definition Format below). Each gate has PASS/WARN/FAIL criteria. Variable count per discipline -- let the domain drive the number.

### 3. `## Base Gate Overrides`

Table mapping base gate IDs to adjusted tiers. Overrides adjust tier classification only -- they cannot disable a base gate. Base gates always run regardless of overrides (per D-01).

**Format:**

| Base Gate ID | Default Tier | Override Tier | Reason |
|-------------|-------------|---------------|--------|
| GATE-10 | Tier 2 | Tier 1 | [reason for override] |

If no overrides apply, include the section with: "None -- all base gates keep default tiers."

### 4. `## Format Rules`

Platform-specific constraints: character limits, structural requirements, required elements.

### 5. `## Examples`

Good and bad pattern examples. If this section exceeds 500 lines when combined with the rest of the playbook, extract to `references/playbook-{discipline}-examples.md` and use @-reference.

### 6. `## Anti-Patterns`

Common mistakes for this discipline that the AI should avoid during production.

### 7. `## Metrics`

What to measure post-ship for this channel (e.g., organic impressions, click-through rate).

---

## Gate Definition Format

Each discipline gate must follow this structure, matching the base gate pattern from `gates/base-gates.md`:

```markdown
### DISC-{DISCIPLINE}-{NN}: {Name} -- Tier {1|2}

**Checks:** {what is evaluated}
**Against:** {reference data or asset content}

#### Evaluation Criteria

1. **{Check name}**
   - PASS: {concrete, verifiable condition}
   - WARN: {concrete, verifiable condition}
   - FAIL: {concrete, verifiable condition}
```

Gate criteria must be objective and verifiable (countable, pattern-matchable). No subjective criteria ("Is the hook compelling?"). Discipline gates must not duplicate base gates.

---

## Tier Rules

- **Tier 1 (blocking):** Failure triggers the Correct / Accept+log / Escalate deviation handling flow (same as base Tier 1 gates).
- **Tier 2 (advisory):** Findings are reported but no user action is required.

---

## Override Rules

- Base gates always run for every asset (per D-01). Discipline gates run additionally.
- Overrides adjust tier only -- they cannot disable or skip a base gate (per D-02).
- Overrides are parsed from the playbook's `## Base Gate Overrides` section and applied BEFORE base gate evaluation, so that deviation handling uses the correct tier.

---

## 500-Line Limit

Discipline playbooks must stay under 500 lines (per D-07). If exceeding, extract `## Examples` or `## Anti-Patterns` to `references/playbook-{discipline}-examples.md` and @-reference the extracted file.

---

## Structured Output

Discipline gate evaluations use the same structured output format as base gates (defined in `gates/gate-evaluation.md`). Results appear as additional rows after the 10 base gates in the verification summary table.
