import { IRampProviderInfo } from './provider';
import { IBuyProviderDetail, ISellProviderDetail } from './services';

export type IBuyProviderPrice = IBuyProviderDetail & {
  providerInfo: IRampProviderInfo;
};

export type ISellProviderPrice = ISellProviderDetail & {
  providerInfo: IRampProviderInfo;
};
