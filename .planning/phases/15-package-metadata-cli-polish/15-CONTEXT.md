# Phase 15: Package Metadata & CLI Polish - Context

**Gathered:** 2026-05-11
**Status:** Ready for planning

<domain>
## Phase Boundary

Make the npm package page complete and professional, and fix the `agents/` tarball leak. Add `--version` flag and version banner to install.js. This is the last phase before publish (Phase 16). This phase does NOT touch the actual `npm publish` workflow (Phase 16) or any runtime behavior beyond the version banner.

</domain>

<decisions>
## Implementation Decisions

### Repository Identity
- **D-01:** GitHub repo URL: `https://github.com/rishikeshranjan/takeToMarket` (per REQUIREMENTS.md PKG-01 spec). All three URL fields derive from this:
  - `repository.url`: `git+https://github.com/rishikeshranjan/takeToMarket.git`
  - `homepage`: `https://github.com/rishikeshranjan/takeToMarket#readme`
  - `bugs.url`: `https://github.com/rishikeshranjan/takeToMarket/issues`
- **D-02:** `repository` uses canonical object form `{ "type": "git", "url": "git+https://..." }` (npm warns on string form for new packages).

### Author Field
- **D-03:** Author = `"Rishikesh Ranjan <59333266+ranjanrishikesh@users.noreply.github.com>"` (string form, sourced from `git config user.name` + GitHub no-reply email per `git config user.email`). String form is sufficient — keeps package.json compact, npm parses it the same as the object form.

### Keyword Expansion
- **D-04:** Keep existing 5 keywords + add discovery terms. Final list (12 total): `claude-code, codex, marketing, campaigns, agent-skills, gtm, growth, positioning, content-marketing, marketing-automation, ai-agents, spec-driven`. Lowercase, hyphenated, no plurals (npm convention).

