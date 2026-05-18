'use strict';
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { detectInstallMethod } = require('../bin/lib/install-detect.cjs');

function tmpDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'ttm-install-detect-'));
}

function withEnv(overrides, fn) {
  const prev = {};
  for (const k of Object.keys(overrides)) {
    prev[k] = process.env[k];
    if (overrides[k] === undefined) delete process.env[k];
    else process.env[k] = overrides[k];
  }
  try {
    return fn();
  } finally {
    for (const k of Object.keys(prev)) {
      if (prev[k] === undefined) delete process.env[k];
      else process.env[k] = prev[k];
    }
  }
}

test('returns shape { method, root } with valid method enum', () => {
  // Force fallback path that does not exist on the test machine.
  const result = withEnv(
    { CLAUDE_PLUGIN_ROOT: undefined, HOME: '/nonexistent/path/for/ttm/test' },
    () => detectInstallMethod()
  );
  assert.ok(['clone', 'npm', 'unknown'].includes(result.method));
  assert.ok(result.root === null || typeof result.root === 'string');
});

test('returns method: clone when plugin root contains .git/', () => {
  const d = tmpDir();
  fs.mkdirSync(path.join(d, '.git'));
  const result = withEnv({ CLAUDE_PLUGIN_ROOT: d }, () => detectInstallMethod());
  assert.strictEqual(result.method, 'clone');
  assert.strictEqual(result.root, d);
});

test('returns method: npm when plugin root has no .git/', () => {
  const d = tmpDir();
  const result = withEnv({ CLAUDE_PLUGIN_ROOT: d }, () => detectInstallMethod());
  assert.strictEqual(result.method, 'npm');
  assert.strictEqual(result.root, d);
});

test('returns method: unknown with null root when no candidate exists', () => {
  const result = withEnv(
    { CLAUDE_PLUGIN_ROOT: undefined, HOME: '/definitely/does/not/exist/ttm-detect' },
    () => detectInstallMethod()
  );
  assert.strictEqual(result.method, 'unknown');
  assert.strictEqual(result.root, null);
});

test('CLAUDE_PLUGIN_ROOT takes precedence over HOME candidates', () => {
  const d = tmpDir();
  fs.mkdirSync(path.join(d, '.git'));
  // HOME points somewhere with no candidates; CLAUDE_PLUGIN_ROOT should still win.
  const result = withEnv(
    { CLAUDE_PLUGIN_ROOT: d, HOME: '/nonexistent/home/path' },
    () => detectInstallMethod()
  );
  assert.strictEqual(result.method, 'clone');
  assert.strictEqual(result.root, d);
});
