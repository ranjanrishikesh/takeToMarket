# takeToMarket v2 — Design Spec

**Date:** 2026-05-13
**Scope:** All 21 improvements from `docs/improvements.md` (IMP-01 through IMP-21)
**Version target:** 2.0.0
**Structure:** 5 sequential waves ordered by dependency

---

## Context

takeToMarket v1.0.1 is live on npm. Manual testing (2026-05-13) revealed two critical blockers:

1. **Skills don't appear as slash commands.** The installer never writes to `installed_plugins.json`, so Claude Code ignores the installed plugin directory entirely. `${CLAUDE_PLUGIN_ROOT}` is undefined → every skill fails on invocation.
2. **Silent runtime selection.** Installer auto-picks one runtime with no user input, no confirmation, and no way to install to multiple runtimes in one pass.

Additionally: the repo must be made public and the README must be rewritten before meaningful distribution is possible.

---

## Wave 1 — Safety + Critical Blockers

**Items:** IMP-16, IMP-15, IMP-02

**Goal:** Fix the two broken things (leaking local paths, broken slash commands) and wrong URL before any new work lands.

### IMP-16 — Untrack `settings.local.json`

`.claude/settings.local.json` is tracked in git and contains absolute paths with the local username (`/Users/rishikeshranjan/...`). This leaks local filesystem layout to every repo cloner.

**Steps:**
1. Append to `.gitignore`: `.claude/settings.local.json`
2. `git rm --cached .claude/settings.local.json`
3. Commit: `chore: gitignore settings.local.json — prevents leaking local filesystem paths`

No code changes. `.claude/settings.local.json` stays on disk locally; only removed from tracking.

### IMP-15 — Fix wrong GitHub URL

README `git clone` section and install.js success message both reference `github.com/taketomarket/taketomarket` — this org/repo does not exist.

**Fix everywhere:**
- `README.md`: all instances → `https://github.com/ranjanrishikesh/takeToMarket`
- `install.js` ~line 280: docs URL in success message → `https://github.com/ranjanrishikesh/takeToMarket#readme`
- `.claude-plugin/plugin.json`: bump version from `"0.1.0"` to `"1.0.1"` to match npm package

### IMP-02 — Register in `installed_plugins.json`

**The core fix.** Claude Code only sets `${CLAUDE_PLUGIN_ROOT}` for plugins registered in `~/.claude/plugins/installed_plugins.json`. Without this, skills appear to install but never surface as slash commands and always fail.

**New function:** `registerPlugin(installPath, version)` in `install.js`:

```js
function registerPlugin(installPath, version) {
  const registryPath = path.join(os.homedir(), '.claude', 'plugins', 'installed_plugins.json');
  const pluginsDir = path.dirname(registryPath);

  // Read existing registry
  let registry = {};
  if (fileExists(registryPath)) {
    try {
      registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
    } catch {
      // Corrupted — back up and start fresh
      fs.renameSync(registryPath, registryPath + '.bak');
      console.warn('Warning: installed_plugins.json was corrupted. Backed up to .bak and recreated.');
    }
  }

  const now = new Date().toISOString();
  const existing = (registry['taketomarket@npm'] || [])[0];

  registry['taketomarket@npm'] = [{
    scope: 'user',
    installPath,
    version,
    installedAt: existing?.installedAt ?? now,
    lastUpdated: now,
  }];

  // Atomic write
  const tmpPath = registryPath + '.tmp';
  fs.mkdirSync(pluginsDir, { recursive: true });
  fs.writeFileSync(tmpPath, JSON.stringify(registry, null, 2) + '\n', 'utf8');
  fs.renameSync(tmpPath, registryPath);

  console.log('  Registered in installed_plugins.json');
}
```

Called in `main()` after file copy succeeds, only for Claude Code runtime (Codex registration is a Wave 4 spike — IMP-12).

**Wave 1 files changed:** `.gitignore`, `README.md`, `install.js`, `.claude-plugin/plugin.json`

---

## Wave 2 — Installer Overhaul

**Items:** IMP-01, IMP-03, IMP-04, IMP-05

**Goal:** Replace silent auto-detect with an interactive multi-runtime selection flow. Add UX polish: confirmation, `--check` flag, post-install summary.

### IMP-01 — Interactive runtime selection

Replace `detectRuntime()` with `promptRuntimeSelection(args)`.

