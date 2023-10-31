import { IRampStateType } from './type';

export const initialRampState: IRampStateType = {
  buyFiatList: [],
  sellFiatList: [],
  rampInfo: {
    Alchemy: {
      name: '',
      appId: '',
      baseUrl: '',
      logo: '',
      coverage: {
        buy: false,
        sell: false,
      },
      paymentTags: [],
    },
    Transak: {
      name: '',
      appId: '',
      baseUrl: '',
      logo: '',
      coverage: {
        buy: false,
        sell: false,
      },
      paymentTags: [],
    },
  },
  rampEntry: {
    isRampShow: true,
    isBuySectionShow: true,
    isSellSectionShow: true,
  },
  buyCryptoList: [],
  buyDefaultCrypto: {
    symbol: '',
    amount: '',
  },
  buyDefaultFiat: {
    symbol: '',
    amount: '',
  },
  sellCryptoList: [],
  sellDefaultCrypto: {
    symbol: '',
    amount: '',
  },
  sellDefaultFiat: {
    symbol: '',
    amount: '',
  },
};
