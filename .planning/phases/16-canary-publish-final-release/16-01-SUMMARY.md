---
phase: 16-canary-publish-final-release
plan: 01
subsystem: release
tags: [npm-publish, canary, release, 2fa-passkey, smoke-test]

requires:
  - phase: 15-package-metadata-cli-polish
    provides: complete npm metadata + --version flag + .npmignore tarball filter
provides:
  - taketomarket@0.1.0 (canary dist-tag) live on npm registry
  - taketomarket@1.0.0 (latest dist-tag) live on npm registry
  - npm 2FA (auth-and-writes mode, passkey/WebAuthn) on publisher account
  - git tag v1.0.0 pushed to origin
affects: [v1.1-release]

tech-stack:
  added: []
  patterns: [interactive-publish-with-manual-2fa, dist-tag-canary-then-latest, isolated-HOME-smoke-tests]

key-files:
  created: [.planning/phases/16-canary-publish-final-release/16-01-SUMMARY.md]
  modified: [package.json, test/package-metadata.test.cjs]

key-decisions:
  - "Bash tool is non-TTY → cannot complete WebAuthn passkey browser flow. Both npm publish + npm dist-tag rm executed from user's terminal manually."
  - "npm pkg fix stripped './install.js' → 'install.js' in bin field (npm normalizes); applied + committed before canary publish."
  - "Phase 15 manifest guard pinned version === '0.1.0'. Phase 16 bump broke it. Relaxed to semver regex pattern instead of a hard-coded value."
  - "npm 11.6.2 npx --package=taketomarket (no version pin) -- taketomarket fails with EXIT 127. Same form with @latest works. D-15 strict text could not be satisfied via no-pin form; D-15 intent (latest resolves to 1.0.0) verified via npm view dist-tags + @latest pin smoke."

requirements-completed: [PUB-02, PUB-03, PUB-04, PUB-05, PUB-06]

duration: 1h 35m (interactive, includes user-side passkey flows)
completed: 2026-05-11
---

# Phase 16 Plan 01: Canary Publish & Final Release Summary

**taketomarket@0.1.0 (canary) + taketomarket@1.0.0 (latest) live on npmjs.org. PRIMARY OWNER = `ranjanrishikesh`. 2FA = `auth-and-writes` via passkey/WebAuthn. v1.0.0 tag pushed to origin.**

## Identity (Task 1, 2)

- **PRIMARY OWNER:** `ranjanrishikesh` (verified via `npm whoami`)
- **2FA mode:** `auth-and-writes` (passkey/WebAuthn — `npm profile get` shows "two-factor auth: auth-and-writes")
- **Account created:** 2026-05-11T19:30:14.501Z
- **2FA enabled:** 2026-05-11T19:38:35.826Z

## Canary Publish (Task 3, 4)

- **Pre-publish guard (T3):** tarball composition matched Phase 15 baseline (123 files, agents/ present, no .planning/.git/.marketing/.test/ leakage); full test suite 141/141 pass; version baseline 0.1.0 confirmed.
- **bin path normalization:** initial publish attempt warned `bin[taketomarket] script name install.js was invalid` because npm strips leading `./`. Applied `npm pkg fix` → `"./install.js"` → `"install.js"`. Committed as `789ec23`.
- **Publish command:** `npm publish --tag canary --access public` (ran from user's terminal; Bash tool can't do WebAuthn passkey browser hand-off)
- **Registry confirmed at:** 2026-05-11T19:59Z (first `npm view` attempt succeeded)
- **Tarball:** `taketomarket-0.1.0.tgz`, 195.5 kB packed, 638.2 kB unpacked, 123 files
- **Documented deviation (D-05):** npm forces `latest` dist-tag on first publish (registry policy — package must always have a `latest`). Attempted `npm dist-tag rm taketomarket latest` from user's terminal; registry returned `400 Bad Request` (DELETE on latest forbidden). T7 publish naturally overwrote `latest=0.1.0` → `latest=1.0.0`, achieving D-05 end-state.

## Canary Smoke (Task 5) — closes PUB-03 + PUB-04

- **Pattern:** isolated `HOME=$(mktemp -d)` per smoke; banner + `[DRY RUN] No files written.` substring match.
- **npx smoke:** `npx --yes --package=taketomarket@canary -- taketomarket --dry-run` → PASS attempt 1/3, banner `takeToMarket installer v0.1.0` present, no HOME leak
- **pnpm dlx smoke:** `pnpm dlx taketomarket@canary --dry-run` → PASS attempt 1/3, banner present, no HOME leak
- **Implementation note:** macOS lacks GNU `timeout`. Used `perl -e 'alarm SEC; exec @ARGV'` wrapper for cancellable subprocess. (Later removed when perl-exec wrapper proved to break npx bin resolution in T7 — see deviation below.)

## Bump 0.1.0 → 1.0.0 (Task 6) — preps PUB-05

- **Command:** `npm version major --no-git-tag-version`
- **Commit:** `0c48409` (`chore(16): bump version to 1.0.0 for final release`)
- **Post-bump regression:** Phase 15 manifest guard at `test/package-metadata.test.cjs:97` failed — it pinned `version === '0.1.0'` to prevent premature bumps. Phase 16 now owns the bump, so the assertion is stale. Relaxed to semver regex: `assert.match(pkg.version, /^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/);`. Commit `3912124`.
- **Post-fix tests:** 141/141 pass, 51 suites, 0 fail

## Final Publish (Task 7) — closes PUB-05

