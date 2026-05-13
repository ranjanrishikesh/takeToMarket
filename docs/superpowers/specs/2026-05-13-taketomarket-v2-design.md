# takeToMarket v2 — Design Spec

**Date:** 2026-05-13
**Scope:** All 21 improvements from `docs/improvements.md` (IMP-01 through IMP-21)
**Version target:** 2.0.0
**Structure:** 6 sequential waves (Wave 0 = Research, Waves 1–5 = implementation)

---

## Context

takeToMarket v1.0.1 is live on npm. Manual testing (2026-05-13) revealed two critical blockers:

1. **Skills don't appear as slash commands.** The installer never writes to `installed_plugins.json`, so Claude Code ignores the installed plugin directory entirely. `${CLAUDE_PLUGIN_ROOT}` is undefined → every skill fails on invocation.
2. **Silent runtime selection.** Installer auto-picks one runtime with no user input, no confirmation, and no way to install to multiple runtimes in one pass.

Additionally: the repo must be made public and the README must be rewritten before meaningful distribution is possible.

---

## Wave 0 — Research

**Goal:** Lock in all unknowns before any code is written. Every implementation wave depends on Wave 0 findings.

**All research runs before Wave 1.** No implementation begins until all research items have a recorded finding.

Findings are written to `docs/research/v2-runtime-research.md` and used to populate the implementation waves' target maps and schemas.

### R-01 — Verify `installed_plugins.json` schema (Claude Code)

**Already inspected (2026-05-13).** Real schema found on machine:

```json
{
  "version": 2,
  "plugins": {
    "superpowers@claude-plugins-official": [{
      "scope": "user",
      "installPath": "/Users/rishikeshranjan/.claude/plugins/cache/claude-plugins-official/superpowers/5.1.0",
      "version": "5.1.0",
      "installedAt": "2026-04-30T16:49:43.850Z",
      "lastUpdated": "2026-05-06T18:59:36.713Z",
      "gitCommitSha": "6efe32c9e2dd002d0c394e861e0529675d1ab32e"
    }]
  }
}
```

**Key findings:**
- Root is `{ version: 2, plugins: { ... } }` — not a flat object
- User-scope entries have NO `projectPath` (project-scope entries do)
- `installPath` points to the actual plugin dir on disk
- `gitCommitSha` is present on all entries — for npm installs, use `null` or omit if Claude Code tolerates absence
- `version` can be semver string (not SHA-only)

**For takeToMarket's entry (user-scope, npm-installed):**
```json
"taketomarket@npm": [{
  "scope": "user",
  "installPath": "/Users/<user>/.claude/plugins/taketomarket",
  "version": "2.0.0",
  "installedAt": "<ISO timestamp>",
  "lastUpdated": "<ISO timestamp>",
  "gitCommitSha": null
}]
```

**Open question:** Does Claude Code require `gitCommitSha` to be non-null? Must verify by testing — install with `null` and check if skills appear.

### R-02 — Research Codex registration mechanism

**Spike:** Does `~/.codex/plugins/installed_plugins.json` exist? Same schema as Claude Code?

Find by:
- Checking Codex official docs for plugin registration format
- Looking inside `~/.codex/` on machines with Codex installed
- Searching OpenAI Codex CLI repository for plugin loading code

**Expected outcome:** Either same schema → extend `registerPlugin()`, or different schema → implement `registerCodexPlugin()`, or no registration mechanism → copy-only with note.

### R-03 — Cursor: rules format + correct install path

**Spike:** What is the correct path and format for user-level Cursor rules?

- Project-level rules: `.cursor/rules/*.mdc` (inside each project)
- User-level rules: location unknown — may be in Cursor app settings, not filesystem
- `.mdc` frontmatter schema: research required

Find by: Cursor official docs, `~/.cursor/` filesystem inspection, community resources.

**Expected outcome:** Either user-level rules path confirmed + mdc format documented → implement adapter, or no user-level equivalent → mark "coming soon."