**Flow:**
1. If `--runtime <name>` flag present → use it (legacy compat, single runtime)
2. If non-TTY stdin (CI/pipe) → auto-detect as today + print warning
3. If interactive TTY → show multi-select prompt

**Prompt format:**
```
Which AI coding tool(s) are you using? (select all that apply)

  1. Claude Code
  2. Codex (OpenAI)
  3. Cursor
  4. Windsurf
  5. Gemini CLI
  6. All of the above
  7. Let me type a custom path

Your choice (comma-separated, e.g. 1,3):
```

**Input parsing:**
- Comma-separated integers: `1,3` → [claudeCode, cursor]
- `6` → expand to [1,2,3,4,5] (all named runtimes)
- `7` → secondary prompt: `Enter install path:` → custom target
- Invalid input → re-prompt once, then exit with error

**Implementation:** Pure Node.js `readline` — zero npm dependencies.

**Install target map:**

| Runtime | Plugin dir | Registration |
|---------|-----------|-------------|
| Claude Code | `~/.claude/plugins/taketomarket/` | `installed_plugins.json` (IMP-02) |
| Codex | `~/.codex/plugins/taketomarket/` | Wave 4 spike (IMP-12) |
| Cursor | `~/.cursor/rules/` | Wave 4 spike (IMP-09) |
| Windsurf | `~/.codeium/windsurf/` | Wave 4 spike (IMP-10) |
| Gemini CLI | `~/.gemini/` | Wave 4 validation (IMP-11) |
| Custom | user-typed path | None |

For Wave 4 runtimes (Cursor, Windsurf, Gemini, Codex): installer copies files and prints `[PARTIAL] <Runtime>: files copied — slash command registration pending research (see Wave 4)`.

Result: `promptRuntimeSelection()` returns an array of target objects: `[{ name, dir, register }]`. The copy + registration loop runs once per target.

### IMP-03 — Confirmation prompt

Fires after runtime selection, before any file writes. Skipped with `--yes` / `-y`.

```
takeToMarket v1.0.1 — Marketing OS for Claude Code

This will install to:
  ~/.claude/plugins/taketomarket/    (Claude Code)
  ~/.cursor/rules/                   (Cursor)

Proceed? [Y/n]:
```

Empty input or `y`/`Y` → proceed. `n`/`N` → `console.log('Installation cancelled.')` + `process.exit(0)`.

**New function:** `confirmInstall(targets, version, yesFlag)` → returns boolean.

### IMP-04 — `--check` / `--status` flag

`npx taketomarket --check` → inspect install state without writing.

Checks per runtime:
- Plugin directory exists?
- Skill count in `skills/` subdirectory?
- For Claude Code: entry in `installed_plugins.json`?

Output:
```
takeToMarket v1.0.1

Claude Code: INSTALLED (27 skills, ~/.claude/plugins/taketomarket)
  registered: yes (installed_plugins.json)
Codex:       NOT INSTALLED
Cursor:      NOT INSTALLED

Run `npx taketomarket` to install or reinstall.
```

**New function:** `checkStatus(version)` — reads state, prints table, `process.exit(0)`.

### IMP-05 — Post-install summary

After all targets install successfully, dynamically discover skills and print slash commands.

Skill discovery: scan `<targetDir>/skills/` for directories containing `SKILL.md`. Sort alphabetically. Print as `/taketomarket:<dirname>`.

```
Installation complete! 27 skills installed.

Available commands:
  /taketomarket:ttm-aeo-check         Check citation status across AI engines
  /taketomarket:ttm-affiliate-kit     Generate creative kit for affiliate partners
  /taketomarket:ttm-archive           Archive a completed campaign
  ... (all 27)

Quick start: open any project in Claude Code and run /taketomarket:ttm-init
```

Description for each command: read from `SKILL.md` `description:` frontmatter field (first line of multi-line value).

**New function:** `printInstallSummary(targetDir)`.

**Wave 2 files changed:** `install.js` only. New functions: `promptRuntimeSelection()`, `confirmInstall()`, `checkStatus()`, `printInstallSummary()`. `main()` refactored to orchestrate the new flow.

---

## Wave 3 — README Overhaul

**Items:** IMP-08, IMP-13, IMP-14, IMP-15 (IMP-15 already handled in Wave 1)

**Goal:** Rewrite README so any user can go from "found this repo" to "running first campaign" without additional help.

**New README structure:**

