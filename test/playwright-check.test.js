'use strict';
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { checkPlaywrightMcp } = require('../bin/lib/playwright-check.cjs');

test('returns shape with detected + setupHint', () => {
  const result = checkPlaywrightMcp({ settingsPath: '/nonexistent/path/settings.json' });
  assert.strictEqual(typeof result.detected, 'boolean');
  assert.ok(typeof result.setupHint === 'string');
});

test('detects mcpServers.playwright if present in settings', () => {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'ttm-pw-'));
  const settingsPath = path.join(d, 'settings.json');
  fs.writeFileSync(settingsPath, JSON.stringify({ mcpServers: { playwright: { command: 'npx' } } }));
  const result = checkPlaywrightMcp({ settingsPath });
  assert.strictEqual(result.detected, true);
});

test('returns false when settings has no playwright entry', () => {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'ttm-pw-'));
  const settingsPath = path.join(d, 'settings.json');
  fs.writeFileSync(settingsPath, JSON.stringify({ mcpServers: {} }));
  const result = checkPlaywrightMcp({ settingsPath });
  assert.strictEqual(result.detected, false);
});

test('returns false when settings.json is malformed JSON', () => {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'ttm-pw-'));
  const settingsPath = path.join(d, 'settings.json');
  fs.writeFileSync(settingsPath, '{not valid json');
  const result = checkPlaywrightMcp({ settingsPath });
  assert.strictEqual(result.detected, false);
});