### R-04 — Windsurf: rules format + install path

**Spike:** Does Windsurf have a skills/commands system? Where does it look for user-level rules?

- Check `~/.codeium/windsurf/` structure
- Windsurf official docs for rules/memory system

**Expected outcome:** Either confirmed format → design adapter, or no standardized format → mark "coming soon."

### R-05 — Gemini CLI: existing GEMINI.md compatibility

**Spike:** Does the existing `GEMINI.md` in the repo actually work with Gemini CLI?

Steps:
- Install Gemini CLI
- Copy `GEMINI.md` to the Gemini CLI config location
- Run `ttm-init` flow
- Record: which tools are missing, which prompts fail, UX differences vs Claude Code

**Note:** Requires Gemini CLI installed on machine — this is an environment prerequisite. If Gemini CLI access is not available, spike is blocked; document and defer IMP-11.

**Expected outcome:** Updated `GEMINI.md` with validation status, or known-gap list.

### R-06 — Marketplace submission requirements (IMP-06a)

**Spike:** What does `anthropics/claude-plugins-official` require for external plugin listing?

- Fetch `https://github.com/anthropics/claude-plugins-official` repo structure
- Find `/external_plugins/` directory format and `plugin.json` schema
- Find submission form and review criteria

**Deliverable from Wave 0:** Prepared `plugin.json` file ready to submit. PR draft ready. Cannot submit until repo is public (Wave 5 gate).

### R-07 — GitHub direct install syntax (IMP-07)

**Spike:** Does Claude Code support `/plugin install github:owner/repo` or `/plugin install name@owner`?

- Check Claude Code docs for direct GitHub install syntax
- Test both forms if possible before repo is public

**Deliverable:** Confirmed syntax or "not supported" finding. README Option 3 is written based on this.

---

## Wave 1 — Safety + Critical Blockers

**Items:** IMP-16, IMP-15, IMP-02
**Depends on:** Wave 0 (R-01 schema verified)

### IMP-16 — Untrack `settings.local.json`

`.claude/settings.local.json` is tracked in git and contains absolute paths with local username. This leaks local filesystem layout to every repo cloner.

**Steps:**
1. Append to `.gitignore`: `.claude/settings.local.json`
2. `git rm --cached .claude/settings.local.json`
3. Commit: `chore: gitignore settings.local.json — prevents leaking local filesystem paths`

### IMP-15 — Fix wrong GitHub URL

README and install.js both reference `github.com/taketomarket/taketomarket` — this org/repo does not exist.

**Fix everywhere:**
- `README.md`: all instances → `https://github.com/ranjanrishikesh/takeToMarket`
- `install.js` success message URL → `https://github.com/ranjanrishikesh/takeToMarket#readme`
- `.claude-plugin/plugin.json`: bump version from `"0.1.0"` to `"1.0.1"`

### IMP-02 — Register in `installed_plugins.json`

**The core fix.** Verified schema (Wave 0 R-01). New function `registerPlugin(installPath, version)`:

```js
function registerPlugin(installPath, version) {
  const registryPath = path.join(os.homedir(), '.claude', 'plugins', 'installed_plugins.json');
  const pluginsDir = path.dirname(registryPath);

  // Read existing registry
  let registry = { version: 2, plugins: {} };
  if (fileExists(registryPath)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
      registry = parsed;
      if (!registry.plugins) registry.plugins = {};
    } catch {
      // Corrupted — back up and start fresh
      fs.renameSync(registryPath, registryPath + '.bak');
      console.warn('Warning: installed_plugins.json was corrupted. Backed up to .bak and recreated.');
      registry = { version: 2, plugins: {} };
    }
  }

  const now = new Date().toISOString();
  const existing = (registry.plugins['taketomarket@npm'] || [])[0];

  registry.plugins['taketomarket@npm'] = [{
    scope: 'user',
    installPath,
    version,
    installedAt: existing?.installedAt ?? now,
    lastUpdated: now,
    gitCommitSha: null,   // npm installs have no git SHA
  }];

  // Atomic write
  const tmpPath = registryPath + '.tmp';
  fs.mkdirSync(pluginsDir, { recursive: true });
  fs.writeFileSync(tmpPath, JSON.stringify(registry, null, 2) + '\n', 'utf8');
  fs.renameSync(tmpPath, registryPath);

  console.log('  Registered in installed_plugins.json');
}
```

