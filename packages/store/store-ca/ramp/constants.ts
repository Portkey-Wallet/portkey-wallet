import { IRampStateType } from './type';

export const initialRampState: IRampStateType = {
  rampInfo: {
    Alchemy: {
      name: '',
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
    Transak: {
      name: '',
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
  },
  rampEntry: {
    isRampShow: true,
    isBuySectionShow: true,
    isSellSectionShow: true,
  },
  buyFiatList: [],
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
