import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';
import {
  getBuildLaunchSpec,
  getLaunchPreflight,
  getServerLaunchSpec,
  shouldReuseExistingServer,
} from './start-app-lib.mjs';

test('getLaunchPreflight reports missing env file', () => {
  assert.deepEqual(
    getLaunchPreflight({
      hasEnvFile: false,
      hasNodeModules: true,
      hasApiKey: true,
    }),
    {
      ok: false,
      reason: 'missing-env',
      message: 'Missing .env file. Complete the one-time setup before using one-click launch.',
    },
  );
});

test('getLaunchPreflight reports missing dependencies', () => {
  assert.deepEqual(
    getLaunchPreflight({
      hasEnvFile: true,
      hasNodeModules: false,
      hasApiKey: true,
    }),
    {
      ok: false,
      reason: 'missing-deps',
      message: 'Missing node_modules. Run npm install once during setup before using one-click launch.',
    },
  );
});

test('getLaunchPreflight reports missing api key', () => {
  assert.deepEqual(
    getLaunchPreflight({
      hasEnvFile: true,
      hasNodeModules: true,
      hasApiKey: false,
    }),
    {
      ok: false,
      reason: 'missing-api-key',
      message: 'Missing RIGHTCODES_API_KEY in .env. Update the environment file before launching the app.',
    },
  );
});

test('getLaunchPreflight succeeds when env, deps, and api key are present', () => {
  assert.deepEqual(
    getLaunchPreflight({
      hasEnvFile: true,
      hasNodeModules: true,
      hasApiKey: true,
    }),
    {
      ok: true,
    },
  );
});

test('shouldReuseExistingServer only reuses matching healthy app responses', () => {
  assert.equal(
    shouldReuseExistingServer({
      status: 200,
      body: {
        appName: 'AI Image Generation Canvas',
        workspaceRoot: 'H:/ai-image-generation-workspace',
      },
    }, 'H:/ai-image-generation-workspace'),
    true,
  );

  assert.equal(
    shouldReuseExistingServer({
      status: 200,
      body: {
        appName: 'Other App',
      },
    }, 'H:/ai-image-generation-workspace'),
    false,
  );
});

test('shouldReuseExistingServer rejects a healthy response from another workspace copy', () => {
  assert.equal(
    shouldReuseExistingServer({
      status: 200,
      body: {
        appName: 'AI Image Generation Canvas',
        workspaceRoot: 'E:/Local-ai-image-main',
      },
    }, 'H:/ai-image-generation-workspace'),
    false,
  );
});

test('getBuildLaunchSpec uses cmd.exe to run the one-time build when needed', () => {
  assert.deepEqual(
    getBuildLaunchSpec(),
    {
      command: 'cmd.exe',
      args: ['/c', 'npm', 'run', 'build'],
    },
  );
});

test('getServerLaunchSpec starts the built production server directly with node', () => {
  assert.deepEqual(
    getServerLaunchSpec('D:/Program Files/nodejs/node.exe', 'H:/ai-image-generation-workspace'),
    {
      command: 'D:/Program Files/nodejs/node.exe',
      args: [path.join('H:/ai-image-generation-workspace', 'dist', 'server.cjs')],
    },
  );
});