```
# takeToMarket
[tagline + core invariant — keep existing]

## What it is / What it isn't
IS: marketing OS with positioning enforcement, quality gate walls, compound learnings.
IS NOT: content generator, one-click blog writer, social media scheduler.
[~100 words]

## Requirements
- Node.js 18+
- Claude Code v1.x+ (or Codex)
- git

## Installation

### Option 1 — npx (recommended)
npx taketomarket
# Interactive: asks which tool(s) you use, installs to all selected

### Option 2 — Claude Code plugin marketplace
/plugin install taketomarket@claude-plugins-official
# (pending marketplace approval — see contributing)

### Option 3 — Direct from GitHub (Claude Code)
/plugin install taketomarket@ranjanrishikesh
# (verify syntax — see docs/superpowers/specs/ for research findings)

### Option 4 — Manual (advanced)
git clone https://github.com/ranjanrishikesh/takeToMarket
cd takeToMarket && node install.js

## Quick Start
/taketomarket:ttm-init             # set up workspace (one time)
/taketomarket:ttm-new-campaign     # create first campaign
/taketomarket:ttm-produce          # run production wave

## Campaign Lifecycle
1. Init — set up workspace
2. New Campaign — create campaign directory
3. Research — discover market and audience
4. Brief — generate brief with outcome metrics
5. Produce — generate assets in isolated contexts
6. Review — human quality evaluation
7. Fix — root cause + re-produce (capped 3x)
8. Verify — quality gate wall check
9. Ship — launch checklist
10. Measure — analytics vs outcome metrics
11. Learn — extract lessons, update reference files

## Command Reference
[Table: 27 rows — command | description]

## Verify Installation
/taketomarket:ttm-health   # validates setup inside Claude Code
```

**Command reference table** — populated from the 27 SKILL.md descriptions already extracted:

| Command | Description |
|---------|-------------|
| `/taketomarket:ttm-aeo-check` | Check citation status across AI engines for a query |
| `/taketomarket:ttm-affiliate-kit` | Generate creative kit for affiliate partners |
| `/taketomarket:ttm-archive` | Archive a completed campaign, finalize state, and update LEARNINGS.md |
| `/taketomarket:ttm-brand-refresh` | Update BRAND.md with new proof points and deprecate expired ones |
| `/taketomarket:ttm-brief` | Generate a campaign brief with mandatory outcome metrics, positioning anchor, and channel mix |
| `/taketomarket:ttm-competitor-scan` | On-demand competitor analysis that updates COMPETITORS.md |
| `/taketomarket:ttm-email-preflight` | Deliverability, dark-mode, and spam-trigger scan for email assets |
| `/taketomarket:ttm-fix` | Fix phase: root cause analysis, fix brief, re-produce, re-verify (capped 3x) |
| `/taketomarket:ttm-health` | Validate .marketing/ directory integrity, reference file completeness, and state consistency |
| `/taketomarket:ttm-icp-refresh` | Update ICP.md from new customer data including calls, reviews, and feedback |
| `/taketomarket:ttm-init` | Interview-driven onboarding that generates all .marketing/ reference files |
| `/taketomarket:ttm-keyword-map` | Generate keyword cluster map with intent tags |
| `/taketomarket:ttm-learn` | Extract lessons from campaign measurement data, propose reference file edits, log to LEARNINGS.md |
| `/taketomarket:ttm-measure` | Analyze campaign analytics against outcome metrics using attribution models |
| `/taketomarket:ttm-new-campaign` | Create a new campaign directory with initialized state and reference file links |
| `/taketomarket:ttm-next` | Guide user to the right next command based on current campaign state |
| `/taketomarket:ttm-positioning-check` | Sample recent assets and report positioning drift percentage and analysis |
| `/taketomarket:ttm-positioning-shift` | Controlled positioning change with reasoning, migration plan, and approval gate |
| `/taketomarket:ttm-produce` | Generate content assets in fresh contexts loaded with brief, positioning, brand, ICP, and playbook |
| `/taketomarket:ttm-repurpose` | Fan out a long-form asset into derivatives across channels with full brief-produce-verify per derivative |
| `/taketomarket:ttm-research` | Discover phase: market and audience research including SERP, competitor content, and narrative mapping |
| `/taketomarket:ttm-resume` | Resume a paused campaign at its last completed phase |
| `/taketomarket:ttm-review` | Present assets with structured review checklist for human evaluation |
| `/taketomarket:ttm-seo-audit` | Technical and content SEO audit of a URL or sitemap |
| `/taketomarket:ttm-ship` | Generate launch checklist confirming tracking, UTMs, funnel testing, and asset finalization |
| `/taketomarket:ttm-state` | Display current campaign states, decisions in flight, blockers, and experiments |
| `/taketomarket:ttm-verify` | Run all applicable quality gates on every asset with pass/fail report and line-level feedback |