### files[] Fix
- **D-05:** Add `agents/` to `files[]` array. Current install.js copies `agents/` (it's in `DIRS_TO_COPY`) but the npm tarball excludes it — bug per PKG-05.
- **D-06:** Verify `LICENSE` is auto-included by npm (it is by default — no need to list explicitly), but add it to `files[]` anyway for explicitness (`LICENSE`, `README.md`).
- **D-07:** Verify with `npm pack --dry-run` (PUB-01) — output must show every entry from install.js `DIRS_TO_COPY` + `FILES_TO_COPY` and must NOT show `.planning/`, `.git/`, `.claude/`, `node_modules/`, or any test files. If any leak occurs, add an `.npmignore` (preferred) before falling back to fine-grained `files[]` filters.

### LICENSE
- **D-08:** Existing `LICENSE` file is MIT and already matches `package.json`. Keep "Copyright (c) 2026 takeToMarket Contributors" — generic, accurate. Do NOT change to a personal name (project is open-source, future contributors).
- **D-09:** No new LICENSE needed; verify content matches MIT canonical text per PKG-07.

### CLI --version Flag
- **D-10:** `npx taketomarket --version` reads version from `require('./package.json').version` at runtime. Single source of truth — no hardcoded version constant. Implementation in install.js: parse `args` for `--version` flag BEFORE runtime detection, print version to stdout, `process.exit(0)`.
- **D-11:** Also accept `-v` short form (npm convention). Print plain version string `0.1.0` followed by newline — no decoration. Matches `npm --version` and `node --version` style.

### Version Banner
- **D-12:** Modify existing banner at `install.js:203` from `console.log('takeToMarket installer')` to `console.log(\`takeToMarket installer v${VERSION}\`)`. Minimal change, preserves the 3-line banner block.
- **D-13:** Define `const VERSION = require('./package.json').version` at the top of install.js (after the existing PACKAGE_ROOT constant). Reuse for both --version flag and banner.

### Test Coverage
- **D-14:** Add 2 small e2e test scenarios to `test/install-e2e.test.cjs`:
  - `--version` flag prints version + exit 0 + writes nothing
  - install banner contains `vX.Y.Z` substring
- **D-15:** Add 1 unit-style test (or extend existing) verifying `package.json` has all required fields (repository, homepage, bugs, author, files includes 'agents/', keywords length >= 12). One-shot guard against regressions during publish prep.

### Claude's Discretion
- Whether to use `.npmignore` or `files[]` filtering for the tarball leak fix (recommend `.npmignore` — declarative)
- Exact wording of version banner if multi-line is needed
- Test file placement: extend `install-e2e.test.cjs` or add `test/package-metadata.test.cjs` for the manifest field guard (recommend NEW file for the manifest guard — it's a JSON shape test, not E2E)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Source of Truth
- `package.json` — Current state: missing repository/homepage/bugs/author, missing `agents/` from files[], 5 keywords. Phase 15 modifies all of these.
- `LICENSE` — MIT, "Copyright (c) 2026 takeToMarket Contributors" — verify content unchanged.
- `install.js` — Lines 11-12 (PACKAGE_ROOT constant), line 203 (banner). Phase 15 adds VERSION constant + --version flag handling.
- `.gitignore` — Reference for what npm should also exclude (`.planning/`, `.claude/`, etc.).

### Test Infrastructure (from prior phases)
- `test/install-e2e.test.cjs` — Phase 14 file. Pattern: spawnSync + HOME override. New --version + banner tests append here.
- `test/install.test.cjs` — Phase 12 file. Pattern: require()-level unit tests on installer functions.
- `test/helpers.cjs` — createTempDir, createMockHome, createMockMarketing, createMockCampaign. Reuse, do NOT extend.

### Requirements
- `.planning/REQUIREMENTS.md` — PKG-01..07, CLI-01..02, PUB-01 all assigned to this phase (10 total).

### Prior Phase Decisions
- `.planning/phases/14-e2e-integration-tests/14-CONTEXT.md` — D-01 through D-16: child-process E2E pattern, helpers.cjs frozen, no new shared helpers.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- install.js already exports `validateInstall`, `dirExists`, `fileExists` (Phase 12) — usable for asserting `agents/` ends up at install target
- `require('./package.json').version` works at the install.js top level — no async, no JSON parse needed
- spawnSync + HOME override pattern from Phase 14 directly applies to --version test

### Established Patterns
- CJS test files, node:test + assert/strict
- Test files glob-discovered by `node --test 'test/*.test.cjs'`
- HOME env override per call: `{ env: { ...process.env, HOME: tempDir } }`
- npm pack must run from project root; `--dry-run` prints file list to stderr (not stdout)

### Integration Points
- `npm pack --dry-run` output is the verification signal for PUB-01 — parse line-by-line
- install.js `--version` arg parsing must happen BEFORE `detectRuntime` (which currently runs first) — short-circuit early
- VERSION constant placement in install.js: line 13ish (right after PACKAGE_ROOT) for grep-discoverability

### Current package.json Gaps
- Missing: `repository`, `homepage`, `bugs`, `author` (PKG-01..04)
- `files[]` missing `agents/` and `LICENSE` (PKG-05)
- `keywords` count = 5, need ≥12 (PKG-06)

</code_context>

<specifics>
## Specific Ideas

User delegated decisions to Claude per established v1.1 pattern. All locked decisions derive from:
- ROADMAP success criteria (5 explicit asks)
- REQUIREMENTS.md spec (10 IDs with explicit field names and behavior)
- Prior phase conventions (test patterns, helper boundaries)
- npm publish defaults (canonical repository form, keyword conventions)

GitHub URL `rishikeshranjan/takeToMarket` taken from REQUIREMENTS.md PKG-01 verbatim. Author derived from local git config. If either is wrong, planner can flag in plan review.

</specifics>

<deferred>
## Deferred Ideas

- README.md generation / overhaul — Phase 16 (publish prep) territory; current README likely needs polish but not part of Phase 15 metadata scope
- Changelog file (CHANGELOG.md) — not in v1.1 requirements
- Funding field in package.json — not requested
- Alternate distribution paths (Homebrew, scoop) — out of scope
- `--help` flag for install.js — not in requirements (would be a polish item for Phase 16+)
- npm provenance attestation (`--provenance`) — Phase 16 publish concern

</deferred>

---

*Phase: 15-Package Metadata & CLI Polish*
*Context gathered: 2026-05-11*
