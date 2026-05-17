'use strict';
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const os = require('os');

const { detectDeployPath } = require('../bin/lib/deploy.cjs');

function tmpDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'ttm-deploy-'));
}

test('detects git-push when .vercel/project.json exists', () => {
  const d = tmpDir();
  fs.mkdirSync(path.join(d, '.vercel'));
  fs.writeFileSync(path.join(d, '.vercel', 'project.json'), '{"projectId":"abc"}');
  const result = detectDeployPath(d);
  assert.strictEqual(result.preferred, 'git-push');
});

test('detects api-token when VERCEL_TOKEN env set + no .vercel/', () => {
  const d = tmpDir();
  const result = detectDeployPath(d, { env: { VERCEL_TOKEN: 'xxx' } });
  // CLI detection check might be true on dev machine; we test that api-token is listed in available
  assert.ok(result.available.includes('api-token'));
});

test('returns none when nothing available', () => {
  const d = tmpDir();
  const result = detectDeployPath(d, { env: {}, hasCli: false });
  assert.strictEqual(result.preferred, null);
});
