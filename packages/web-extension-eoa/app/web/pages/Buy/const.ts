import { MAIN_CHAIN_ID } from '@portkey-wallet/constants/constants-ca/activity';
import { ELF_SYMBOL } from '@portkey-wallet/constants/constants-ca/assets';
import { IRampProviderType, RampType } from '@portkey-wallet/ramp';
import { IGetBuyDetail, IGetSellDetail } from '@portkey-wallet/utils/ramp';

export const MAX_UPDATE_TIME = 15;
export const initCryptoAmount = '400';

export const initPreviewData = {
  crypto: ELF_SYMBOL,
  network: MAIN_CHAIN_ID,
  fiat: 'USD',
  country: 'US',
  amount: initCryptoAmount,
  side: RampType.BUY,
};

export const InitProviderSelected: IGetBuyDetail | IGetSellDetail = {
  cryptoAmount: '',
  exchange: '',
  fiatAmount: '',
  amount: '',
  providerNetwork: '',
  providerSymbol: '',
  feeInfo: {
    networkFee: {
      amount: '',
      symbol: '',
      type: 'FIAT',
    },
    rampFee: {
      amount: '',
      symbol: '',
      type: 'FIAT',
    },
  },
  providerInfo: {
    appId: '',
    baseUrl: '',
    coverage: {
      buy: true,
      sell: true,
    },
    key: IRampProviderType.AlchemyPay,
    logo: '',
    name: '',
    paymentTags: [],
  },
  thirdPart: IRampProviderType.AlchemyPay,
};
