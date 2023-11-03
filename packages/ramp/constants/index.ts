import { AlchemyProvider, TransakProvider } from '..';
import { IRampProviderMap } from '../types';

export enum RampType {
  BUY = 'BUY',
  SELL = 'SELL',
}

export enum RampTypeLower {
  BUY = 'buy',
  SELL = 'sell',
}

export enum IRampProviderType {
  Alchemy = 'Alchemy',
  Transak = 'Transak',
}

export const InitRampProvidersInfo: IRampProviderMap = {
  Alchemy: new AlchemyProvider({
    providerInfo: {
      key: IRampProviderType.Alchemy,
      name: 'Alchemy Pay',
      appId: '',
      baseUrl: '',
      callbackUrl: '',
      logo: '',
      coverage: {
        buy: false,
        sell: false,
      },
      paymentTags: [],
    },
    service: {} as any,
    sellSocket: {},
  }),
  Transak: new TransakProvider({
    providerInfo: {
      key: IRampProviderType.Transak,
      name: 'Transak',
      appId: '',
      baseUrl: '',
      callbackUrl: '',
      logo: '',
      coverage: {
        buy: false,
        sell: false,
      },
      paymentTags: [],
    },
    service: {} as any,
    sellSocket: {},
  }),
};
