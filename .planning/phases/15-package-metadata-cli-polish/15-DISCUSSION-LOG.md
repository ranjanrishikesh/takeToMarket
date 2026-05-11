# Phase 15: Package Metadata & CLI Polish - Discussion Log

**Date:** 2026-05-11
**Mode:** discuss (auto)

## Areas Considered

Phase is mostly mechanical (metadata field additions per spec). Real gray areas:
1. GitHub URL — taken from REQUIREMENTS.md PKG-01 spec
2. Author field format — string vs object
3. Keyword expansion list
4. --version impl — runtime read vs hardcode
5. LICENSE copyright holder
6. Banner format

## User Selection

Auto mode active + prior-phase pattern: user delegated to Claude. No interactive Q&A — Claude locked all decisions per spec + npm conventions + git config.

## Locked Decisions

See `15-CONTEXT.md` `<decisions>` block D-01 through D-15.

Summary:
- GitHub URL `https://github.com/rishikeshranjan/takeToMarket` (from PKG-01 spec)
- Author = `"Rishikesh Ranjan <59333266+ranjanrishikesh@users.noreply.github.com>"` (git config)
- 12 keywords (5 existing + 7 discovery terms)
- `agents/` added to files[]; `.npmignore` for tarball leak prevention
- LICENSE unchanged ("takeToMarket Contributors" — open-source generic)
- `--version` reads `require('./package.json').version` runtime — single source of truth
- Banner becomes `takeToMarket installer v${VERSION}` (minimal change at install.js:203)
- 2 new e2e tests (--version + banner) + 1 manifest guard test

## Deferred Ideas

- README polish, CHANGELOG, --help, npm provenance, alt distribution channels

## Items for Planner Verification

- Confirm GitHub URL exists / is correct (planner can fetch)
- Confirm npm pack --dry-run output matches expected file list

---
*Phase: 15-package-metadata-cli-polish*
