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

## Step: Legacy folder migration

Before checking version, detect whether the project still uses the legacy
`.marketing/` state directory and offer migration to `.taketomarket/`:

```bash
node "${CLAUDE_PLUGIN_ROOT}/bin/ttm-tools.cjs" legacy-folder check --raw
```

Parse the JSON `state` field:

- **legacy**: prompt the user with `AskUserQuestion`:
  - question: "Migrate `.marketing/` to `.taketomarket/` now? (recommended before upgrade)"
  - options: "Yes, migrate now" / "Skip for now"
  - On Yes:
    ```bash
    node "${CLAUDE_PLUGIN_ROOT}/bin/ttm-tools.cjs" legacy-folder migrate --raw
    ```
  - On Skip: continue with a note that the upgrade will land alongside the legacy folder.
- **conflict**: halt with `ERROR: Both .marketing/ and .taketomarket/ exist. Manual resolution required before upgrade.`
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

3. Compare versions. If a newer version is available (latest > installed), run:
```bash
npx taketomarket@latest --yes
```

4. If already up to date, confirm: "takeToMarket vX.X.X is up to date."
