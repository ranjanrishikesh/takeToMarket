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
 *   init                     Check .taketomarket/ initialization status
 *   state <read|update>      Read or update .taketomarket/STATE.md
 *   campaign <sub> [args]    Campaign operations (init, state, update, list)
 *   drift-log <sub> [args]   Drift log operations (append, deprecation)
 *   health                   Validate .taketomarket/ directory structure
 *   commit <msg> [--files]   Stage files and git commit
 *   scan-codebase            Detect stack, monorepo, feature candidates
 *   config <read|set>        Read or set .taketomarket/CONFIG.md
 *   svg-render <in> <out>    Render SVG file to PNG via local converter
 */

'use strict';

const { error, parseNamedArgs } = require('./lib/core.cjs');

const args = process.argv.slice(2);
const raw = args.includes('--raw');
const command = args[0];

function ensureMigratedOrExit() {
  const { requireMigratedState } = require('./lib/legacy-folder.cjs');
  const result = requireMigratedState(process.cwd());
  if (!result.ok) {
    process.stderr.write('Error: ' + result.message + '\n');
    process.exit(2);
  }
}

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
    ensureMigratedOrExit();
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
  case 'campaign': {
    ensureMigratedOrExit();
    const { cmdCampaignInit, cmdCampaignState, cmdCampaignUpdate, cmdCampaignList, cmdCampaignArchive, cmdRepurposeManifest } = require('./lib/campaign.cjs');
    const campaignArgs = args.slice(1).filter(a => a !== '--raw');
    const subCmd = campaignArgs[0];
    const slug = campaignArgs[1];
    if (subCmd !== 'list' && slug && /\s/.test(slug)) {
      error('campaign slug must not contain whitespace -- use hyphens');
    }
    if (subCmd === 'init') cmdCampaignInit(slug, campaignArgs.slice(2).join(' '), raw);
    else if (subCmd === 'state') cmdCampaignState(slug, raw);
    else if (subCmd === 'update') cmdCampaignUpdate(slug, campaignArgs[2], campaignArgs[3], raw);
    else if (subCmd === 'list') {
      const listParsed = parseNamedArgs(campaignArgs.slice(1));
      // Support --since as a named flag (e.g., --since 30d)
      const since = listParsed.named.since || listParsed.positional.find(a => a.match(/^\d+d$/)) || '';
      // Filter is the first positional that starts with '--' (e.g., --active, --shipped-since-last-audit)
      const filter = listParsed.positional.find(a => a.startsWith('--')) || '';
      cmdCampaignList(filter, since, raw);
    }
    else if (subCmd === 'archive') cmdCampaignArchive(slug, raw);
    else if (subCmd === 'repurpose-manifest') {
      const sourceAssetId = campaignArgs[2];
      const derivativesJson = campaignArgs[3];
      let derivatives;
      try {
        derivatives = JSON.parse(derivativesJson);
      } catch (e) {
        error('Failed to parse derivatives JSON: ' + e.message);
      }
      cmdRepurposeManifest(slug, sourceAssetId, derivatives, raw);
    }
    else error('campaign subcommand required: init, state, update, list, archive, repurpose-manifest');
    break;
  }
  case 'deviation': {
    ensureMigratedOrExit();
    const devArgs = args.slice(1).filter(a => a !== '--raw');
    const devCmd = devArgs[0];
    if (devCmd === 'append') {
      const { cmdDeviationAppend } = require('./lib/deviation.cjs');
      const parsed = parseNamedArgs(args.slice(2));
      const extra = {
        gate_id: parsed.named['gate-id'],
        tier: parsed.named.tier,
        finding: parsed.named.finding,
        action: parsed.named.action,
        run: parsed.named.run,
      };
      cmdDeviationAppend(parsed.named.slug, parsed.named.gate, parsed.named.result, parsed.named.justification, parsed.named.asset, raw, extra);
    } else {
      error('deviation subcommand required: append');
    }
    break;
  }
  case 'drift-log': {
    ensureMigratedOrExit();
    const dlArgs = args.slice(1).filter(a => a !== '--raw');
    const dlCmd = dlArgs[0];
    if (dlCmd === 'append') {
      const { cmdDriftLogAppend } = require('./lib/drift-log.cjs');
      const parsed = parseNamedArgs(args.slice(2));
      cmdDriftLogAppend(
        parsed.named['event-type'],
        parsed.named.source,
        parsed.named.details,
        parsed.named.affected,
        raw
      );
    } else if (dlCmd === 'deprecation') {
      const { cmdDriftLogDeprecation } = require('./lib/drift-log.cjs');
      const parsed = parseNamedArgs(args.slice(2));
      cmdDriftLogDeprecation(
        parsed.named.asset,
        parsed.named.campaign,
        parsed.named['old-element'],
        parsed.named['required-update'],
        parsed.named.deadline,
        raw
      );
    } else {
      error('drift-log subcommand required: append, deprecation');
    }
    break;
  }
  case 'health': {
    ensureMigratedOrExit();
    const { cmdHealth } = require('./lib/health.cjs');
    const full = args.includes('--full');
    cmdHealth(raw, full);
    break;
  }
  case 'legacy-folder': {
    const sub = args[1];
    const { legacyFolderCheck, migrateLegacyFolder } = require('./lib/legacy-folder.cjs');
    if (sub === 'check') {
      const result = legacyFolderCheck(process.cwd());
      if (raw) {
        console.log(JSON.stringify(result));
      } else {
        console.log(`Legacy folder state: ${result.state}`);
      }
      process.exit(result.state === 'conflict' ? 1 : 0);
    } else if (sub === 'migrate') {
      const result = migrateLegacyFolder(process.cwd());
      if (raw) {
        console.log(JSON.stringify(result));
      } else {
        console.log(result.ok ? `Migrated ${result.from} -> ${result.to}` : `Error: ${result.error}`);
      }
      process.exit(result.ok ? 0 : 1);
    } else {
      error('legacy-folder subcommand required: check, migrate');
    }
    break;
  }
  case 'scan-codebase': {
    const { scanCodebase } = require('./lib/codebase-scan.cjs');
    const result = scanCodebase(process.cwd());
    console.log(
      raw
        ? JSON.stringify(result)
        : `Stack: ${result.stack.join(', ')}\nMonorepo: ${result.monorepo}\nFeature candidates: ${result.featureCandidates.join(', ')}`
    );
    break;
  }
  case 'config': {
    const { readConfig, setConfig } = require('./lib/config.cjs');
    const cfgArgs = args.slice(1).filter(a => a !== '--raw');
    const sub = cfgArgs[0];
    if (sub === 'read') {
      const cfg = readConfig(process.cwd());
      console.log(raw ? JSON.stringify(cfg) : JSON.stringify(cfg, null, 2));
    } else if (sub === 'set') {
      const key = cfgArgs[1];
      let val = cfgArgs[2];
      if (val === 'true') val = true;
      else if (val === 'false') val = false;
      setConfig(process.cwd(), key, val);
      console.log(raw ? '{"ok":true}' : `Set ${key} = ${val}`);
    } else {
      error('config subcommand required: read, set');
    }
    break;
  }
  case 'svg-render': {
    const { renderSvgToPng } = require('./lib/svg-render.cjs');
    const svgArgs = args.slice(1).filter(a => a !== '--raw');
    const result = renderSvgToPng(svgArgs[0], svgArgs[1]);
    console.log(
      raw
        ? JSON.stringify(result)
        : (result.ok ? `Rendered via ${result.renderer}` : `Error: ${result.error}`)
    );
    process.exit(result.ok ? 0 : 1);
    break;
  }
  case 'site-location': {
    const { suggestSitePath } = require('./lib/site-location.cjs');
    const result = suggestSitePath(process.cwd());
    console.log(raw ? JSON.stringify(result) : `Default: ${result.default}\nMonorepo: ${result.monorepo}`);
    break;
  }
  case 'deploy': {
    const { detectDeployPath } = require('./lib/deploy.cjs');
    const deployArgs = args.slice(1).filter(a => a !== '--raw');
    const sub = deployArgs[0];
    if (sub === 'detect') {
      const result = detectDeployPath(process.cwd());
      console.log(raw ? JSON.stringify(result) : `Preferred: ${result.preferred || 'none'}\nAvailable: ${result.available.join(', ') || 'none'}`);
    } else {
      error(`deploy subcommand required: detect${sub ? ` (got: ${sub})` : ''}`);
    }
    break;
  }
  case 'playwright-check': {
    const { checkPlaywrightMcp } = require('./lib/playwright-check.cjs');
    const result = checkPlaywrightMcp();
    console.log(raw ? JSON.stringify(result) : `${result.detected ? '✓' : '✗'} ${result.setupHint}`);
    process.exit(result.detected ? 0 : 1);
    break;
  }
  default:
    error(
      `Unknown command: ${command || '(none)'}. Available: slug, timestamp, init, state, campaign, commit, deviation, drift-log, health, legacy-folder, scan-codebase, config, svg-render, site-location, deploy, playwright-check`
    );
}