- **Command:** `npm publish --access public` (no `--tag` flag → defaults to `latest`; ran from user's terminal for passkey)
- **Registry confirmed at:** 2026-05-11T20:05Z
- **dist-tags after:** `{ canary: '0.1.0', latest: '1.0.0' }`
- **Final smoke:** `npx --yes --package=taketomarket@latest -- taketomarket --dry-run` → exit 0, banner `takeToMarket installer v1.0.0` present, 123-file validation block present, `[DRY RUN] No files written.` present, no HOME leak
- **Documented deviation (D-15):** D-15 strict text says "final smoke with NO version pin resolves 1.0.0". The form `npx --yes --package=taketomarket -- taketomarket --dry-run` (no pin) fails with EXIT 127 / `command not found` on npm 11.6.2 — appears to be an npx bin-resolution quirk specific to no-pin + `--package=` combinations. Verified the SAME form WITH `@latest` works → resolves to 1.0.0 banner. D-15 INTENT (latest dist-tag resolves to 1.0.0 for real users running `npx taketomarket`) is verified via:
  1. `npm view taketomarket dist-tags` → `latest: 1.0.0` ✓
  2. `npx --yes --package=taketomarket@latest -- taketomarket --dry-run` → banner v1.0.0 ✓
  3. `npm install taketomarket && node_modules/.bin/taketomarket --version` → `1.0.0` ✓
- **Tarball:** `taketomarket-1.0.0.tgz`, 195.5 kB packed, 638.2 kB unpacked, 123 files

## Git Tag (Task 8)

- **Local tag created at:** commit `3912124` (HEAD after bump + manifest-guard fix)
- **Tag SHA:** `3912124b586413991b41e8908141a28047afab66` (local) / `0c18dae9fd2cdade6f7b82ba3784ab0c56221a67` (remote — different SHA due to GitHub's tag wrapping)
- **Push:** user signaled "1" (push) → `git push origin main` + `git push --tags` executed from this session
- **Remote tag verified:** `git ls-remote --tags origin v1.0.0` returns `0c18dae9fd2cdade6f7b82ba3784ab0c56221a67	refs/tags/v1.0.0`

## Live Verification (end-of-phase)

```bash
$ npm view taketomarket@0.1.0 version
0.1.0
$ npm view taketomarket@1.0.0 version
1.0.0
$ npm view taketomarket dist-tags
{ canary: '0.1.0', latest: '1.0.0' }
$ npm profile get | grep "two-factor"
two-factor auth: auth-and-writes
```

## Issues Encountered

1. **Bash tool isn't a TTY → WebAuthn flow fails.** npm 2FA on this account is passkey/WebAuthn (npm stopped allowing new TOTP enrollments in late 2025). `npm publish` from the Bash tool fails EOTP because the CLI can't open a browser tab for the user to confirm. **Workaround:** every 2FA-gated command (`npm publish`, `npm dist-tag rm`) ran from the user's own terminal. Required ~3 user round-trips during the phase.
2. **`bin` path auto-correction warning during first publish.** Resolved with `npm pkg fix` (789ec23) before any tarball reached the registry.
3. **Phase 15 manifest-guard test pinned version to 0.1.0**, broke after T6 bump. Relaxed to semver regex (3912124).
4. **`latest` dist-tag forced on first publish.** Registry refuses DELETE on latest (400 Bad Request). Resolved naturally when T7 published 1.0.0 to latest.
5. **npm 11.6.2 npx bug with no-pin `--package=`** — same form works with `@latest` or `@canary` dist-tag pin. Documented in deviation under T7.
6. **Metadata mismatch found post-publish:** package.json `repository.url` says `github.com/rishikeshranjan/takeToMarket` but actual remote is `github.com/ranjanrishikesh/takeToMarket`. The published 1.0.0 has the wrong GitHub link on the npm page. To be fixed in a follow-up phase (cannot be retroactively changed in the published 1.0.0 tarball; will land in 1.0.1 if/when one ships).

## User Setup Captured for Memory

- npm username: `ranjanrishikesh`
- npm 2FA: passkey/WebAuthn, auth-and-writes mode
- GitHub username: `ranjanrishikesh` (not `rishikeshranjan` as previously assumed in REQUIREMENTS.md PKG-01)

## Next Phase Readiness

v1.1 ROADMAP complete. Phase 16 is the final phase in this milestone.

Suggested next steps (outside this phase):
- Follow-up: fix `repository.url` mismatch (1.0.1 patch publish) — would close the metadata-mismatch issue logged above
- Follow-up: README polish (deferred to Phase 17+)
- Follow-up: announcement post

## Self-Check: PASSED (with documented deviations)

- [x] taketomarket@0.1.0 live on npm, canary dist-tag set (PUB-02)
- [x] npx --yes --package=taketomarket@canary -- taketomarket --dry-run works in isolated HOME (PUB-03)
- [x] pnpm dlx taketomarket@canary --dry-run works in isolated HOME (PUB-04)
- [x] taketomarket@1.0.0 live on npm, latest dist-tag = 1.0.0 (PUB-05)
- [x] npm 2FA auth-and-writes enabled (PUB-06)
- [x] Local repo version 1.0.0, HEAD commit = post-bump, v1.0.0 tag pushed to origin
- [~] D-05 latest-tag-stays-unset-until-1.0.0 invariant: relaxed (npm registry forces latest on first publish; DELETE-latest returns 400) — end-state correct (latest=1.0.0)
- [~] D-15 no-pin npx form: works with @latest pin, not with no-pin (npm 11.6.2 cli quirk); end-state correct (latest dist-tag resolves to 1.0.0)
- [x] SUMMARY.md committed

---
*Phase: 16-canary-publish-final-release*
*Completed: 2026-05-11*
