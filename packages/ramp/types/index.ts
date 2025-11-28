import { IRampProviderType } from '../constants';
import { IClientType } from './config';
import { IRampRequest } from './request';

export * from './services';
export * from './signalr';
export * from './config';
export * from './provider';
export * from './request';
export * from './utils';

export interface IBaseRampOptions {
  request: IRampRequest;
  baseUrl?: string;
  clientType?: IClientType;
}

export enum ITransDirectEnum {
  TOKEN_BUY = 'TokenBuy',
  TOKEN_SELL = 'TokenSell',
}
export interface IOrderInfo {
  orderId: string;
  merchantName: IRampProviderType;
  address: string;
  network: string;
  crypto: string;
  cryptoAmount: string;
  cryptoPrice: string;
  decimals: string;
  status: string;
  displayStatus: string;
  transDirect: ITransDirectEnum; // TokenBuy,TokenSell
}

export interface IGenerateTransactionResult {
  publicKey: string;
  signature: string; // sign(md5(orderId + rawTransaction))
  rawTransaction: string;
}

export type IGenerateTransaction = (order: IOrderInfo) => Promise<IGenerateTransactionResult>;