**Note on `gitCommitSha: null`:** Must verify during implementation that Claude Code accepts `null` (vs requiring a non-null SHA). If it rejects `null`, omit the field entirely.

Called after file copy succeeds, Claude Code runtime only. Codex registration is Wave 4 IMP-12 based on Wave 0 R-02 findings.

**Wave 1 files changed:** `.gitignore`, `README.md`, `install.js`, `.claude-plugin/plugin.json`

---

## Wave 2 — Installer Overhaul

**Items:** IMP-01, IMP-03, IMP-04, IMP-05
**Depends on:** Wave 0 (runtime paths and formats needed to build install target map)

### IMP-01 — Interactive runtime selection

Replace `detectRuntime()` with `promptRuntimeSelection(args)`.

**Flow:**
1. If `--runtime <name>` flag present → use it (legacy compat, single runtime, no prompt)
2. If non-TTY stdin (CI/pipe) → auto-detect (check `~/.claude/`, `~/.codex/`) + print warning that interactive selection was skipped
3. If interactive TTY → show multi-select prompt

**Prompt:**
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
- `6` → expand to [1,2,3,4,5]
- `7` → secondary prompt: `Enter install path:` → custom target
- Invalid input → re-prompt once, then exit with error + GitHub Issue link

**Runtime validation:** Before installing to each target, check if the runtime's parent dir exists (e.g., `~/.claude/` for Claude Code). If missing:
```
Warning: Claude Code doesn't appear to be installed (~/.claude not found).
Installing anyway — files will be ready when you install Claude Code.
```
Then proceed with the install.

**Failure handling:** If a runtime's install fails, skip that runtime and continue with the others. Report failures in the final summary. Always print:
```
Something went wrong? File an issue: https://github.com/ranjanrishikesh/takeToMarket/issues
```

**Install target map** (paths subject to Wave 0 research — update if Wave 0 finds different paths):

| Runtime | Plugin dir | Registration | Notes |
|---------|-----------|-------------|-------|
| Claude Code | `~/.claude/plugins/taketomarket/` | `installed_plugins.json` (IMP-02) | Fully implemented |
| Codex | `~/.codex/plugins/taketomarket/` | Wave 4 IMP-12 (based on Wave 0 R-02) | Copy only in Wave 2 |
| Cursor | Wave 0 R-03 finding | Wave 4 IMP-09 | Show "[partial]" in Wave 2 |
| Windsurf | Wave 0 R-04 finding | Wave 4 IMP-10 | Show "[partial]" in Wave 2 |
| Gemini CLI | Wave 0 R-05 finding | Wave 4 IMP-11 | Show "[partial]" in Wave 2 |
| Custom | user-typed path | None | Always supported |

For Wave 4 runtimes (Cursor, Windsurf, Gemini, Codex): installer copies files to the researched path and prints `[PARTIAL] <Runtime>: files copied — slash command registration coming in a future update`.

Result: `promptRuntimeSelection()` returns `[{ name, dir, register }]`. Copy + registration loop runs once per target.

**Implementation:** Pure Node.js `readline` — zero npm dependencies.

### IMP-03 — Confirmation prompt

Fires after runtime selection, before any file writes. Skipped with `--yes` / `-y`.

```
takeToMarket vX.X.X — Marketing OS for Claude Code

This will install to:
  ~/.claude/plugins/taketomarket/    (Claude Code)
  ~/.cursor/rules/                   (Cursor)

Proceed? [Y/n]:
```

