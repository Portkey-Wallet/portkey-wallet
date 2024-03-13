/**
 * @remarks
 * The controller that handles the event
 * chainChanged, accountsChanged, networkChanged, disconnected, connected
 */
import { apis } from 'utils/BrowserApis';
import { getConnections } from 'utils/storage/storage.utils';
import {
  ChainIds,
  Accounts,
  DappEvents,
  ConnectInfo,
  IResponseType,
  ResponseCode,
  ProviderErrorType,
  NotificationEvents,
} from '@portkey/provider-types';
import { NetworkType } from '@portkey-wallet/types';
import { isNotificationEvents } from '@portkey/providers';
import errorHandler from 'utils/errorHandler';
import { setLocalStorage } from 'utils/storage/chromeStorage';
import { ConnectionsItem } from 'types/storage';
import { changeNetworkType, setCAInfo } from '@portkey-wallet/store/store-ca/wallet/actions';
import { getDappState, getWalletState } from 'utils/lib/SWGetReduxStore';
import InternalMessage from 'messages/InternalMessage';
import { handleAccounts, handleChainIds } from '@portkey-wallet/utils/dapp';
import { addDapp, removeDapp, resetDapp, resetDappList } from '@portkey-wallet/store/store-ca/dapp/actions';
import { sleep } from '@portkey-wallet/utils';

export interface DappEventPack<T = DappEvents, D = any> {
  eventName: T;
  data?: D;
  origin?: string;
}

export default class SWEventController {
  /** Add dapps tadId  */
  public static async registerOperator(sender: chrome.runtime.MessageSender) {
    if (!sender.url || !sender?.tab?.id) throw errorHandler(600001);
    const key = new URL(sender.url).origin;
    const connections = await getConnections();
    if (!connections[key]) {
      connections[key] = {
        tabs: [],
      };
    }
    const tabs = connections[key].tabs;
    if (tabs.includes(sender.tab.id)) return;
    tabs.push(sender.tab.id);

    connections[key] = {
      ...connections[key],
      id: sender.id,
      origin: sender.origin,
      tabs,
    };
    return setLocalStorage({
      connections,
    });
  }
  /** Remove dapps tadId  */
  public static async unregisterOperator(tabId?: number) {
    if (!tabId) return;
    const connections = await getConnections();
    if (!connections) return;
    Object.entries(connections).forEach(([key, v]) => {
      connections[key].tabs = v.tabs.filter((id) => tabId !== id);
      if (connections[key].tabs.length === 0) delete connections[key];
    });
    return setLocalStorage({
      connections,
    });
  }

  public static checkEventMethod(eventName: string): boolean {
    return isNotificationEvents(eventName);
  }

  public static checkDispatchEventParams(data: DappEventPack): boolean {
    if (!data) return false;
    return true;
  }

  public static check(eventName: string, data: any): boolean {
    return SWEventController.checkEventMethod(eventName) && SWEventController.checkDispatchEventParams(data);
  }

  public static dispatchEvent(params: DappEventPack): void;
  public static dispatchEvent(params: DappEventPack<'chainChanged', ChainIds>): void;
  public static dispatchEvent(params: DappEventPack<'accountsChanged', Accounts>): void;
  public static dispatchEvent(params: DappEventPack<'networkChanged', NetworkType>): void;
  public static dispatchEvent(params: DappEventPack<'connected', ConnectInfo>): void;
  public static dispatchEvent(params: DappEventPack<'disconnected', ProviderErrorType>): void;
  static async dispatchEvent({ eventName, data, origin }: DappEventPack) {
    const connections = await getConnections();
    let connectionList: ConnectionsItem[] = [];
    if (origin && origin !== '*' && connections[origin]) {
      /** Send an event to the specified origin */
      connectionList.push(connections[origin]);
    } else if (eventName === 'accountsChanged' || eventName === 'connected') {
      /** Only send events to connected dapps */
      const { currentNetwork } = await getWalletState();
      const { dappMap } = await getDappState();
      const connectDappList = dappMap[currentNetwork];
      connectDappList?.forEach((dapp) => {
        if (connections[dapp.origin]) connectionList.push(connections[dapp.origin]);
      });
    } else {
      connectionList = Object.values(connections);
    }
    if (!connectionList) return;
    connectionList.forEach((connection) => {
      const tabs = connection.tabs;
      tabs?.forEach((tabId) => {
        if (!tabId) return;
        const event: IResponseType = {
          eventName,
          info: {
            code: ResponseCode.SUCCESS,
            data,
          },
          origin,
        };
        apis.tabs.sendMessage(tabId, event, (res) => {
          const { lastError } = apis.runtime;
          if (lastError) SWEventController.unregisterOperator(tabId);
          console.error('dispatchEvent:tabs.sendMessage', lastError, res);
        });
      });
    });
  }
  // Trigger events based on user operations to notify service workers
  public static async emit(action: string, payload: any) {
    console.log(action, payload, 'action==action');
    // Asynchronous updates lead to data exceptions when emitting
    await sleep(50);
    switch (action) {
      case changeNetworkType.toString(): {
        const { currentNetwork } = await getWalletState();

        InternalMessage.payload(NotificationEvents.NETWORK_CHANGED, { data: currentNetwork }).send();
        break;
      }
      case setCAInfo.toString(): {
        const wallet = await getWalletState();
        await InternalMessage.payload(NotificationEvents.ACCOUNTS_CHANGED, { data: handleAccounts(wallet) }).send();
        await InternalMessage.payload(NotificationEvents.CHAIN_CHANGED, { data: handleChainIds(wallet) }).send();
        break;
      }
      case removeDapp.toString(): {
        if (payload.origin) {
          await InternalMessage.payload(NotificationEvents.DISCONNECTED, {
            data: { message: 'user disconnected', code: ResponseCode.USER_DENIED },
            origin: payload.origin,
          }).send();
        }
        break;
      }
      case addDapp.toString(): {
        if (payload.dapp.origin) {
          const wallet = await getWalletState();
          await InternalMessage.payload(NotificationEvents.CONNECTED, {
            data: {
              chainIds: handleChainIds(wallet),
            },
            origin: payload.dapp.origin,
          }).send();
        }
        break;
      }
      case resetDapp.toString():
      case resetDappList.toString(): {
        await InternalMessage.payload(NotificationEvents.DISCONNECTED, {
          data: { message: 'user logout', code: ResponseCode.USER_DENIED, origin: '*' },
        }).send();
        break;
      }
    }
  }
}
