'use strict';
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const SKILLS_DIR = path.join(__dirname, '..', 'skills');
const REQUIRED_MARKER = '<!-- next-step-footer -->';

test('every ttm-* skill SKILL.md references the next-step footer', () => {
  const skills = fs.readdirSync(SKILLS_DIR).filter(d => d.startsWith('ttm-'));
  const missing = [];
  for (const s of skills) {
    const p = path.join(SKILLS_DIR, s, 'SKILL.md');
    if (!fs.existsSync(p)) continue;
    const body = fs.readFileSync(p, 'utf8');
    if (!body.includes(REQUIRED_MARKER) && !body.includes('templates/next-step-footer.md')) {
      missing.push(s);
    }
  }
  assert.deepStrictEqual(missing, [], `Skills missing footer: ${missing.join(', ')}`);
});