Version shown dynamically from `VERSION` constant — never hardcoded.
Empty input or `y`/`Y` → proceed. `n`/`N` → `Installation cancelled.` + `process.exit(0)`.

**New function:** `confirmInstall(targets, version, yesFlag)` → returns boolean.

### IMP-04 — `--check` / `--status` flag

`npx taketomarket --check` → inspect install state without writing.

Checks ALL known runtimes (not just what user originally installed to — gives full picture of machine state):

```
takeToMarket vX.X.X

Claude Code: INSTALLED (27 skills, ~/.claude/plugins/taketomarket)
  registered: yes (installed_plugins.json)
Codex:       NOT INSTALLED
Cursor:      NOT INSTALLED
Windsurf:    NOT INSTALLED
Gemini CLI:  NOT INSTALLED

Run `npx taketomarket` to install or reinstall.
```

**New function:** `checkStatus(version)` — reads state, prints table, `process.exit(0)`.

### IMP-05 — Post-install summary

After all targets complete (success or skip), print all slash commands.

**Skill discovery:** Scan `PACKAGE_ROOT/skills/` (npm package source — `__dirname/skills/`) for directories containing `SKILL.md`. This path is always correct regardless of runtime, since the npm package is always present. Sort alphabetically. Print as `/taketomarket:<dirname>`.

Description per command: first line of `description:` YAML frontmatter from the skill's `SKILL.md`.

**New function:** `printInstallSummary()` — no `targetDir` param, reads from `PACKAGE_ROOT`.

### IMP-05 — Update `--help` text

Add new flags to the help output:
```
Options:
  --runtime <claude|codex>  Target runtime, skip interactive prompt (default: prompt)
  --check                   Show install status without installing
  --yes, -y                 Skip confirmation prompt (for CI/scripted use)
  --dry-run                 Validate source without writing files
  --version, -v             Print version
  --help, -h                Show this help message
```

**Wave 2 files changed:** `install.js` only. New functions: `promptRuntimeSelection()`, `confirmInstall()`, `checkStatus()`, `printInstallSummary()`. `main()` refactored. `--help` text updated.

---

## Wave 3 — README Overhaul

**Items:** IMP-08, IMP-13, IMP-14, IMP-15 (IMP-15 already done in Wave 1)
**Depends on:** Wave 0 R-07 (to know whether Options 2+3 in README are verified or placeholders)

**Goal:** Rewrite README so any user can go from "found this repo" to "running first campaign" without additional help.

**New README structure:**

```
# takeToMarket

## What it is / What it isn't
IS: marketing OS with positioning enforcement, quality gate walls, compound learnings.
IS NOT: content generator, one-click blog writer, social media scheduler.

## Requirements
- Node.js 18+
- Claude Code v1.x+ (or Codex)
- git

## Installation

### Option 1 — npx (recommended)
npx taketomarket
# Interactive: asks which tool(s) you use, installs to all selected

### Option 2 — Claude Code plugin marketplace
# [pending marketplace approval — status updated when available]
/plugin install taketomarket@claude-plugins-official

### Option 3 — Direct from GitHub (Claude Code)
# [syntax verified/updated based on Wave 0 R-07 findings]
/plugin install taketomarket@ranjanrishikesh

### Option 4 — Manual (advanced)
git clone https://github.com/ranjanrishikesh/takeToMarket
cd takeToMarket && node install.js

## Quick Start
/taketomarket:ttm-init             # set up workspace (one time)
/taketomarket:ttm-new-campaign     # create first campaign
/taketomarket:ttm-produce          # run production wave

## Campaign Lifecycle
[numbered list showing full campaign flow]

## Command Reference
[table: 27 rows — command | description]

## Verify Installation
/taketomarket:ttm-health
```

**Campaign lifecycle** — the phase count in improvements.md says "9-phase" but lists 11 steps. Drop the count in README; just show the flow as a numbered list without a total count:

