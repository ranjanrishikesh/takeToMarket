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

**Status:** TODO

**Find:**
- Does ~/.codex/plugins/installed_plugins.json exist?
- What is its schema?
- Source: OpenAI Codex CLI docs / GitHub / filesystem inspection

**Result:** [FILL IN]
**Decision:** [ ] Same schema as Claude Code → extend registerPlugin()
             [ ] Different schema → implement registerCodexPlugin()
             [ ] No mechanism → copy-only, add note to README

---

## R-03: Cursor Rules Format + Install Path

**Status:** TODO

**Find:**
- What path does Cursor use for user-level rules? (~/.cursor/rules/ ?)
- .mdc frontmatter schema
- Does Cursor support slash commands or only ambient rules?
- Source: Cursor official docs, ~/.cursor/ filesystem inspection

**Result:** [FILL IN]
**User-level install path:** [FILL IN]
**Decision:** [ ] Slash commands supported → full adapter
             [ ] Ambient rules only → single condensed .mdc
             [ ] No equivalent → mark "not supported"

---

## R-04: Windsurf Format + Install Path

**Status:** TODO

**Find:**
- Does Windsurf have a skills/commands system?
- Install path? (~/.codeium/windsurf/ ?)
- Source: Windsurf docs, filesystem inspection

**Result:** [FILL IN]
**Decision:** [ ] Format confirmed → implement adapter
             [ ] No format → mark "not supported"

---

## R-05: Gemini CLI Compatibility

**Status:** TODO

**Find:**
- Install Gemini CLI (prerequisite — if access unavailable, document and defer IMP-11)
- Run ttm-init flow with existing GEMINI.md
- Which tools are missing? Which prompts fail?

**Result:** [FILL IN — list working skills and gaps]

---

## R-06: Claude Code Marketplace Requirements (IMP-06a)

**Status:** TODO

**Find:**
- Fetch https://github.com/anthropics/claude-plugins-official — check /external_plugins/ directory
- Required plugin.json schema for external entries
- Submission form URL + review criteria

**Result:** [FILL IN]
**Prepared plugin.json:** [FILL IN or attach file path]

---

## R-07: GitHub Direct Install Syntax (IMP-07)

**Status:** TODO

**Find:**
- Does /plugin install taketomarket@ranjanrishikesh work?
- Does /plugin install github:ranjanrishikesh/takeToMarket work?
- Source: Claude Code docs

**Result:** [FILL IN]
**README Option 3 wording:** [FILL IN or "remove Option 3"]

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
