import { message } from 'antd';
import { ENVIRONMENT_TYPE_POPUP } from 'constants/envType';
import {
  ACK_KEEP_ALIVE_MESSAGE,
  ACK_KEEP_ALIVE_WAIT_TIME,
  WORKER_KEEP_ALIVE_INTERVAL,
  WORKER_KEEP_ALIVE_MESSAGE,
} from 'constants/index';
import { checkForError } from 'utils';
import { apis } from './BrowserApis';
import { errorToReload } from './errorHtml';

export function keepSWActive({
  port,
  name,
  onMessageListener,
}: {
  port?: chrome.runtime.Port;
  name: string;
  onMessageListener: (message: any, port: chrome.runtime.Port) => void;
}) {
  port = apis.runtime.connect({ name });
  console.log(port, 'keepSWActive==port===');
  const disconnectListener = (_port: chrome.runtime.Port) => {
    const err = checkForError();
    _port.onDisconnect.removeListener(disconnectListener);
    _port.onMessage.removeListener(onMessageListener);
    /**
     * If an error is found, reset the streams. When running two or more dapps, resetting the service
     * worker may cause the error, "Error: Could not establish connection. Receiving end does not
     * exist.", due to a race-condition. The disconnect event may be called by runtime.connect which
     * may cause issues. We suspect that this is a chromium bug as this event should only be called
     * once the port and connections are ready. Delay time is arbitrary.
     */
    console.log(err, 'keepSWActive==error');
    keepSWActive({ port: _port, name, onMessageListener });
  };
  port.onDisconnect.addListener(disconnectListener);
  port.onMessage.addListener(onMessageListener);
}

/*
 * As long as UI is open it will keep sending messages to service worker
 * In service worker as this message is received
 * if service worker is inactive it is reactivated and script re-loaded
 * Time has been kept to 1000ms but can be reduced for even faster re-activation of service worker
 */
let extensionPort: chrome.runtime.Port;
let lastMessageReceivedTimestamp = Date.now();
let ackTimeoutToDisplayError: NodeJS.Timeout;
let isHasMessage: boolean;
export const keepAliveOnPages = ({ onError }: { onError?: () => void }) => {
  const windowType = ENVIRONMENT_TYPE_POPUP;
  extensionPort = apis.runtime.connect({ name: windowType });
  const ackKeepAliveListener = (message: chrome.runtime.Port) => {
    if (message.name === ACK_KEEP_ALIVE_MESSAGE) {
      lastMessageReceivedTimestamp = Date.now();
      clearTimeout(ackTimeoutToDisplayError);
    }
  };

  const keepAliveInterval = setInterval(() => {
    apis.runtime.sendMessage({ name: WORKER_KEEP_ALIVE_MESSAGE });

    if (extensionPort !== null && extensionPort !== undefined) {
      extensionPort.postMessage({ name: WORKER_KEEP_ALIVE_MESSAGE });

      if (extensionPort.onMessage.hasListener(ackKeepAliveListener) === false) {
        extensionPort.onMessage.addListener(ackKeepAliveListener);
      }
    }
    ackTimeoutToDisplayError = setTimeout(() => {
      if (Date.now() - lastMessageReceivedTimestamp > ACK_KEEP_ALIVE_WAIT_TIME) {
        clearInterval(keepAliveInterval);
        if (!isHasMessage) {
          isHasMessage = true;
          // message.error(errorToReload, 0, () => (isHasMessage = false));
          onError?.();
        }
        console.log('somethingIsWrong', new Error("Something's gone wrong. Try reloading the page."));
      }
    }, ACK_KEEP_ALIVE_WAIT_TIME);
  }, WORKER_KEEP_ALIVE_INTERVAL);
};