**Wave 3 files changed:** `README.md` only.

---

## Wave 4 — Research Spikes + Multi-Runtime

**Items:** IMP-06, IMP-07, IMP-09, IMP-10, IMP-11, IMP-12

**Approach:** Each spike defines "what to discover." Run spike → write findings → implement or document limitation. Spikes are sequential (later spike findings may affect installer code touched by earlier spikes).

### IMP-06 — Claude Code marketplace submission

**Discover:**
- Fetch `https://github.com/anthropics/claude-plugins-official` repo structure
- Find `/external_plugins/` directory format and required `plugin.json` schema
- Find submission process (form URL, PR requirements, review criteria)

**Implement:**
- Create `/external_plugins/taketomarket/plugin.json` with correct schema
- Submit form at `https://clau.de/plugin-directory-submission`
- Open PR to `anthropics/claude-plugins-official`

**Deliverable:** Submitted PR. Update README Option 2 with confirmed marketplace status.

### IMP-07 — GitHub direct install syntax

**Discover:**
- Check Claude Code docs for `/plugin install` syntax supporting GitHub repos
- Test: does `/plugin install taketomarket@ranjanrishikesh` work?
- Test: does `/plugin install github:ranjanrishikesh/takeToMarket` work?

**Implement:**
- Update README Option 3 with verified working syntax
- If neither works: document limitation, remove Option 3 from README

**Deliverable:** README updated with verified or removed Option 3.

### IMP-09 — Cursor adapter

**Discover:**
- Inspect `~/.cursor/rules/` format (`.mdc` files)
- Check if Cursor supports slash commands or only ambient rules
- Find exact frontmatter schema for `.mdc` files

**Implement:**
- If slash commands supported: write `bin/lib/cursor-adapter.cjs` that converts each `skills/ttm-*/SKILL.md` to `~/.cursor/rules/ttm-<name>.mdc`; wire into installer for Cursor runtime target
- If only ambient rules: generate a single `taketomarket.mdc` with condensed campaign lifecycle instructions; mark individual skill commands as "not supported"
- If no equivalent: document limitation in README; installer menu shows "Cursor: coming soon"

**Deliverable:** Working adapter OR documented limitation. Installer Cursor path updated accordingly.

### IMP-10 — Windsurf adapter

**Discover:**
- Research Windsurf's current rules/skills format and install path (`~/.codeium/windsurf/`?)
- Determine if Windsurf has a slash command system

**Implement:**
- If standardized format found: design adapter (scope TBD based on findings)
- If no format: mark "coming soon" in installer; document in README

**Deliverable:** Working adapter OR documented limitation.

### IMP-11 — Gemini CLI validation

**Discover:**
- Install Gemini CLI
- Run `ttm-init` flow using existing `GEMINI.md`
- Record: which tools are missing, which prompts fail, UX differences vs Claude Code

**Implement:**
- Update `GEMINI.md` with confirmed-working and known-gap annotations
- Fix any gaps that can be fixed in `GEMINI.md` without code changes

**Deliverable:** Updated `GEMINI.md` with validation status per skill.

### IMP-12 — Codex registration fix

**Discover:**
- Check if `~/.codex/plugins/installed_plugins.json` exists and matches Claude Code schema
- If different: determine correct Codex registration mechanism

**Implement:**
- If same schema as Claude Code: extend `registerPlugin()` to accept runtime param; call for both Claude Code and Codex targets
- If different schema: implement `registerCodexPlugin()` with correct format
- If no registration mechanism: document in README; Codex install remains file-copy-only

**Deliverable:** Working Codex registration parity with IMP-02.

**Wave 4 files changed:** `install.js` (runtime adapters + registration), `bin/lib/cursor-adapter.cjs` (if Cursor adapter), `GEMINI.md`, `README.md` (Options 2+3 finalized).

---

## Wave 5 — Go-Public Checklist

**Items:** IMP-17, IMP-18, IMP-19, IMP-20, IMP-21

**Executed in strict order. All required items before optional.**

### Required blockers (must complete before flipping public)

