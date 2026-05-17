'use strict';
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const os = require('os');

const { suggestSitePath } = require('../bin/lib/site-location.cjs');

function tmpDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'ttm-site-'));
}

test('non-monorepo defaults to ./landing/', () => {
  const d = tmpDir();
  fs.writeFileSync(path.join(d, 'package.json'), '{}');
  const result = suggestSitePath(d);
  assert.strictEqual(result.default, path.join(d, 'landing'));
});

test('pnpm monorepo with apps/ defaults to apps/site/', () => {
  const d = tmpDir();
  fs.writeFileSync(path.join(d, 'pnpm-workspace.yaml'), 'packages:\n  - "apps/*"\n');
  fs.mkdirSync(path.join(d, 'apps'));
  const result = suggestSitePath(d);
  assert.strictEqual(result.default, path.join(d, 'apps', 'site'));
});

test('pnpm monorepo with packages/ defaults to packages/site/', () => {
  const d = tmpDir();
  fs.writeFileSync(path.join(d, 'pnpm-workspace.yaml'), 'packages:\n  - "packages/*"\n');
  fs.mkdirSync(path.join(d, 'packages'));
  const result = suggestSitePath(d);
  assert.strictEqual(result.default, path.join(d, 'packages', 'site'));
});

test('turbo monorepo with apps/ defaults to apps/site/', () => {
  const d = tmpDir();
  fs.writeFileSync(path.join(d, 'turbo.json'), '{}');
  fs.mkdirSync(path.join(d, 'apps'));
  const result = suggestSitePath(d);
  assert.strictEqual(result.default, path.join(d, 'apps', 'site'));
});

test('monorepo with neither apps/ nor packages/ falls back to apps/site/', () => {
  const d = tmpDir();
  fs.writeFileSync(path.join(d, 'turbo.json'), '{}');
  const result = suggestSitePath(d);
  assert.strictEqual(result.monorepo, true);
  assert.strictEqual(result.default, path.join(d, 'apps', 'site'));
});
