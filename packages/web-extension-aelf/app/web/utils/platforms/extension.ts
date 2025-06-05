import { checkForError } from 'utils';
import { apis } from 'utils/BrowserApis';

export default class ExtensionPlatform {
  //
  // Public
  //
  reload() {
    apis.runtime.reload();
  }

  openTab(options: chrome.tabs.CreateProperties): Promise<chrome.tabs.Tab> {
    return new Promise((resolve, reject) => {
      apis.tabs.create(options).then((newTab) => {
        const error = checkForError();
        if (error) {
          return reject(error);
        }
        return resolve(newTab);
      });
    });
  }

  openWindow(options: chrome.windows.CreateData): Promise<chrome.windows.Window> {
    return new Promise((resolve, reject) => {
      apis.windows.create(options).then((newWindow) => {
        const error = checkForError();
        if (error) {
          return reject(error);
        }
        return resolve(newWindow);
      });
    });
  }

  focusWindow(windowId: number, updateInfo?: chrome.windows.UpdateInfo): Promise<chrome.windows.Window> {
    return new Promise((resolve, reject) => {
      apis.windows.update(windowId, { ...updateInfo, focused: true }).then((v) => {
        const error = checkForError();
        if (error) {
          return reject(error);
        }
        return resolve(v);
      });
    });
  }

  updateWindowPosition(windowId: number, left?: number, top?: number): Promise<chrome.windows.Window> {
    return new Promise((resolve, reject) => {
      apis.windows.update(windowId, { left, top }).then((v) => {
        const error = checkForError();
        if (error) {
          return reject(error);
        }
        return resolve(v);
      });
    });
  }

  getLastFocusedWindow(): Promise<chrome.windows.Window> {
    return new Promise((resolve, reject) => {
      apis.windows.getLastFocused().then((windowObject) => {
        const error = checkForError();
        if (error) {
          return reject(error);
        }
        return resolve(windowObject);
      });
    });
  }

  closeWindow(windowId?: number) {
    return windowId && apis.windows.remove(windowId);
  }

  closeCurrentWindow() {
    return apis.windows.getCurrent().then((windowDetails: chrome.windows.Window) => {
      windowDetails.id && apis.windows.remove(windowDetails.id);
    });
  }

  // openExtensionInapis(route = null, queryString = null, keepWindowOpen = false) {
  //   let extensionURL = apis.runtime.getURL('home.html');

  //   if (route) {
  //     extensionURL += `#${route}`;
  //   }

  //   if (queryString) {
  //     extensionURL += `?${queryString}`;
  //   }

  //   this.openTab({ url: extensionURL });
  //   if (getEnvironmentType() !== ENVIRONMENT_TYPE_BACKGROUND && !keepWindowOpen) {
  //     window.close();
  //   }
  // }

  getPlatformInfo(cb: (v: any) => void) {
    try {
      const platformInfo = apis.runtime.getPlatformInfo();
      cb(platformInfo);
      return;
    } catch (e: any) {
      cb(e);
      // eslint-disable-next-line no-useless-return
      return;
    }
  }

  // showTransactionNotification(txMeta, rpcPrefs) {
  //   const { status, txReceipt: { status: receiptStatus } = {} } = txMeta;

  //   if (status === TRANSACTION_STATUSES.CONFIRMED) {
  //     // There was an on-chain failure
  //     receiptStatus === '0x0'
  //       ? this._showFailedTransaction(txMeta, 'Transaction encountered an error.')
  //       : this._showConfirmedTransaction(txMeta, rpcPrefs);
  //   } else if (status === TRANSACTION_STATUSES.FAILED) {
  //     this._showFailedTransaction(txMeta);
  //   }
  // }

  windowOnRemovedListener(listener: (windowId: number) => void) {
    apis.windows.onRemoved.addListener(listener);
  }

  tabOnRemovedListener(listener: (windowId: number) => void) {
    apis.tabs.onRemoved.addListener(listener);
  }

  getAllWindows(): Promise<chrome.windows.Window[]> {
    return new Promise((resolve, reject) => {
      apis.windows.getAll().then((windows) => {
        const error = checkForError();
        if (error) {
          return reject(error);
        }
        return resolve(windows);
      });
    });
  }

  getActiveTabs() {
    return new Promise((resolve, reject) => {
      apis.tabs.query({ active: true }).then((tabs) => {
        const error = checkForError();
        if (error) {
          return reject(error);
        }
        return resolve(tabs);
      });
    });
  }

  currentTab() {
    return new Promise((resolve, reject) => {
      apis.tabs.getCurrent().then((tab) => {
        const err = checkForError();
        if (err) {
          reject(err);
        } else {
          resolve(tab);
        }
      });
    });
  }

  switchToTab(tabId: number) {
    return new Promise((resolve, reject) => {
      apis.tabs.update(tabId, { highlighted: true }).then((tab) => {
        const err = checkForError();
        if (err) {
          reject(err);
        } else {
          resolve(tab);
        }
      });
    });
  }

  closeTab(tabId?: number) {
    return new Promise((resolve, reject) => {
      if (!tabId) return reject('TabId is undefined');
      apis.tabs.remove(tabId).then(() => {
        const err = checkForError();
        if (err) {
          reject(err);
        } else {
          resolve('');
        }
      });
    });
  }

  // _showConfirmedTransaction(txMeta, blockExplorerUrl: string) {
  //   this._subscribeToNotificationClicked();

  //   const url = getExploreLink(txMeta, blockExplorerUrl);
  //   const nonce = parseInt(txMeta.txParams.nonce, 16);

  //   const title = 'Confirmed transaction';
  //   const message = `Transaction ${nonce} confirmed! ${url.length ? 'View on Etherscan' : ''}`;
  //   this._showNotification(title, message, url);
  // }

  // _showFailedTransaction(txMeta, errorMessage) {
  //   const nonce = parseInt(txMeta.txParams.nonce, 16);
  //   const title = 'Failed transaction';
  //   const message = `Transaction ${nonce} failed! ${errorMessage || txMeta.err.message}`;
  //   this._showNotification(title, message);
  // }

  // _showNotification(title: string, message: string, url: string) {
  //   apis.notifications.create(url, {
  //     type: 'basic',
  //     title,
  //     iconUrl: apis.runtime.getURL('../../images/icon-64.png'),
  //     message,
  //   });
  // }

  // _subscribeToNotificationClicked() {
  //   if (!apis.notifications.onClicked.hasListener(this._viewOnEtherscan)) {
  //     apis.notifications.onClicked.addListener(this._viewOnEtherscan);
  //   }
  // }

  _viewOnEtherscan(url: string) {
    if (url.startsWith('https://')) {
      apis.tabs.create({ url });
    }
  }
}
