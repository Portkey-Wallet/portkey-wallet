import { MAIN_CHAIN_ID } from '@portkey-wallet/constants/constants-ca/activity';
import { IRampStateType } from './type';

export const initialRampState: IRampStateType = {
  rampEntry: {
    isRampShow: false,
    isBuySectionShow: false,
    isSellSectionShow: false,
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
    chainId: MAIN_CHAIN_ID,
  },
  sellCryptoList: [],
  sellDefaultCrypto: {
    symbol: '',
    amount: '',
    network: '',
    chainId: MAIN_CHAIN_ID,
  },
  sellDefaultFiatList: [],
  sellDefaultFiat: {
    symbol: '',
    amount: '',
    country: '',
    countryName: '',
  },
};
