---
name: ttm-update
description: >
  Check for takeToMarket updates and upgrade to the latest version. Compares
  installed version against npm registry and runs installer if newer version found.
disable-model-invocation: false
allowed-tools: Bash Read
---

# /ttm-update

Check if takeToMarket needs updating and upgrade if available.

## Step: Detect install method

Detect how the user installed takeToMarket before deciding how to upgrade.
Run this FIRST, before any version or legacy-folder work:

```bash
node "${CLAUDE_PLUGIN_ROOT}/bin/ttm-tools.cjs" install-detect --raw
```

Parse the JSON `method` field. The value will be one of:

- **clone** — installed via `git clone`. Upgrades happen with `git pull` in the
  plugin root, then re-running the installer (`node install.js` or `npx
  taketomarket@latest --yes` from the cloned directory).
- **npm** — installed via `npx taketomarket` or `npm install -g taketomarket`.
  Upgrades happen via `npx taketomarket@latest --yes`.
- **unknown** — could not locate a plugin root. Print manual instructions and
  ask the user where takeToMarket is installed before continuing:
  ```
  Could not auto-detect your takeToMarket install location.
  Manual upgrade options:
    - npm:   npx taketomarket@latest --yes
    - clone: cd <your-clone>; git pull; node install.js
  ```
  Halt the workflow until the user confirms the method to use.

Remember the `method` and `root` values — they are used by the version-check
branching and the skill-file sync step below.

## Step: Legacy folder migration

Before checking version, detect whether the project still uses the legacy
`.marketing/` state directory and offer migration to `.taketomarket/`:

```bash
node "${CLAUDE_PLUGIN_ROOT}/bin/ttm-tools.cjs" legacy-folder check --raw
```

Parse the JSON `state` field:

- **legacy**: print `WARN: Legacy '.marketing/' detected. Migration will rename it to '.taketomarket/'. Recommend committing or backing up first.` then prompt with `AskUserQuestion`:
  - question: "Migrate `.marketing/` to `.taketomarket/` now? (recommended before upgrade)"
  - options: "Yes, migrate now" / "Skip for now"
  - On Yes:
    ```bash
    node "${CLAUDE_PLUGIN_ROOT}/bin/ttm-tools.cjs" legacy-folder migrate --raw
    ```
  - On Skip: continue with a note that the upgrade will land alongside the legacy folder.
- **conflict**: print the error below, then halt before the version check:
  ```
  ERROR: Both .marketing/ and .taketomarket/ exist. Manual resolution required before upgrade.

  To resolve:
    1. Compare contents:  diff -r .marketing .taketomarket
    2. Merge any unique files from .marketing/ into .taketomarket/.
    3. Remove the legacy folder once .taketomarket/ is complete:
       rm -rf .marketing
    4. Re-run /ttm-update to continue the upgrade.
  ```
- **current** or **none**: continue silently.

## Version check

1. Get current installed version:
```bash
cat $HOME/.taketomarket/package.json 2>/dev/null | python3 -c "import sys,json; print(json.load(sys.stdin).get('version','unknown'))" 2>/dev/null || echo "unknown"
```

2. Get latest version from npm:
```bash
npm show taketomarket version 2>/dev/null || echo "unknown"
```

3. Compare versions. If already up to date, confirm
   "takeToMarket vX.X.X is up to date." and skip the install + sync steps below.

4. If a newer version is available, branch by the install `method` detected
   earlier:

   - **clone** — pull the latest source, then reinstall from the cloned directory:
     ```bash
     git -C "<root>" pull --ff-only && node "<root>/install.js"
     ```
     (Substitute the `root` returned from `install-detect`.)
   - **npm** — upgrade via npm:
     ```bash
     npm install -g taketomarket@latest
     ```
     (Falling back to `npx taketomarket@latest --yes` is acceptable if `npm
     install -g` is not desired.)
   - **unknown** — print the manual instructions emitted in the detection step
     and halt. Do NOT attempt an automatic install.

## Step: Skill-file diff + sync

After the install completes (clone or npm), reconcile any user-installed skill
files under `~/.claude/skills/ttm-*/` against the freshly installed source under
`<root>/skills/ttm-*/`. This catches the case where the user edited an installed
skill or where the installer skipped a file.

For each `ttm-*` skill directory present in BOTH locations:

1. Compare files (e.g., `SKILL.md` and any supporting files) between
   `~/.claude/skills/<skill>/` and `<root>/skills/<skill>/`.
2. For every file with a non-trivial diff, show the user a short summary of the
   diff (filename + a few lines of context). Then use `AskUserQuestion` with
   priority `critical`:
   - question: "Overwrite `~/.claude/skills/<skill>/<file>` with the new source?"
   - options: "Yes, overwrite" / "Skip this file" / "Skip remaining files"
3. On "Yes, overwrite": copy the source file over the installed copy.
4. On "Skip remaining files": stop the sync loop and continue to the log step.
5. Track the count of files actually synced.

If `<root>` is `null` (unknown install method), skip this step entirely.

## Step: Append to UPDATE-LOG.md

Record the upgrade outcome in `.taketomarket/UPDATE-LOG.md` (create the file if
it does not exist). Append the following block:

```
## YYYY-MM-DD HH:MM
- Updated from vX.X.X to vY.Y.Y
- Method: <clone|npm>
- Files synced: <count>
- Folder migration: <yes|no>
```

`<yes|no>` reflects whether the legacy-folder migration step actually ran a
rename during this invocation.

## Next steps

See `${CLAUDE_PLUGIN_ROOT}/templates/next-step-footer.md`.
<!-- next-step-footer -->
