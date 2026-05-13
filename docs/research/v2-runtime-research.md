# takeToMarket v2 — Runtime Research Findings

## R-01: Claude Code installed_plugins.json Schema

**Status:** DONE (inspected 2026-05-13)

**Schema:**
```json
{
  "version": 2,
  "plugins": {
    "<name>@<source>": [{
      "scope": "user",
      "installPath": "<absolute path to plugin dir>",
      "version": "<semver or sha>",
      "installedAt": "<ISO timestamp>",
      "lastUpdated": "<ISO timestamp>",
      "gitCommitSha": "<sha or null>"
    }]
  }
}
```

**Our entry will be:**
- Key: `"taketomarket@npm"`
- scope: `"user"`
- installPath: `~/.claude/plugins/taketomarket` (absolute)
- version: npm version string (e.g., `"2.0.0"`)
- gitCommitSha: `null` (npm installs have no git SHA — verify Claude Code accepts null)

**Open question:** Does Claude Code require non-null gitCommitSha?
Result: [FILL IN after testing in Task 1.3]

---

## R-02: Codex Registration Mechanism

**Status:** DONE (researched 2026-05-14)

**Finding:** Codex CLI supports Agent Skills. Two recognized paths:
- Primary cross-runtime: `~/.agents/skills/<name>/SKILL.md`
- Codex-native: `~/.codex/skills/<name>/SKILL.md`

Both are scanned at session start. SKILL.md format works natively.

**Invocation:** Codex does NOT use slash commands (`/name`) for custom skills. Invocation is model-driven based on task match, or users can reference skills by name in prompts. The `$SkillName` mention syntax is used in some Codex contexts.

**Decision:** Install to BOTH `~/.agents/skills/` (universal) AND `~/.codex/skills/` (belt-and-suspenders). No registration step — file copy only. Post-install message should note `$ttm-*` invocation differs from Claude Code's `/ttm-*`.

**Sources:**
- https://developers.openai.com/codex/skills — official skills docs, lists `$HOME/.agents/skills` as user path
- https://blog.fsck.com/2025/12/19/codex-skills/ — CLI inspection confirming `~/.codex/skills/`

---

## R-03: Cursor Rules Format + Install Path

**Status:** DONE (researched 2026-05-14)

**Finding:** Cursor 2.4+ supports Agent Skills via `~/.cursor/skills/<name>/SKILL.md`. Also reads `~/.agents/skills/` as an alias. SKILL.md format works natively.

**Invocation:** Skills are available as slash commands in Agent chat (`/skill-name`). `disable-model-invocation: true` in frontmatter makes skills only activate on explicit invocation. This is different from `.cursor/rules/` which provides ambient context injection only (no slash commands).

**Decision:** Install to `~/.cursor/skills/ttm-*/SKILL.md`. No registration step. `~/.agents/skills/` also works as universal path.

**Sources:**
- https://cursor.com/docs/skills — official Agent Skills documentation (Cursor 2.4+)
- https://cursor.com/changelog/2-4 — Skills feature launch

---

## R-04: Windsurf Format + Install Path

**Status:** DONE (researched 2026-05-14)

**Finding:** Windsurf supports Agent Skills at `~/.codeium/windsurf/skills/<name>/SKILL.md` (confirmed by official docs). Also reads `~/.agents/skills/`.

**Invocation:** Skills are NOT slash commands in Windsurf. Two activation modes:
1. Automatic — Cascade activates based on description matching
2. Manual — `@skill-name` mention syntax

Slash commands (`/`) in Windsurf are reserved for Workflows (a different feature).

**Decision:** Install to `~/.codeium/windsurf/skills/ttm-*/SKILL.md`. Post-install message must tell Windsurf users to use `@ttm-init` not `/ttm-init`.

**Sources:**
- https://docs.windsurf.com/windsurf/cascade/skills — official Windsurf skills documentation

---

## R-05: Gemini CLI Compatibility

**Status:** DONE (researched 2026-05-14)

**Finding:** Gemini CLI supports Agent Skills at `~/.gemini/skills/<name>/SKILL.md`. Also reads `~/.agents/skills/` as an alias.

**Invocation:** Model-driven activation based on task match. Management via `/skills enable` and `/skills disable`. NOT slash commands.

**Critical requirement:** Both `name:` AND `description:` fields in SKILL.md frontmatter are required. Skills missing either field are silently skipped.

All takeToMarket SKILL.md files have both fields — compatible.

