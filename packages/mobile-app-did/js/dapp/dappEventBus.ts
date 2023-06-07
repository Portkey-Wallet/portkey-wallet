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
import { getWallet } from 'utils/redux';
import { handleAccounts, handleChainIds } from '@portkey-wallet/utils/dapp';
import { removeDapp } from '@portkey-wallet/store/store-ca/dapp/actions';

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
  public static emit(action: string, payload: any) {
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
