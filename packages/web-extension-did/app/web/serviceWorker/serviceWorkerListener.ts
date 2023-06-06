/**
 * @file serviceWorkerListener.ts
 *  Listen for onInstalled, storage.onChanged, tabs.onRemoved, runtime.onConnect
 */
import { AutoLockDataKey, AutoLockDataType } from 'constants/lock';
import { apis } from 'utils/BrowserApis';
import storage from 'utils/storage/storage';
import connectListener from './connectListener';
import SWEventController from 'controllers/SWEventController';

interface ListenerHandler {
  pageStateChange: (pageStateChanges: any) => void;
  checkRegisterStatus: () => Promise<unknown>;
  checkTimingLock: () => void;
}

const serviceWorkerListener = ({ pageStateChange, checkRegisterStatus, checkTimingLock }: ListenerHandler) => {
  // On first install, open a new tab with Portkey
  apis.runtime.onInstalled.addListener(async ({ reason }) => {
    checkRegisterStatus();
    console.log('reason', reason);
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  apis.storage.onChanged.addListener((changes) => {
    console.log('storage.onChanged', changes);
    if (storage.registerStatus in changes) {
      pageStateChange({
        registerStatus: changes[storage.registerStatus].newValue,
      });
    } else if (storage.lockTime in changes) {
      checkTimingLock();

      pageStateChange({
        lockTime: AutoLockDataType[changes[storage.lockTime].newValue as AutoLockDataKey],
      });
    }
  });

  connectListener();
  apis.tabs.onRemoved.addListener((tabId) => {
    SWEventController.unregisterOperator(tabId);
  });
};
export default serviceWorkerListener;
