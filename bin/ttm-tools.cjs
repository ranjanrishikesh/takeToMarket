#!/usr/bin/env node

/**
 * ttm-tools.cjs -- CLI utility for takeToMarket deterministic operations
 *
 * Single entry point with subcommand router. All command implementations
 * live in bin/lib/*.cjs modules. Zero npm dependencies.
 *
 * Usage: node ttm-tools.cjs <command> [args] [--raw]
 *
 * Commands:
 *   slug <text>              Generate URL-safe slug from text
 *   timestamp [format]       Get timestamp (full|date|filename)
 *   init                     Check .marketing/ initialization status
 *   state <read|update>      Read or update .marketing/STATE.md
 *   health                   Validate .marketing/ directory structure
 *   commit <msg> [--files]   Stage files and git commit
 */

'use strict';

const { error, parseNamedArgs } = require('./lib/core.cjs');

const args = process.argv.slice(2);
const raw = args.includes('--raw');
const command = args[0];

switch (command) {
  case 'slug': {
    const { cmdSlug } = require('./lib/slug.cjs');
    cmdSlug(args.slice(1).filter(a => a !== '--raw').join(' '), raw);
    break;
  }
  case 'timestamp': {
    const { cmdTimestamp } = require('./lib/slug.cjs');
    const format = args.slice(1).filter(a => a !== '--raw')[0] || 'full';
    cmdTimestamp(format, raw);
    break;
  }
  case 'init': {
    const { cmdInit } = require('./lib/health.cjs');
    cmdInit(raw);
    break;
  }
  case 'state': {
    const stateArgs = args.slice(1).filter(a => a !== '--raw');
    const subCmd = stateArgs[0];
    const { cmdStateRead, cmdStateUpdate } = require('./lib/state.cjs');
    if (subCmd === 'read') cmdStateRead(raw);
    else if (subCmd === 'update') cmdStateUpdate(stateArgs[1], stateArgs[2], raw);
    else error('state subcommand required: read, update');
    break;
  }
  case 'commit': {
    const { cmdCommit } = require('./lib/commit.cjs');
    const parsed = parseNamedArgs(args.slice(1));
    const files = parsed.named.files
      ? parsed.named.files.split(',')
      : parsed.positional.slice(1);
    cmdCommit(parsed.positional[0], files, raw);
    break;
  }
  case 'health': {
    const { cmdHealth } = require('./lib/health.cjs');
    cmdHealth(raw);
    break;
  }
  default:
    error(
      `Unknown command: ${command || '(none)'}. Available: slug, timestamp, init, state, commit, health`
    );
}