```
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
```

**Command reference table** — 27 skills, descriptions from SKILL.md frontmatter:

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

## Wave 4 — Multi-Runtime Implementation

**Items:** IMP-06a (prep), IMP-07 (finalize), IMP-09, IMP-10, IMP-11, IMP-12
**Depends on:** Wave 0 findings for each item

Each item's implementation is fully defined by its Wave 0 research spike findings. Wave 4 work is: take the findings → implement or document.

### IMP-12 — Codex registration (based on Wave 0 R-02)

- If same schema as Claude Code → extend `registerPlugin(runtime, installPath, version)` to handle both
- If different schema → implement `registerCodexPlugin(installPath, version)`
- If no mechanism → add note to `checkStatus()` output and README

### IMP-09 — Cursor adapter (based on Wave 0 R-03)

- If user-level rules path confirmed + `.mdc` format documented → write `bin/lib/cursor-adapter.cjs` that converts each `skills/ttm-*/SKILL.md` to the correct `.mdc` format; wire into installer Cursor target
- If only project-level rules exist → write adapter but document that user must run installer per project
- If no equivalent → update installer to show "[not supported]" instead of "[partial]" for Cursor; document in README

### IMP-10 — Windsurf adapter (based on Wave 0 R-04)

- If standardized format confirmed → design and implement adapter
- If no format → update installer to show "[not supported]" for Windsurf; document in README

### IMP-11 — Gemini CLI (based on Wave 0 R-05)

- Update `GEMINI.md` with confirmed-working and known-gap annotations
- Fix any gaps addressable in `GEMINI.md` without code changes

### IMP-06a — Marketplace PR preparation (Wave 0 R-06 deliverable carried forward)

- Create prepared `plugin.json` for `anthropics/claude-plugins-official` submission
- PR is drafted but NOT submitted — submission requires public repo (Wave 5 gate)

### IMP-07 — Finalize README Options 2+3 (based on Wave 0 R-07)

- Update README with verified GitHub direct install syntax
- If syntax doesn't work: remove Option 3 from README

**Wave 4 files changed:** `install.js` (runtime adapters + registration), `bin/lib/cursor-adapter.cjs` (if Cursor adapter), `GEMINI.md`, `README.md` (Options 2+3 finalized).

---

## Wave 5 — Go-Public Checklist

**Items:** IMP-17, IMP-18, IMP-19, IMP-20, IMP-21, IMP-06b

**Executed in strict order. All required items before optional.**

### Required blockers (must complete before flipping public)

Verify all prior waves' blockers are complete:
- IMP-16 done (Wave 1): `.claude/settings.local.json` not tracked
- IMP-02 done (Wave 1): installer registers in `installed_plugins.json`
- IMP-15 done (Wave 1): README URLs are correct
- IMP-14 done (Wave 3): how-to-use section exists

**IMP-19 — Scan git history for secrets**

```bash
git log --all --full-history -p | grep -iE "(api_key|secret|password|token|sk-|Bearer)" | grep -v "^--" | head -30
git log --all --full-history -p | grep "/Users/rishikeshranjan" | grep -v "^--" | head -20
```

- Credentials found → `git filter-repo` scrub (do NOT use deprecated `git filter-branch`)
- Local paths only → acceptable; document as no credentials exposed
- Clean → proceed

### Recommended before public

**IMP-17 — `.planning/` directory**

Add to `.gitignore` going forward; leave existing history intact (build artifacts, no sensitive content):
1. Append `.planning/` to `.gitignore`
2. Commit: `chore: gitignore .planning/ — build artifacts not needed by users`

**IMP-18 — `idea.md`**

Delete. Extract any relevant positioning → README "What it is / What it isn't":
1. Read `idea.md`, extract positioning language worth keeping
2. Insert into README
3. `git rm idea.md`
4. Commit: `chore: remove idea.md — working doc served its purpose`

