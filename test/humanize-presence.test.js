'use strict';
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const PRODUCING_SKILLS = ['ttm-produce', 'ttm-repurpose', 'ttm-affiliate-kit'];
const SKILLS_DIR = path.join(__dirname, '..', 'skills');
const HUMANIZE_MARKER = '/ttm-humanize';
const WORKFLOW_PATH_RE = /workflows\/([\w/-]+\.md)/;

test('every producing skill calls /ttm-humanize as final step', () => {
  const missing = [];
  for (const s of PRODUCING_SKILLS) {
    const skillPath = path.join(SKILLS_DIR, s, 'SKILL.md');
    if (!fs.existsSync(skillPath)) {
      missing.push(`${s}: SKILL.md not found`);
      continue;
    }
    const skillBody = fs.readFileSync(skillPath, 'utf8');
    const m = skillBody.match(WORKFLOW_PATH_RE);
    if (m) {
      const workflowPath = path.join(__dirname, '..', 'workflows', m[1]);
      if (!fs.existsSync(workflowPath)) {
        missing.push(`${s}: SKILL.md references workflow ${m[1]} which does not exist`);
        continue;
      }
      const workflowBody = fs.readFileSync(workflowPath, 'utf8');
      if (!workflowBody.includes(HUMANIZE_MARKER)) {
        missing.push(`${s}: workflow at ${workflowPath} missing /ttm-humanize`);
      }
    } else if (!skillBody.includes(HUMANIZE_MARKER)) {
      missing.push(`${s}: SKILL.md missing /ttm-humanize`);
    }
  }
  assert.deepStrictEqual(missing, [], missing.join('\n'));
});
