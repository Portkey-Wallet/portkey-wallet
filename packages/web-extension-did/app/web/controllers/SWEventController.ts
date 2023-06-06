/**
 * @file
 * The controller that handles the event
 * chainChanged, accountsChanged, networkChanged, disconnected
 */
import { SendResponseFun } from 'types';
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
} from '@portkey/provider-types';
import { NetworkType } from '@portkey-wallet/types';
import { isNotificationEvents } from '@portkey/providers';
import errorHandler from 'utils/errorHandler';
import { setLocalStorage } from 'utils/storage/chromeStorage';
import { ConnectionsItem } from 'types/storage';

export interface DappEventPack<T = DappEvents, D = any> {
  eventName: T;
  data?: D;
  callback?: SendResponseFun;
  origin?: string;
}

export default class SWEventController {
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
    const isHasTab = tabs.includes(sender.tab.id);
    if (isHasTab) return;
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

  public static async unregisterOperator(tabId?: number) {
    if (!tabId) return;
    const connections = await getConnections();
    if (!connections) {
      return;
    }
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
  public static dispatchEvent(params: DappEventPack): void;
  public static dispatchEvent(params: DappEventPack<'chainChanged', ChainIds>): void;
  public static dispatchEvent(params: DappEventPack<'accountsChanged', Accounts>): void;
  public static dispatchEvent(params: DappEventPack<'networkChanged', NetworkType>): void;
  public static dispatchEvent(params: DappEventPack<'connected', ConnectInfo>): void;
  public static dispatchEvent(params: DappEventPack<'disconnected', ProviderErrorType>): void;
  static async dispatchEvent({ eventName, data, callback, origin }: DappEventPack) {
    const connections = await getConnections();
    let connectionList: ConnectionsItem[];
    if (origin && origin !== '*' && connections[origin]) {
      connectionList = [connections[origin]];
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
          callback?.(lastError ? lastError : res);
        });
      });
    });
  }
}
