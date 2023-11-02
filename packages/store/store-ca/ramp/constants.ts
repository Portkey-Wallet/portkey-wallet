import { IRampStateType } from './type';

export const initialRampState: IRampStateType = {
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
  buyFiatList: [],
  buyDefaultFiat: {
    symbol: '',
    amount: '',
    country: '',
    countryName: '',
  },
  buyDefaultCryptoList: [],
  buyDefaultCrypto: {
    symbol: '',
    amount: '',
    network: '',
  },
  sellCryptoList: [],
  sellDefaultCrypto: {
    symbol: '',
    amount: '',
    network: '',
  },
  sellDefaultFiatList: [],
  sellDefaultFiat: {
    symbol: '',
    amount: '',
    country: '',
    countryName: '',
  },
};
