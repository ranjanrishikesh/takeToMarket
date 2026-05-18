'use strict';

// Tests for first-run inline-education state helpers in bin/lib/config.cjs
// and the `first-run` subcommand wired into bin/ttm-tools.cjs.

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const {
  readConfig,
  writeConfig,
  isFirstRunSeen,
  markFirstRunSeen,
} = require('../bin/lib/config.cjs');

const TOOLS = path.resolve(__dirname, '..', 'bin', 'ttm-tools.cjs');

function tmpDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'ttm-first-run-'));
}

test('isFirstRunSeen returns false when CONFIG.md is missing', () => {
  const d = tmpDir();
  assert.strictEqual(isFirstRunSeen(d, 'ttm-init'), false);
});

test('markFirstRunSeen creates first_run_seen and persists per-skill flag', () => {
  const d = tmpDir();
  markFirstRunSeen(d, 'ttm-init');
  assert.strictEqual(isFirstRunSeen(d, 'ttm-init'), true);
  // Unrelated skill is still unseen.
  assert.strictEqual(isFirstRunSeen(d, 'ttm-produce'), false);
});

test('markFirstRunSeen is independent across skills (no cross-contamination)', () => {
  const d = tmpDir();
  markFirstRunSeen(d, 'ttm-init');
  markFirstRunSeen(d, 'ttm-produce');
  markFirstRunSeen(d, 'ttm-verify');
  const cfg = readConfig(d);
  assert.deepStrictEqual(cfg.first_run_seen, {
    'ttm-init': true,
    'ttm-produce': true,
    'ttm-verify': true,
  });
});

test('markFirstRunSeen preserves other config keys (yolo, inline_education)', () => {
  const d = tmpDir();
  fs.mkdirSync(path.join(d, '.taketomarket'));
  writeConfig(d, { yolo: true, inline_education: false, landing_path: './landing' });
  markFirstRunSeen(d, 'ttm-init');
  const cfg = readConfig(d);
  assert.strictEqual(cfg.yolo, true);
  assert.strictEqual(cfg.inline_education, false);
  assert.strictEqual(cfg.landing_path, './landing');
  assert.strictEqual(cfg.first_run_seen['ttm-init'], true);
});

test('markFirstRunSeen is idempotent (calling twice == calling once)', () => {
  const d = tmpDir();
  markFirstRunSeen(d, 'ttm-init');
  const after1 = JSON.stringify(readConfig(d));
  markFirstRunSeen(d, 'ttm-init');
  const after2 = JSON.stringify(readConfig(d));
  assert.strictEqual(after1, after2);
});

test('readConfig round-trips the nested first_run_seen object', () => {
  const d = tmpDir();
  markFirstRunSeen(d, 'ttm-init');
  markFirstRunSeen(d, 'ttm-brief');
  // Re-read from disk to ensure the YAML serializer/parser round-trips a
  // nested object correctly.
  const cfg = readConfig(d);
  assert.strictEqual(typeof cfg.first_run_seen, 'object');
  assert.strictEqual(cfg.first_run_seen['ttm-init'], true);
  assert.strictEqual(cfg.first_run_seen['ttm-brief'], true);
});

test('ttm-tools.cjs first-run check returns "first" then "seen" after mark', () => {
  const d = tmpDir();
  const check1 = execFileSync('node', [TOOLS, 'first-run', 'check', 'ttm-init'], {
    cwd: d,
    encoding: 'utf8',
  }).trim();
  assert.strictEqual(check1, 'first');
  execFileSync('node', [TOOLS, 'first-run', 'mark', 'ttm-init'], {
    cwd: d,
    encoding: 'utf8',
  });
  const check2 = execFileSync('node', [TOOLS, 'first-run', 'check', 'ttm-init'], {
    cwd: d,
    encoding: 'utf8',
  }).trim();
  assert.strictEqual(check2, 'seen');
});

test('ttm-tools.cjs first-run check --raw emits JSON {"seen":bool}', () => {
  const d = tmpDir();
  const before = execFileSync(
    'node',
    [TOOLS, 'first-run', 'check', 'ttm-init', '--raw'],
    { cwd: d, encoding: 'utf8' }
  ).trim();
  assert.deepStrictEqual(JSON.parse(before), { seen: false });
  execFileSync('node', [TOOLS, 'first-run', 'mark', 'ttm-init', '--raw'], {
    cwd: d,
    encoding: 'utf8',
  });
  const after = execFileSync(
    'node',
    [TOOLS, 'first-run', 'check', 'ttm-init', '--raw'],
    { cwd: d, encoding: 'utf8' }
  ).trim();
  assert.deepStrictEqual(JSON.parse(after), { seen: true });
});

test('ttm-tools.cjs first-run with missing args exits non-zero', () => {
  const d = tmpDir();
  let threw = false;
  try {
    execFileSync('node', [TOOLS, 'first-run'], {
      cwd: d,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (e) {
    threw = true;
    assert.ok(e.status !== 0, 'expected non-zero exit when args are missing');
  }
  assert.ok(threw, 'expected ttm-tools first-run with no args to fail');
});
