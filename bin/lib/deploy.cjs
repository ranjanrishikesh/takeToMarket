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
  const vercelConfig = path.join(cwd, 'vercel.json');
  const gitConnected = fs.existsSync(vercelProjectJson) || fs.existsSync(vercelConfig);

  if (gitConnected) available.push('git-push');
  if (hasCli) available.push('cli');
  if (env.VERCEL_TOKEN) available.push('api-token');

  let preferred = null;
  if (available.includes('git-push')) preferred = 'git-push';
  else if (available.includes('cli')) preferred = 'cli';
  else if (available.includes('api-token')) preferred = 'api-token';

  return { available, preferred, gitConnected, hasCli, hasToken: !!env.VERCEL_TOKEN };
}

function deployGitPush(cwd, message) {
  execSync('git push', { cwd, stdio: 'inherit' });
  return { ok: true, method: 'git-push' };
}

function deployCli(cwd, prod = false) {
  const flag = prod ? '--prod' : '';
  execSync(`vercel deploy ${flag}`.trim(), { cwd, stdio: 'inherit' });
  return { ok: true, method: 'cli' };
}

function deployApi(cwd, token) {
  // Stub: actual implementation uses fetch to api.vercel.com.
  // For v2.3.0 P4 — return not-implemented so users know git-push or CLI is preferred.
  return { ok: false, method: 'api-token', error: 'API-token deploy not yet implemented. Use git-push or CLI.' };
}

module.exports = { detectDeployPath, deployGitPush, deployCli, deployApi };
