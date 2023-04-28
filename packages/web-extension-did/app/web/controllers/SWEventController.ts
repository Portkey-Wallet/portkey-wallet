/**
 * @file
 * The controller that handles the event
 * chainChanged, accountsChanged, lockStateChanged
 */
import { BaseChainType } from '@portkey-wallet/types/chain';
import { AccountType } from '@portkey-wallet/types/wallet';
import { NOTIFICATION_NAMES } from 'messages/InternalMessageTypes';
import { SendResponseFun } from 'types';
import { ConnectionsType } from 'types/storage';
import { apis } from 'utils/BrowserApis';
import errorHandler from 'utils/errorHandler';
import { getLocalStorage, setLocalStorage } from 'utils/storage/chromeStorage';

let _isLocked: boolean;

export default class SWEventController {
  static async chainChanged(payload: BaseChainType, sendResponse: SendResponseFun) {
    sendResponse({
      ...errorHandler(0),
      data: payload,
    });

    const data = {
      chainId: payload.chainId,
      chainType: payload.chainType,
      rpcUrl: payload.rpcUrl,
      blockExplorerURL: payload.blockExplorerURL,
      nativeCurrency: payload.nativeCurrency,
    };
    this._sendMessage('CHAIN_CHANGED', data);
  }

  static async accountsChanged(payload: AccountType | undefined, sendResponse: SendResponseFun) {
    sendResponse({
      ...errorHandler(0),
      data: payload,
    });
    const data = payload
      ? [
          {
            accountName: payload.accountName,
            address: payload.address,
          },
        ]
      : [];
    this._sendMessage('ACCOUNTS_CHANGED', data);
  }

  // TODO
  static async onDisconnect(data: any, sendResponse?: SendResponseFun) {
    this._sendMessage('DISCONNECT', data, sendResponse);
  }

  static async lockStateChanged(isLocked: boolean, sendResponse?: SendResponseFun) {
    if (_isLocked === isLocked) return;
    setLocalStorage({
      locked: isLocked,
    });
    sendResponse?.({
      ...errorHandler(0),
      data: {
        isLocked,
      },
    });
    this._sendMessage('UNLOCK_STATE_CHANGED', {
      isLocked,
    });
  }

  static async _sendMessage(
    method: keyof typeof NOTIFICATION_NAMES,
    data: any,
    responseCallback?: (response: any) => void,
  ) {
    console.log('_sendMessage', method, data);
    const connections: ConnectionsType = (await getLocalStorage('connections')) ?? {};
    Object.values(connections).forEach((connection) => {
      // const tabId = sender?.tab?.id;
      const tabs = connection.tabs;
      tabs?.forEach((tabId) => {
        if (!tabId) return;
        apis.tabs.sendMessage(
          tabId,
          {
            method: NOTIFICATION_NAMES[method],
            data,
            tabId,
          },
          (res) => {
            const { lastError } = apis.runtime;
            responseCallback?.(lastError ? lastError : res);
            // lastError && console.log(lastError, tabId, '_sendMessage==');
          },
        );
      });
    });
  }
}
