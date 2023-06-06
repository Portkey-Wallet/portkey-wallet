/**
 * @file
 * When serviceWorker disconnects, reconnect
 */
import { ENVIRONMENT_TYPE_SERVICE_WORKER } from 'constants/envType';
import { ACK_KEEP_ALIVE_MESSAGE, WORKER_KEEP_ALIVE_MESSAGE } from 'constants/index';
import SWEventController from 'controllers/SWEventController';
import { getEnvironmentType } from 'utils';
import { apis } from 'utils/BrowserApis';
import errorHandler from 'utils/errorHandler';
import popupHandler from 'utils/popupHandler';
import { getLocalStorage, setLocalStorage } from 'utils/storage/chromeStorage';

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
      SWEventController.registerOperator(port.sender);
    }

    // use setInterval
    if (!isContentConnect)
      port.onMessage.addListener((message: chrome.runtime.Port) => {
        // If we get a WORKER_KEEP_ALIVE message, we respond with an ACK
        if (message.name === WORKER_KEEP_ALIVE_MESSAGE) {
          // To test un-comment this line and wait for 1 minute. An error should be reload extension
          port.postMessage({ name: ACK_KEEP_ALIVE_MESSAGE });
        }
      });
  });

  apis.runtime.onMessage.addListener((message: any, _sender: any, sendResponse: (response?: any) => void) => {
    if (message.name === WORKER_KEEP_ALIVE_MESSAGE) {
      sendResponse(errorHandler(0));
    }
  });
}
