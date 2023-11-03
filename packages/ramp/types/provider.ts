import { RampProvider } from '..';
import { IRampProviderType } from '../constants';
import { IRampSellSocket } from './sellSocket';
import { IAlchemyRampService, IRampService, ITransakRampService } from './services';

export interface IRampProvider {
  providerInfo: IRampProviderInfo;
  service: IRampService;
  sellSocket: IRampSellSocket;
}

export interface IAlchemyRampProvider extends IRampProvider {
  service: IAlchemyRampService;
}

export interface ITransakRampProvider extends IRampProvider {
  service: ITransakRampService;
}

export type IRampProviderMap = {
  [T in IRampProviderType]?: RampProvider;
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
