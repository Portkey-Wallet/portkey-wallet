/**
 * @file
 * When serviceWorker disconnects, reconnect
 */
import { ENVIRONMENT_TYPE_SERVICE_WORKER } from 'constants/envType';
import { ACK_KEEP_ALIVE_MESSAGE, WORKER_KEEP_ALIVE_MESSAGE } from 'constants/index';
import SWController from 'controllers/SWController';
import { getEnvironmentType } from 'utils';
import { apis } from 'utils/BrowserApis';
import errorHandler from 'utils/errorHandler';
import popupHandler from 'utils/popupHandler';
import { getLocalStorage, setLocalStorage } from 'utils/storage/chromeStorage';

// function onMessage(msg: any, port: any) {
//   console.log('received', msg, 'from', port.sender);
// }

// function deleteTimer(port: any) {
//   if (port._timer) {
//     clearTimeout(port._timer);
//     delete port._timer;
//   }
// }
// function forceReconnect(port: any) {
//   deleteTimer(port);
//   console.log('keepSWActive=forceReconnect===');
//   port.disconnect();
// }

export default function connectListener() {
  apis.runtime.onConnect.addListener(async (port: any) => {
    const portType = getEnvironmentType(port.sender.url);
    if (portType === 'popup') {
      // Save popup router state
      port.onDisconnect.addListener(async () => {
        // popup close;
        const state = await getLocalStorage('locationState');
        setLocalStorage({
          lastLocationState: state,
        });
        popupHandler.closeHandler();
      });
    }
    const isContentConnect = portType === ENVIRONMENT_TYPE_SERVICE_WORKER;
    if (isContentConnect) {
      SWController.connectWebAppByTab(port.sender);
      // console.log(port, 'connectListener===port');
      // if (port.name !== WORKER_KEEP_ALIVE_MESSAGE) return;

      // port.onMessage.addListener(onMessage);
      // port.onDisconnect.addListener(deleteTimer);
      // port._timer = setTimeout(forceReconnect, TIME_45_MIN_IN_MS, port);
    }
    // sendReadyMessageToTabs();

    // use setInterval
    if (!isContentConnect)
      port.onMessage.addListener((message: chrome.runtime.Port) => {
        // If we get a WORKER_KEEP_ALIVE message, we respond with an ACK
        console.log('runWorkerKeepAliveInterval', message.name);
        if (message.name === WORKER_KEEP_ALIVE_MESSAGE) {
          // To test un-comment this line and wait for 1 minute. An error should be shown on MetaMask UI.
          port.postMessage({ name: ACK_KEEP_ALIVE_MESSAGE });
        }
      });
  });

  apis.runtime.onMessage.addListener((message: any, _sender: any, sendResponse: (response?: any) => void) => {
    if (message.name === WORKER_KEEP_ALIVE_MESSAGE) {
      // console.log('runWorkerKeepAliveInterval==onMessage');
      sendResponse(errorHandler(0));
    }
  });
}
