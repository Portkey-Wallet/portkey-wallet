import { WORKER_KEEP_ALIVE_MESSAGE, TIME_45_MIN_IN_MS, WORKER_KEEP_ALIVE_INTERVAL } from 'constants/index';
import { apis } from './BrowserApis';

let keepAliveInterval: NodeJS.Timeout | number;
let keepAliveTimer: NodeJS.Timeout | number;

/**
 * SERVICE WORKER LOGIC
 */

const EXTENSION_CONTEXT_INVALIDATED_CHROMIUM_ERROR = 'Extension context invalidated.';

/**
 * Sending a message to the extension to receive will keep the service worker alive.
 *
 * If the extension is unloaded or reloaded during a session and the user attempts to send a
 * message to the extension, an "Extension context invalidated." error will be thrown from
 * chromium browsers. When this happens, prompt the user to reload the extension. Note: Handling
 * this error is not supported in Firefox here.
 */
const sendMessageWorkerKeepAlive = () => {
  apis.runtime.sendMessage({ name: WORKER_KEEP_ALIVE_MESSAGE }).catch((e) => {
    e.message === EXTENSION_CONTEXT_INVALIDATED_CHROMIUM_ERROR
      ? console.error(`Please refresh the page. Portkey: ${e}`)
      : console.error(`Portkey: ${e}`);
  });
};

/**
 * Running this method will ensure the service worker is kept alive for 45 minutes.
 * The first message is sent immediately and subsequent messages are sent at an
 * interval of WORKER_KEEP_ALIVE_INTERVAL.
 */

export const runWorkerKeepAliveInterval = () => {
  clearTimeout(keepAliveTimer);

  keepAliveTimer = setTimeout(() => {
    clearInterval(keepAliveInterval);
  }, TIME_45_MIN_IN_MS);

  clearInterval(keepAliveInterval);

  sendMessageWorkerKeepAlive();
  keepAliveInterval = setInterval(() => {
    if (apis.runtime.id) {
      sendMessageWorkerKeepAlive();
    }
  }, WORKER_KEEP_ALIVE_INTERVAL);
};
