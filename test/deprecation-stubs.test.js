'use strict';
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const STUBS = {
  'ttm-research': 'ttm-discover',
  'ttm-email-preflight': 'ttm-email-check',
  'ttm-aeo-check': 'ttm-seo',
  'ttm-keyword-map': 'ttm-seo',
  'ttm-seo-audit': 'ttm-seo',
};

for (const [oldSkill, newSkill] of Object.entries(STUBS)) {
  test(`${oldSkill} is a deprecation stub pointing at ${newSkill}`, () => {
    const p = path.join(__dirname, '..', 'skills', oldSkill, 'SKILL.md');
    const body = fs.readFileSync(p, 'utf8');
    assert.match(body, /DEPRECATED/, 'must mention DEPRECATED');
    assert.match(body, new RegExp(newSkill), `must reference ${newSkill}`);
  });
}
