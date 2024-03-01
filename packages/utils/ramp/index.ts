import { ZERO } from '@portkey-wallet/constants/misc';
import ramp, {
  IGetCryptoDataRequest,
  IGetLimitRequest,
  IGetExchangeRequest,
  IGetBuyPriceRequest,
  IGetBuyDetailRequest,
  IGetFiatDataRequest,
  IGetSellPriceRequest,
  IGetSellDetailRequest,
  IGetSellTransactionRequest,
  ISellProviderPrice,
  IBuyProviderPrice,
} from '@portkey-wallet/ramp';
import { validateError } from '@portkey-wallet/ramp/utils';
import { IRampLimit } from '@portkey-wallet/types/types-ca/ramp';
import BigNumber from 'bignumber.js';

// ======== buy ========
export const getBuyFiat = async (params?: IGetFiatDataRequest) => {
  const {
    data: { fiatList, defaultFiat },
    code,
    message,
    success,
  } = await ramp.service.getBuyFiatData(params);
  validateError(message, success, code);
  return { fiatList, defaultFiat };
};

export const getBuyCrypto = async (params: IGetCryptoDataRequest) => {
  const {
    data: { cryptoList, defaultCrypto },
    code,
    message,
    success,
  } = await ramp.service.getBuyCryptoData(params);
  validateError(message, success, code);
  return { buyCryptoList: cryptoList, buyDefaultCrypto: defaultCrypto };
};

export const getBuyLimit = async (params: IGetLimitRequest): Promise<IRampLimit> => {
  const {
    data: {
      fiat: { symbol, minLimit, maxLimit },
    },
    code,
    message,
    success,
  } = await ramp.service.getBuyLimit(params);
  validateError(message, success, code);
  return {
    symbol,
    minLimit: Number(ZERO.plus(minLimit).decimalPlaces(4, BigNumber.ROUND_UP).valueOf()),
    maxLimit: Number(ZERO.plus(maxLimit).decimalPlaces(4, BigNumber.ROUND_DOWN).valueOf()),
  };
};

export const getBuyExchange = async (params: IGetExchangeRequest) => {
  const {
    data: { exchange },
    code,
    message,
    success,
  } = await ramp.service.getBuyExchange(params);
  validateError(message, success, code);
  return exchange;
};

export const getBuyPrice = async (params: IGetBuyPriceRequest) => {
  const {
    data: { cryptoAmount, exchange, feeInfo },
    code,
    message,
    success,
  } = await ramp.service.getBuyPrice(params);
  validateError(message, success, code);
  return { cryptoAmount, exchange, feeInfo };
};

export type IGetBuyDetail = IBuyProviderPrice & { amount: string };
export type IGetSellDetail = ISellProviderPrice & { amount: string };

export const getBuyDetail = async (params: IGetBuyDetailRequest) => {
  const {
    data: { providersList: resultList },
    code,
    message,
    success,
  } = await ramp.service.getBuyDetail(params);

  validateError(message, success, code);

  const providersList: IGetBuyDetail[] = [];
  resultList.forEach(item => {
    const provider = ramp.getProvider(item.thirdPart);
    if (!provider) throw new Error('Failed to get ramp provider');
    providersList.push({
      ...item,
      amount: item.cryptoAmount,
      providerInfo: provider.providerInfo,
    });
  });

  return providersList;
};

// ======== sell ========
export const getSellCrypto = async (params?: IGetCryptoDataRequest) => {
  const {
    data: { cryptoList, defaultCrypto },
    code,
    message,
    success,
  } = await ramp.service.getSellCryptoData(params);
  validateError(message, success, code);
  return { cryptoList, defaultCrypto };
};

export const getSellFiat = async (params: Required<IGetFiatDataRequest>) => {
  const {
    data: { fiatList, defaultFiat },
    code,
    message,
    success,
  } = await ramp.service.getSellFiatData(params);

  validateError(message, success, code);

  return { sellFiatList: fiatList, sellDefaultFiat: defaultFiat };
};

export const getSellLimit = async (params: IGetLimitRequest): Promise<IRampLimit> => {
  const {
    data: {
      crypto: { symbol, minLimit, maxLimit },
    },
    code,
    message,
    success,
  } = await ramp.service.getSellLimit(params);

  validateError(message, success, code);

  return {
    symbol,
    minLimit: Number(ZERO.plus(minLimit).decimalPlaces(4, BigNumber.ROUND_UP).valueOf()),
    maxLimit: Number(ZERO.plus(maxLimit).decimalPlaces(4, BigNumber.ROUND_DOWN).valueOf()),
  };
};

export const getSellExchange = async (params: IGetExchangeRequest) => {
  const {
    data: { exchange },
    code,
    message,
    success,
  } = await ramp.service.getSellExchange(params);

  validateError(message, success, code);

  return exchange;
};

export const getSellPrice = async (params: IGetSellPriceRequest) => {
  const {
    data: { fiatAmount, exchange, feeInfo },
    code,
    message,
    success,
  } = await ramp.service.getSellPrice(params);

  validateError(message, success, code);

  return { fiatAmount, exchange, feeInfo };
};

export const getSellDetail = async (params: IGetSellDetailRequest) => {
  const {
    data: { providersList: resultList },
    code,
    message,
    success,
  } = await ramp.service.getSellDetail(params);

  validateError(message, success, code);

  const providersList: IGetSellDetail[] = [];
  resultList.forEach(item => {
    const provider = ramp.getProvider(item.thirdPart);
    if (!provider) throw new Error('Failed to get ramp provider');
    providersList.push({
      ...item,
      amount: item.fiatAmount,
      providerInfo: provider.providerInfo,
    });
  });

  return providersList;
};

export const sendSellTransaction = async (params: IGetSellTransactionRequest) => {
  await ramp.service.sendSellTransaction(params);
};