**IMP-19 — Scan git history for secrets**

Run:
```bash
git log --all --full-history -p | grep -iE "(api_key|secret|password|token|sk-|Bearer)" | grep -v "^--" | head -30
git log --all --full-history -p | grep "/Users/rishikeshranjan" | grep -v "^--" | head -20
```

- If credentials found → `git filter-repo` scrub before proceeding (do NOT use deprecated `git filter-branch`)
- If only local paths found (expected from old `settings.local.json` commits) → acceptable; document as no credentials exposed
- If clean → proceed

**IMP-16 already done in Wave 1.** Verify `.claude/settings.local.json` is no longer tracked.

**IMP-02 already done in Wave 1.** Verify installer registers correctly.

**IMP-15 already done in Wave 1.** Verify README URLs are correct.

**IMP-14 already done in Wave 3.** Verify how-to-use section exists.

### Recommended before public

**IMP-17 — `.planning/` directory**

Decision: add to `.gitignore` going forward; leave existing history intact (no `git filter-repo` rewrite — build artifacts, no sensitive content).

Steps:
1. Append `.planning/` to `.gitignore`
2. Commit: `chore: gitignore .planning/ — build artifacts not needed by users`

**IMP-18 — `idea.md`**

Decision: delete it. Content is embodied in the product. `idea.md` explicitly names inspiration sources and competitor dynamics not intended for public consumption.

Steps:
1. Extract any positioning language still relevant → insert into README "What it is / What it isn't" section
2. `git rm idea.md`
3. Commit: `chore: remove idea.md — working doc served its purpose, positioning lives in README`

**IMP-20 — `CONTRIBUTING.md`**

Create at repo root with:
- Bug reporting: GitHub Issues
- Feature proposals: open discussion first, then PR
- Dev setup: `git clone https://github.com/ranjanrishikesh/takeToMarket && node --test`
- Code style: zero npm dependencies, CJS for `bin/`, Markdown for skills
- PR requirements: `node --test` must pass, no new npm dependencies

### IMP-21 — Go-public execution

Verify each gate in the IMP-21 checklist is green, then:
```bash
gh repo edit ranjanrishikesh/takeToMarket --visibility public
```

**This is an irreversible public action — requires explicit user confirmation before executing.**

**After going public:**
- IMP-06: Submit marketplace form + open PR to `anthropics/claude-plugins-official` (findings from Wave 4)
- Announce: X, LinkedIn, Hacker News, Claude Discord
- Add GitHub repo topics: `claude-code`, `marketing`, `ai-agents`, `codex`, `gtm`

**Wave 5 files changed:** `.gitignore` (`.planning/` entry), `CONTRIBUTING.md` (new file), `README.md` (positioning extract from idea.md).

---

## Test Coverage

Each wave must pass `node --test` before merging. New behavior to cover in tests:

| Wave | New behavior to test |
|------|---------------------|
| Wave 1 | `registerPlugin()`: creates entry, handles corruption, atomic write, updates `lastUpdated` on reinstall |
| Wave 2 | `promptRuntimeSelection()`: input parsing, "6" expansion, custom path prompt, non-TTY fallback; `confirmInstall()`: y/n/empty handling, --yes bypass; `checkStatus()`: installed vs not installed output |
| Wave 2 | `printInstallSummary()`: skill discovery, description extraction |
| Wave 3 | No new code — visual review only |
| Wave 4 | Per-adapter: unit tests for Cursor/Codex adapters if implemented |
| Wave 5 | No new code — checklist execution |

---

## Version Bump

v2.0.0 on npm after Wave 5 completes and repo is public. Changelog entry to document all 21 improvements.

---

## Files Changed Summary

| File | Wave | Change |
|------|------|--------|
| `.gitignore` | 1, 5 | Add `settings.local.json`, `.planning/` |
| `README.md` | 1, 3, 4 | Fix URLs (W1), full rewrite (W3), finalize Options 2+3 (W4) |
| `install.js` | 1, 2, 4 | `registerPlugin()` (W1), full overhaul (W2), adapter wiring (W4) |
| `.claude-plugin/plugin.json` | 1 | Version bump to 1.0.1 |
| `bin/lib/cursor-adapter.cjs` | 4 | New file (if Cursor adapter implemented) |
| `GEMINI.md` | 4 | Validation annotations |
| `idea.md` | 5 | Deleted |
| `CONTRIBUTING.md` | 5 | New file |
