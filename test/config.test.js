'use strict';
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const os = require('os');

const { readConfig, writeConfig, setConfig } = require('../bin/lib/config.cjs');

function tmpDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'ttm-config-'));
}

test('readConfig returns defaults when CONFIG.md missing', () => {
  const d = tmpDir();
  const cfg = readConfig(d);
  assert.strictEqual(cfg.yolo, false);
  assert.strictEqual(cfg.inline_education, true);
});

test('writeConfig + readConfig roundtrip', () => {
  const d = tmpDir();
  fs.mkdirSync(path.join(d, '.taketomarket'));
  writeConfig(d, { yolo: true, inline_education: false, landing_path: './landing' });
  const cfg = readConfig(d);
  assert.strictEqual(cfg.yolo, true);
  assert.strictEqual(cfg.inline_education, false);
  assert.strictEqual(cfg.landing_path, './landing');
});

test('setConfig merges with existing', () => {
  const d = tmpDir();
  fs.mkdirSync(path.join(d, '.taketomarket'));
  writeConfig(d, { yolo: false });
  setConfig(d, 'yolo', true);
  const cfg = readConfig(d);
  assert.strictEqual(cfg.yolo, true);
});