**Decision:** Install to `~/.gemini/skills/ttm-*/SKILL.md`. No registration step. Verify all SKILL.md files have `name:` and `description:` (already confirmed).

**Sources:**
- https://geminicli.com/docs/cli/skills/ — official Gemini CLI Agent Skills documentation
- https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/skills.md — SKILL.md format requirements

---

## R-06: Claude Code Marketplace Requirements (IMP-06a)

**Status:** DONE (researched 2026-05-14)

**Finding:** Marketplace submission is via web form, NOT GitHub PR.

**Submission URLs:**
- https://platform.claude.com/plugins/submit
- https://clau.de/plugin-directory-submission

**Status:** Open submissions (not invite-only as of 2026-05-14).

**Minimum plugin.json for external submission:**
```json
{
  "name": "taketomarket",
  "description": "Marketing OS for Claude Code and Codex",
  "version": "2.1.0",
  "author": { "name": "Rishikesh Ranjan" }
}
```
Optional fields: `homepage`, `repository`, `license`.

**Decision:** Manual submission step (Task 5.7). Submit via form after npm package is stable. The `anthropics/claude-plugins-official` GitHub repo contains the catalog but external submissions go through the form, not PRs.

**Sources:**
- https://code.claude.com/docs/en/plugins — official plugin creation and submission docs
- https://code.claude.com/docs/en/discover-plugins — submission form URLs
- https://github.com/anthropics/claude-plugins-official — marketplace catalog

---

## R-07: GitHub Direct Install Syntax (IMP-07)

**Status:** DONE (researched 2026-05-14)

**Finding:** There is NO single-command `github:` install syntax. Claude Code requires a two-step flow:

**Step 1:** Add the GitHub repo as a marketplace source:
```
/plugin marketplace add ranjanrishikesh/takeToMarket
```
Requires `.claude-plugin/marketplace.json` in the repo.

**Step 2:** Install from that marketplace:
```
/plugin install taketomarket@takeToMarket
```

**Critical caveat:** If `marketplace.json` uses `"source": "github"`, Claude Code clones via SSH only (`git@github.com:`), with NO HTTPS fallback. Users without GitHub SSH keys get "Permission denied". Use `"source": "git"` with HTTPS URL instead to avoid this.

**Syntaxes that do NOT work:**
- `/plugin install github:ranjanrishikesh/takeToMarket` — not supported
- `/plugin install taketomarket@ranjanrishikesh` — not a marketplace name

**README Option 3 wording:**
```
/plugin marketplace add ranjanrishikesh/takeToMarket
/plugin install taketomarket@takeToMarket
```

**Sources:**
- https://code.claude.com/docs/en/discover-plugins — marketplace add syntax
- https://code.claude.com/docs/en/plugin-marketplaces — two-step distribution flow
- https://github.com/anthropics/claude-code/issues/47088 — SSH-only clone bug

---

## Cross-Runtime Note: ~/.agents/skills/ Universal Path

All four non-Claude runtimes (Codex, Cursor, Gemini CLI, Windsurf) recognize `~/.agents/skills/` as a valid path (either primary or alias). Installing to `~/.agents/skills/ttm-*/` once serves all four runtimes without runtime-specific logic.

The takeToMarket installer uses `~/.agents/skills/` as the install target for the "All runtimes" option, in addition to runtime-specific paths for belt-and-suspenders.

---

## IMP-19: History Scan Result

**Date:** 2026-05-13

**Credentials found:** No (false positives only — all keyword matches were in documentation about password managers, authentication workflows, and threat models)

**Local paths found:** Yes — absolute paths to `/Users/rishikeshranjan/` appear in:
- `docs/improvements.md` — references in documentation examples showing expected content structure
- `docs/research/v2-runtime-research.md` — inline markdown links and path examples
- `.planning/phases/*/` files — internal planning notes with absolute path examples
- `package.json` test assertions — hardcoded example paths for context

**Context:** These are NOT secrets or configuration leaks. They appear in:
1. Inline documentation explaining expected file structure
2. Planning artifacts (GSD build notes)
3. Test assertions showing example paths

None are credentials, API keys, or sensitive configuration that would be unsafe to publish.

**Assessment:** Safe to proceed with public release. The local paths in documentation are illustrative examples, not actual configuration files. No .claude/settings.local.json remains in tree (already removed per IMP-16 tracking), and no credentials of any kind found in history.

**Decision:** SAFE TO PROCEED with public release on this criterion.
