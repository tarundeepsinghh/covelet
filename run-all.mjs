import * as url from 'url';
import { fork } from 'node:child_process';
import { join } from 'node:path';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

class ChildProcessContainer {
  /**
   * @type {ChildProcess}
   */
  #process;

  /**
   *
   * @param {String} appName - Short name of the app
   * @param {String} execPath - the path to the applications main file
   */
  constructor(appName, execPath) {
    this.tag = `${appName}`;
    this.execPath = execPath;
    this.controller = new AbortController();
  }

  init() {
    const env = {
      NODE_ENV: 'production',
    };
    this.#process = fork(this.execPath, {
      signal: this.controller.signal,
      env,
    });
    this.#process.on('error', (error) => this.onError(error));
    this.#process.on('exit', (code) => this.onExit(code));
    this.#process.on('spawn', () => this.onSpawn());
  }

  onError(error) {
    console.error(error);
  }

  onExit(code) {
    console.log(`ChildProcess ${this.tag} exited [${code}]`);
  }

  onSpawn() {
    console.log(`ChildProcess ${this.tag} spawned for ${this.execPath}`);
  }

  /**
   * Overrides the default handlers with custom implementations
   * @param {'error'|'exit'|'spawn'} event
   * @param {Function} callbackFn
   */
  on(event, callbackFn) {
    switch (event) {
      case 'error':
        this.onError = callbackFn;
        break;
      case 'exit':
        this.onExit = callbackFn;
        break;
      case 'spawn':
        this.onSpawn = callbackFn;
        break;
      default:
        throw new Error("Invalid event type provided as argument to 'on'");
    }
  }

  abort() {
    this.controller.abort();
  }
}

/**
 * @type {Map<'idp'|'generator'|'crud'|'gateway'|'cache', ChildProcessContainer>}
 */
const pmap = new Map();

// Setup service processess
pmap.set(
  'idp',
  new ChildProcessContainer('IDP', join(__dirname, 'dist/apps/idp/main')),
);
pmap.set(
  'cache',
  new ChildProcessContainer('CACHE', join(__dirname, 'dist/apps/cache/main')),
);
pmap.set(
  'generator',
  new ChildProcessContainer(
    'GENERATOR',
    join(__dirname, 'dist/apps/generator/main'),
  ),
);
pmap.set(
  'crud',
  new ChildProcessContainer('CRUD', join(__dirname, 'dist/apps/crud/main')),
);
pmap.set(
  'gateway',
  new ChildProcessContainer(
    'GATEWAY',
    join(__dirname, 'dist/apps/gateway/main'),
  ),
);

// Start all the services
pmap.forEach((container) => {
  container.init();
});

process.on('beforeExit', (code) => {
  console.log('shutdown stuff');
  for (let [s, p] of pmap) {
    console.log(`Force close ${p.tag}...`);
    p.controller.abort();
  }
});
