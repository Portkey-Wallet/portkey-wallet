import { MAIN_CHAIN_ID } from '@portkey-wallet/constants/constants-ca/activity';
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
    icon: '',
  },
  buyDefaultCryptoList: [],
  buyDefaultCrypto: {
    symbol: '',
    amount: '',
    network: '',
    chainId: MAIN_CHAIN_ID,
    icon: '',
  },
  sellCryptoList: [],
  sellDefaultCrypto: {
    symbol: '',
    amount: '',
    network: '',
    chainId: MAIN_CHAIN_ID,
    icon: '',
  },
  sellDefaultFiatList: [],
  sellDefaultFiat: {
    symbol: '',
    amount: '',
    country: '',
    countryName: '',
    icon: '',
  },
};
