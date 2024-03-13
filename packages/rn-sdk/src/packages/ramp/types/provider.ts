import { IRampProviderType, RampType } from '../constants';
import { IAlchemyPayRampService, IGetOrderNoRequest, IRampService } from './services';

export interface IRampProvider {
  providerInfo: IRampProviderInfo;
  service: IRampService;
  getOrderId(params: IGetOrderNoRequest): Promise<string>;
  createOrder(params: IRampProviderCreateOrderParams): Promise<IRampProviderCreateOrderResult>;
}
export interface IAlchemyPayProvider extends IRampProvider {
  service: IAlchemyPayRampService;
  getToken(email: string): void;
  getSignature(address: string): void;
}

export interface IRampProviderOptions {
  providerInfo: IRampProviderInfo;
  service: IRampService;
}

export interface IAlchemyPayRampProviderOptions extends IRampProviderOptions {
  service: IAlchemyPayRampService;
}

export type IRampProviderMap = {
  [T in IRampProviderType]?: IRampProvider; // AlchemyPayProvider | TransakProvider
};

export interface IRampProviderInfo {
  key: IRampProviderType;
  name: string;
  appId: string;
  baseUrl: string;
  callbackUrl?: string;
  logo: string;
  coverage: IRampProviderCoverage;
  paymentTags: string[];
}

export interface IRampProviderCoverage {
  buy: boolean;
  sell: boolean;
}

export type IRampProviderCreateOrderParams = {
  type: RampType;
  address: string;
  email?: string;
  crypto: string;
  network: string;
  country: string;
  fiat: string;
  amount: string;
  withdrawUrl?: string; // only for sell
};

export type IRampProviderCreateOrderResult = { orderId: string; url: string };

export type AlchemyPayHandleOrderQuery = {
  appId: string;
  callbackUrl: string;
  type: string;
  network: string;
  country: string;
  fiat: string;
  crypto: string;
  merchantOrderNo: string;
};

export type AlchemyPayHandleBuyOrderQuery = AlchemyPayHandleOrderQuery & {
  fiatAmount: string;
  token?: string;
  address?: string;
  sign?: string;
};

export type AlchemyPayHandleSellOrderQuery = AlchemyPayHandleOrderQuery & {
  cryptoAmount: string;
  withdrawUrl: string;
  source: string;
};
