'use strict';

const fs = require('fs');
const path = require('path');

const { detectMonorepo } = require('./codebase-scan.cjs');

function suggestSitePath(cwd) {
  const monorepo = detectMonorepo(cwd);
  if (!monorepo) {
    return { monorepo: false, default: path.join(cwd, 'landing') };
  }
  if (fs.existsSync(path.join(cwd, 'apps'))) {
    return { monorepo: true, default: path.join(cwd, 'apps', 'site') };
  }
  if (fs.existsSync(path.join(cwd, 'packages'))) {
    return { monorepo: true, default: path.join(cwd, 'packages', 'site') };
  }
  return { monorepo: true, default: path.join(cwd, 'apps', 'site') };
}

module.exports = { suggestSitePath };
