import path from 'node:path';

const APP_NAME = 'AI Image Generation Canvas';

function normalizeWorkspaceRoot(value) {
  if (typeof value !== 'string') {
    return '';
  }

  return value.replace(/\\/gu, '/').replace(/\/+$/u, '').toLowerCase();
}

export function getLaunchPreflight(input) {
  if (!input.hasEnvFile) {
    return {
      ok: false,
      reason: 'missing-env',
      message: 'Missing .env file. Complete the one-time setup before using one-click launch.',
    };
  }

  if (!input.hasNodeModules) {
    return {
      ok: false,
      reason: 'missing-deps',
      message: 'Missing node_modules. Run npm install once during setup before using one-click launch.',
    };
  }

  if (!input.hasApiKey) {
    return {
      ok: false,
      reason: 'missing-api-key',
      message: 'Missing RIGHTCODES_API_KEY in .env. Update the environment file before launching the app.',
    };
  }

  return { ok: true };
}

export function shouldReuseExistingServer(result, expectedWorkspaceRoot) {
  return (
    result?.status === 200 &&
    result?.body?.appName === APP_NAME &&
    normalizeWorkspaceRoot(result?.body?.workspaceRoot) ===
      normalizeWorkspaceRoot(expectedWorkspaceRoot)
  );
}

export function isForeignServerResponse(result, expectedWorkspaceRoot) {
  return !!result && !shouldReuseExistingServer(result, expectedWorkspaceRoot);
}

export function getBuildLaunchSpec() {
  return {
    command: 'cmd.exe',
    args: ['/c', 'npm', 'run', 'build'],
  };
}

export function getServerLaunchSpec(nodePath, rootDir) {
  return {
    command: nodePath,
    args: [path.join(rootDir, 'dist', 'server.cjs')],
  };
}

export function getAppName() {
  return APP_NAME;
}
