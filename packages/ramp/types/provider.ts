import { IRampProviderType, RampType } from '../constants';
import { RampProvider } from '../provider';
import { IRampSellSocket } from './sellSocket';
import { IAlchemyRampService, IRampService, ITransakRampService } from './services';

export interface IRampProvider {
  providerInfo: IRampProviderInfo;
  service: IRampService;
  sellSocket: IRampSellSocket;
  generateUrl: (params: IRampProviderGenerateUrl) => void;
}
export interface IAlchemyProvider extends IRampProvider {
  getAchToken: (email: string) => void;
  getAchSignature: (address: string) => void;
}

export type ITransakProvider = IRampProvider;

export interface IRampProviderOptions {
  providerInfo: IRampProviderInfo;
  service: IRampService;
  sellSocket: IRampSellSocket;
}

export interface IAlchemyRampProviderOptions extends IRampProviderOptions {
  service: IAlchemyRampService;
}

export interface ITransakRampProviderOptions extends IRampProviderOptions {
  service: ITransakRampService;
}

export type IRampProviderMap = {
  [T in IRampProviderType]?: RampProvider; // AlchemyProvider | TransakProvider
};

export type IRampProvidersInfo = {
  [T in IRampProviderType]?: IRampProviderInfo;
};

export type IRampProviderInfo = {
  key: IRampProviderType;
  name: string;
  appId: string;
  baseUrl: string;
  callbackUrl?: string;
  logo: string;
  coverage: IRampProviderCoverage;
  paymentTags: string[];
};

export type IRampProviderCoverage = {
  buy: boolean;
  sell: boolean;
};

export type IRampProviderGenerateUrl = {
  type: RampType;
  address: string;
  email?: string;
};
