# Contributing to takeToMarket

## Reporting bugs

Open a GitHub Issue at https://github.com/ranjanrishikesh/takeToMarket/issues.
Include: OS, Node version, runtime (Claude Code/Codex/other), and the exact error output.

## Proposing features

Open a discussion issue first — describe the use case, not the implementation.
Feature PRs without a linked discussion may be closed without review.

## Development setup

```bash
git clone https://github.com/ranjanrishikesh/takeToMarket
cd takeToMarket
node --test   # run full test suite — no install step needed
```

## Code style

- Zero npm dependencies — `bin/` tools use Node.js built-ins only
- CJS (`.cjs`) for all `bin/` scripts — no TypeScript, no transpilation
- Markdown for all skills, workflows, templates, references
- `node --test` must pass before every commit

## Pull request requirements

- `node --test` passes
- No new npm dependencies
- One clear purpose per PR — link to the issue it closes
- Commits follow conventional commit style (`feat:`, `fix:`, `docs:`, `chore:`, `test:`)
