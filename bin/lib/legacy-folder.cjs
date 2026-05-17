'use strict';

const fs = require('fs');
const path = require('path');

const LEGACY = '.marketing';
const CURRENT = '.taketomarket';

function legacyFolderCheck(cwd) {
  const legacyPath = path.join(cwd, LEGACY);
  const currentPath = path.join(cwd, CURRENT);
  const legacyExists = fs.existsSync(legacyPath);
  const currentExists = fs.existsSync(currentPath);

  if (legacyExists && currentExists) {
    return { state: 'conflict', legacyPath, currentPath };
  }
  if (legacyExists) {
    return { state: 'legacy', legacyPath, currentPath };
  }
  if (currentExists) {
    return { state: 'current', currentPath };
  }
  return { state: 'none' };
}

function migrateLegacyFolder(cwd) {
  const check = legacyFolderCheck(cwd);
  if (check.state === 'conflict') {
    return { ok: false, error: `Both .marketing/ and .taketomarket/ already exists in ${cwd}. Resolve manually.` };
  }
  if (check.state !== 'legacy') {
    return { ok: false, error: `Nothing to migrate. State: ${check.state}.` };
  }
  fs.renameSync(check.legacyPath, check.currentPath);
  return { ok: true, from: check.legacyPath, to: check.currentPath };
}

module.exports = { legacyFolderCheck, migrateLegacyFolder, LEGACY, CURRENT };