**IMP-20 — `CONTRIBUTING.md`**

Create at repo root:
- Bug reporting: GitHub Issues at `https://github.com/ranjanrishikesh/takeToMarket/issues`
- Feature proposals: open discussion first, then PR
- Dev setup: `git clone https://github.com/ranjanrishikesh/takeToMarket && node --test`
- Code style: zero npm dependencies, CJS for `bin/`, Markdown for skills
- PR requirements: `node --test` must pass, no new npm dependencies

### IMP-21 — Go-public execution

Verify all blockers green, then:
```bash
gh repo edit ranjanrishikesh/takeToMarket --visibility public
```

**Irreversible. Requires explicit user confirmation before executing.**

### IMP-06b — Marketplace submission (post-public)

After repo is public:
- Submit the prepared `plugin.json` (Wave 4 IMP-06a deliverable)
- Submit form at `https://clau.de/plugin-directory-submission`
- Open PR to `anthropics/claude-plugins-official`
- Update README Option 2 status

### After going public
- Announce: X, LinkedIn, Hacker News, Claude Discord
- Add GitHub repo topics: `claude-code`, `marketing`, `ai-agents`, `codex`, `gtm`

**Wave 5 files changed:** `.gitignore` (`.planning/`), `CONTRIBUTING.md` (new), `README.md` (IMP-18 positioning extract, IMP-06b status update).

---

## Error Handling Pattern

Any error during install (runtime copy fail, registration fail, validation fail) must:
1. Log the specific failure with runtime name
2. Skip that runtime and continue with others
3. Print final summary showing successes and failures
4. Always end with:
```
Something went wrong? File an issue: https://github.com/ranjanrishikesh/takeToMarket/issues
```

Exit 0 if at least one runtime installed successfully. Exit non-zero if all runtimes failed.

---

## Test Coverage

Each wave passes `node --test` before merging.

| Wave | New behavior to test |
|------|---------------------|
| Wave 1 | `registerPlugin()`: correct `registry.plugins` nesting, preserves `registry.version`, creates entry, handles corruption, atomic write, updates `lastUpdated` on reinstall, `gitCommitSha: null` |
| Wave 2 | `promptRuntimeSelection()`: comma-parsing, "6" expansion, custom path, non-TTY fallback, invalid input re-prompt; `confirmInstall()`: y/n/empty/--yes; `checkStatus()`: all runtimes checked; `printInstallSummary()`: reads from PACKAGE_ROOT/skills/ |
| Wave 3 | No new code — visual review only |
| Wave 4 | Per-adapter unit tests if implemented (Cursor, Codex) |
| Wave 5 | No new code — checklist execution |

---

## Version Bump

`package.json` bumps to `2.0.0` when Wave 5 completes and repo is public. `CHANGELOG.md` created with all 21 improvements listed. `plugin.json` bumped to match.

---

## Files Changed Summary

| File | Wave | Change |
|------|------|--------|
| `docs/research/v2-runtime-research.md` | 0 | Research findings (new file) |
| `.gitignore` | 1, 5 | Add `settings.local.json` (W1), `.planning/` (W5) |
| `README.md` | 1, 3, 4, 5 | Fix URLs (W1), full rewrite (W3), Options 2+3 (W4), IMP-18 extract (W5) |
| `install.js` | 1, 2, 4 | `registerPlugin()` (W1), full overhaul (W2), adapter wiring (W4) |
| `.claude-plugin/plugin.json` | 1 | Version bump to 1.0.1 |
| `bin/lib/cursor-adapter.cjs` | 4 | New file (if Cursor adapter implemented) |
| `GEMINI.md` | 4 | Validation annotations |
| `idea.md` | 5 | Deleted |
| `CONTRIBUTING.md` | 5 | New file |
| `CHANGELOG.md` | 5 | New file |
| `package.json` | 5 | Version bump to 2.0.0 |
