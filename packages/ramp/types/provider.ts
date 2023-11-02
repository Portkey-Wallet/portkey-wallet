import { IRampProviderType } from '../constants';

export type IRampProvidersInfo = Record<keyof typeof IRampProviderType, IRampProviderInfo>;

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
