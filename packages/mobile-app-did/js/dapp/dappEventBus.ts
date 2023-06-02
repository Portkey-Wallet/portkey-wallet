import { NetworkType } from '@portkey-wallet/types';
import {
  DappEvents,
  ResponseCode,
  IResponseType,
  Accounts,
  ChainIds,
  ConnectInfo,
  ProviderErrorType,
} from '@portkey/provider-types';
import DappMobileOperator from './dappMobileOperator';

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
  public static dispatchEvent(params: DappEventPack): void;
  public static dispatchEvent(params: DappEventPack<'chainChanged', ChainIds>): void;
  public static dispatchEvent(params: DappEventPack<'accountsChanged', Accounts>): void;
  public static dispatchEvent(params: DappEventPack<'networkChanged', NetworkType>): void;
  public static dispatchEvent(params: DappEventPack<'connected', ConnectInfo>): void;
  public static dispatchEvent(params: DappEventPack<'disconnected', ProviderErrorType>): void;
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
    this.operators.forEach(operator => {
      if (origin && origin !== operator.dapp.origin) return;
      operator?.publishEvent?.(event as any);
    });
    callback?.();
  }
}
