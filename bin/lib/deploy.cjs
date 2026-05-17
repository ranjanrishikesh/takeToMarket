'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function commandExists(cmd) {
  try {
    execSync(`command -v ${cmd}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function detectDeployPath(cwd, opts = {}) {
  const env = opts.env !== undefined ? opts.env : process.env;
  const hasCli = opts.hasCli !== undefined ? opts.hasCli : commandExists('vercel');
  const available = [];

  const vercelProjectJson = path.join(cwd, '.vercel', 'project.json');
  const gitConnected = fs.existsSync(vercelProjectJson);

  if (gitConnected) available.push('git-push');
  if (hasCli) available.push('cli');
  if (env.VERCEL_TOKEN) available.push('api-token');

  let preferred = null;
  if (available.includes('git-push')) preferred = 'git-push';
  else if (available.includes('cli')) preferred = 'cli';
  else if (available.includes('api-token')) preferred = 'api-token';

  return { available, preferred, gitConnected, hasCli, hasToken: !!env.VERCEL_TOKEN };
}

module.exports = { detectDeployPath };
