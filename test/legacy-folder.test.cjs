'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const os = require('os');

const { legacyFolderCheck, migrateLegacyFolder } = require('../bin/lib/legacy-folder.cjs');

function makeTmpDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'ttm-legacy-'));
}

test('legacyFolderCheck returns none when neither folder exists', () => {
  const dir = makeTmpDir();
  const result = legacyFolderCheck(dir);
  assert.strictEqual(result.state, 'none');
});

test('legacyFolderCheck returns legacy when only .marketing exists', () => {
  const dir = makeTmpDir();
  fs.mkdirSync(path.join(dir, '.marketing'));
  const result = legacyFolderCheck(dir);
  assert.strictEqual(result.state, 'legacy');
  assert.strictEqual(result.legacyPath, path.join(dir, '.marketing'));
});

test('legacyFolderCheck returns current when only .taketomarket exists', () => {
  const dir = makeTmpDir();
  fs.mkdirSync(path.join(dir, '.taketomarket'));
  assert.strictEqual(legacyFolderCheck(dir).state, 'current');
});

test('legacyFolderCheck returns conflict when both exist', () => {
  const dir = makeTmpDir();
  fs.mkdirSync(path.join(dir, '.marketing'));
  fs.mkdirSync(path.join(dir, '.taketomarket'));
  assert.strictEqual(legacyFolderCheck(dir).state, 'conflict');
});

test('migrateLegacyFolder renames .marketing -> .taketomarket', () => {
  const dir = makeTmpDir();
  fs.mkdirSync(path.join(dir, '.marketing'));
  fs.writeFileSync(path.join(dir, '.marketing', 'STATE.md'), '# state');
  const result = migrateLegacyFolder(dir);
  assert.strictEqual(result.ok, true);
  assert.strictEqual(fs.existsSync(path.join(dir, '.marketing')), false);
  assert.strictEqual(fs.existsSync(path.join(dir, '.taketomarket', 'STATE.md')), true);
});

test('migrateLegacyFolder refuses to overwrite existing .taketomarket', () => {
  const dir = makeTmpDir();
  fs.mkdirSync(path.join(dir, '.marketing'));
  fs.mkdirSync(path.join(dir, '.taketomarket'));
  const result = migrateLegacyFolder(dir);
  assert.strictEqual(result.ok, false);
  assert.match(result.error, /already exists/);
});
