import { NetworkType } from '@portkey-wallet/types';
import {
  DappEvents,
  ResponseCode,
  IResponseType,
  Accounts,
  ChainIds,
  ConnectInfo,
  ProviderErrorType,
  NotificationEvents,
} from '@portkey/provider-types';
import DappMobileOperator from './dappMobileOperator';
import { DappMiddle } from '@portkey-wallet/utils/dapp/middle';
import { changeNetworkType, setCAInfo } from '@portkey-wallet/store/store-ca/wallet/actions';
import { getWallet } from '../utils/redux';
import { handleAccounts, handleChainIds } from '@portkey-wallet/utils/dapp';
import { addDapp, removeDapp, resetDappList } from '@portkey-wallet/store/store-ca/dapp/actions';
import { sleep } from '@portkey-wallet/utils';

export interface DappEventPack<T = DappEvents, D = any> {
  eventName: T;
  data?: D;
  callback?: () => void;
  origin?: string;
  msg?: string;
}

export default class DappEventBus {
  private static operators: Array<DappMobileOperator> = [];
  public static registerOperator(operator: DappMobileOperator) {
    if (this.operators.includes(operator)) return;
    this.operators.push(operator);
  }
  public static unregisterOperator(operator: DappMobileOperator) {
    this.operators = this.operators.filter(item => item !== operator);
  }
  public static async emit(action: string, payload: any) {
    await sleep(100);
    switch (action) {
      case changeNetworkType.toString(): {
        const { currentNetwork } = getWallet();
        DappEventBus.dispatchEvent({ eventName: NotificationEvents.NETWORK_CHANGED, data: currentNetwork });
        break;
      }
      case setCAInfo.toString(): {
        const wallet = getWallet();
        DappEventBus.dispatchEvent({ eventName: NotificationEvents.ACCOUNTS_CHANGED, data: handleAccounts(wallet) });
        DappEventBus.dispatchEvent({ eventName: NotificationEvents.CHAIN_CHANGED, data: handleChainIds(wallet) });
        break;
      }
      case removeDapp.toString(): {
        if (payload.origin)
          DappEventBus.dispatchEvent({
            eventName: NotificationEvents.DISCONNECTED,
            origin: payload.origin,
            data: {
              message: 'user disconnected',
              code: ResponseCode.USER_DENIED,
            },
          });
        break;
      }
      case addDapp.toString(): {
        if (payload.dapp) {
          const wallet = getWallet();
          DappEventBus.dispatchEvent({
            origin: payload.dapp.origin,
            eventName: NotificationEvents.CONNECTED,
            data: {
              chainIds: handleChainIds(wallet),
            },
          });
        }
        break;
      }
      case resetDappList.toString(): {
        DappEventBus.dispatchEvent({
          eventName: NotificationEvents.DISCONNECTED,
          data: {
            message: 'user logout',
            code: ResponseCode.USER_DENIED,
          },
        });
        break;
      }
    }
  }

  public static dispatchEvent(params: DappEventPack<typeof NotificationEvents.CHAIN_CHANGED, ChainIds>): void;
  public static dispatchEvent(params: DappEventPack<typeof NotificationEvents.ACCOUNTS_CHANGED, Accounts>): void;
  public static dispatchEvent(params: DappEventPack<typeof NotificationEvents.NETWORK_CHANGED, NetworkType>): void;
  public static dispatchEvent(params: DappEventPack<typeof NotificationEvents.CONNECTED, ConnectInfo>): void;
  public static dispatchEvent(params: DappEventPack<typeof NotificationEvents.DISCONNECTED, ProviderErrorType>): void;
  public static dispatchEvent({ eventName, data, callback, origin, msg }: DappEventPack) {
    const event: IResponseType = {
      eventName,
      info: {
        code: ResponseCode.SUCCESS,
        data,
        msg,
      },
      origin,
    };
    DappEventBus.operators.forEach(operator => {
      if (origin && origin !== operator.dapp.origin) return;
      operator?.publishEvent?.(event as any);
    });
    callback?.();
  }
}

// register event
DappMiddle.registerEvent(DappEventBus);
