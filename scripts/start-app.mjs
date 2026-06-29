import { spawn, spawnSync } from 'node:child_process';
import { existsSync, openSync, readFileSync } from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  getBuildLaunchSpec,
  getLaunchPreflight,
  getServerLaunchSpec,
  isForeignServerResponse,
  shouldReuseExistingServer,
} from './start-app-lib.mjs';

const HOST = '127.0.0.1';
const PORT = 3000;
const APP_URL = `http://localhost:${PORT}`;
const STATUS_URL = `${APP_URL}/api/config-status`;
const READY_TIMEOUT_MS = 30_000;
const STATUS_TIMEOUT_MS = 1_500;
const POLL_INTERVAL_MS = 700;

function resolveRootDir() {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function parseEnvFile(content) {
  const values = {};

  for (const rawLine of content.split(/\r?\n/u)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }

    const separatorIndex = line.indexOf('=');
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    values[key] = value;
  }

  return values;
}

function readEnvValues(envPath) {
  if (!existsSync(envPath)) {
    return {};
  }

  return parseEnvFile(readFileSync(envPath, 'utf8'));
}

async function fetchStatus(url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetch(url, {
      headers: {
        accept: 'application/json',
      },
      signal: controller.signal,
    });
    const text = await response.text();
    let body = null;

    try {
      body = text ? JSON.parse(text) : null;
    } catch {
      body = null;
    }

    return {
      status: response.status,
      body,
      text,
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return null;
    }

    if (error instanceof TypeError) {
      return null;
    }

    throw error;
  } finally {
    clearTimeout(timer);
  }
}

function checkPortOpen(host, port, timeoutMs = 1_000) {
  return new Promise((resolve) => {
    const socket = new net.Socket();

    const finish = (value) => {
      socket.destroy();
      resolve(value);
    };

    socket.setTimeout(timeoutMs);
    socket.once('connect', () => finish(true));
    socket.once('timeout', () => finish(false));
    socket.once('error', () => finish(false));
    socket.connect(port, host);
  });
}

function openBrowser(url) {
  const browserProcess = spawn('cmd.exe', ['/c', 'start', '', url], {
    detached: true,
    stdio: 'ignore',
    windowsHide: true,
  });

  browserProcess.unref();
}

function startDevServer(rootDir) {
  const stdoutLog = openSync(path.join(rootDir, 'launcher-server.log'), 'a');
  const stderrLog = openSync(path.join(rootDir, 'launcher-server.err.log'), 'a');
  const launchSpec = getServerLaunchSpec(process.execPath, rootDir);
  const serverProcess = spawn(launchSpec.command, launchSpec.args, {
    cwd: rootDir,
    detached: true,
    stdio: ['ignore', stdoutLog, stderrLog],
    windowsHide: true,
  });

  serverProcess.unref();
}

function ensureProductionBuild(rootDir) {
  const serverBundlePath = path.join(rootDir, 'dist', 'server.cjs');
  if (existsSync(serverBundlePath)) {
    return;
  }

  const buildSpec = getBuildLaunchSpec();
  const buildResult = spawnSync(buildSpec.command, buildSpec.args, {
    cwd: rootDir,
    encoding: 'utf8',
    windowsHide: true,
  });

  if (buildResult.status !== 0) {
    const stderr = buildResult.stderr?.trim();
    const stdout = buildResult.stdout?.trim();
    const details = stderr || stdout || 'Unknown build error.';
    throw new Error(`The app could not be prepared for one-click launch. ${details}`);
  }

  if (!existsSync(serverBundlePath)) {
    throw new Error(
      'The app build finished without producing dist/server.cjs. Run npm run build manually once and try again.',
    );
  }
}

async function waitForReadyServer() {
  const rootDir = resolveRootDir();
  const startTime = Date.now();

  while (Date.now() - startTime < READY_TIMEOUT_MS) {
    const status = await fetchStatus(STATUS_URL, STATUS_TIMEOUT_MS);

    if (shouldReuseExistingServer(status, rootDir)) {
      return true;
    }

    if (isForeignServerResponse(status, rootDir)) {
      throw new Error(
        'Port 3000 is responding, but it is not this app. Close the other service before starting this project.',
      );
    }

    await sleep(POLL_INTERVAL_MS);
  }

  return false;
}

async function main() {
  const rootDir = resolveRootDir();
  const envPath = path.join(rootDir, '.env');
  const envValues = readEnvValues(envPath);
  const preflight = getLaunchPreflight({
    hasEnvFile: existsSync(envPath),
    hasNodeModules: existsSync(path.join(rootDir, 'node_modules')),
    hasApiKey: Boolean(envValues.RIGHTCODES_API_KEY?.trim()),
  });

  if (!preflight.ok) {
    console.error(preflight.message);
    process.exitCode = 1;
    return;
  }

  const existingStatus = await fetchStatus(STATUS_URL, STATUS_TIMEOUT_MS);
  if (shouldReuseExistingServer(existingStatus, rootDir)) {
    openBrowser(APP_URL);
    return;
  }

  if (isForeignServerResponse(existingStatus, rootDir)) {
    throw new Error(
      'Port 3000 is already being used by another local web app. Close that app before launching this project.',
    );
  }

  const portAlreadyOpen = await checkPortOpen(HOST, PORT);
  if (portAlreadyOpen) {
    throw new Error(
      'Port 3000 is already occupied by another process. Close that process before launching this project.',
    );
  }

  ensureProductionBuild(rootDir);
  startDevServer(rootDir);

  const ready = await waitForReadyServer();
  if (!ready) {
    throw new Error(
      'The app did not become ready in time. Check launcher-server.err.log for details.',
    );
  }

  openBrowser(APP_URL);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
