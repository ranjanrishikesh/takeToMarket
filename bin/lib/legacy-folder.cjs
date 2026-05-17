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
    return { ok: false, error: `Both .marketing/ and .taketomarket/ already exist in ${cwd}. Resolve manually.` };
  }
  if (check.state !== 'legacy') {
    return { ok: false, error: `Nothing to migrate. State: ${check.state}.` };
  }
  try {
    fs.renameSync(check.legacyPath, check.currentPath);
  } catch (e) {
    if (e.code === 'EXDEV') {
      // Cross-device rename not allowed: copy-then-verify-then-delete.
      try {
        fs.cpSync(check.legacyPath, check.currentPath, { recursive: true });
      } catch (copyErr) {
        return { ok: false, error: `Cross-device migration copy failed: ${copyErr.message}` };
      }
      if (!fs.existsSync(check.currentPath)) {
        return { ok: false, error: `Cross-device migration copy did not produce ${check.currentPath}; legacy folder preserved.` };
      }
      try {
        fs.rmSync(check.legacyPath, { recursive: true, force: true });
      } catch (rmErr) {
        return { ok: false, error: `Copied to ${check.currentPath} but failed to remove legacy folder ${check.legacyPath}: ${rmErr.message}. Both directories now exist; remove the legacy one manually.` };
      }
    } else {
      return { ok: false, error: `Migration failed (${e.code || 'unknown'}): ${e.message}` };
    }
  }
  return { ok: true, from: check.legacyPath, to: check.currentPath };
}

module.exports = { legacyFolderCheck, migrateLegacyFolder, LEGACY, CURRENT };
