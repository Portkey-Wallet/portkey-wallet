import { IRampStateType } from './type';

export const initialRampState: IRampStateType = {
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
