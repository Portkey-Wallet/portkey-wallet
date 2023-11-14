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
  IGetOrderNoRequest,
  ISellProviderPrice,
  IBuyProviderPrice,
} from '@portkey-wallet/ramp';
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
  if (!success || code.substring(0, 1) !== '2') {
    throw new Error(message);
  }
  return { fiatList, defaultFiat };
};

export const getBuyCrypto = async (params: Required<IGetCryptoDataRequest>) => {
  const {
    data: { cryptoList, defaultCrypto },
    code,
    message,
    success,
  } = await ramp.service.getBuyCryptoData(params);
  if (!success || code.substring(0, 1) !== '2') {
    throw new Error(message);
  }
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
  if (!success || code.substring(0, 1) !== '2') {
    throw new Error(message);
  }
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
  if (!success || code.substring(0, 1) !== '2') {
    throw new Error(message);
  }
  return exchange;
};

export const getBuyPrice = async (params: IGetBuyPriceRequest) => {
  const {
    data: { cryptoAmount, exchange, feeInfo },
    code,
    message,
    success,
  } = await ramp.service.getBuyPrice(params);
  if (!success || code.substring(0, 1) !== '2') {
    throw new Error(message);
  }
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

  if (!success || code.substring(0, 1) !== '2') {
    throw new Error(message);
  }

  const providersList: IGetBuyDetail[] = [];
  resultList.forEach(item => {
    const provider = ramp.getProvider(item.thirdPart);
    if (!provider) return;
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
  if (!success || code.substring(0, 1) !== '2') {
    throw new Error(message);
  }
  return { cryptoList, defaultCrypto };
};

export const getSellFiat = async (params: Required<IGetFiatDataRequest>) => {
  const {
    data: { fiatList, defaultFiat },
    code,
    message,
    success,
  } = await ramp.service.getSellFiatData(params);

  if (!success || code.substring(0, 1) !== '2') {
    throw new Error(message);
  }

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

  if (!success || code.substring(0, 1) !== '2') {
    throw new Error(message);
  }

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

  if (!success || code.substring(0, 1) !== '2') {
    throw new Error(message);
  }

  return exchange;
};

export const getSellPrice = async (params: IGetSellPriceRequest) => {
  const {
    data: { fiatAmount, exchange, feeInfo },
    code,
    message,
    success,
  } = await ramp.service.getSellPrice(params);

  if (!success || code.substring(0, 1) !== '2') {
    throw new Error(message);
  }

  return { fiatAmount, exchange, feeInfo };
};

export const getSellDetail = async (params: IGetSellDetailRequest) => {
  const {
    data: { providersList: resultList },
    code,
    message,
    success,
  } = await ramp.service.getSellDetail(params);

  if (!success || code.substring(0, 1) !== '2') {
    throw new Error(message);
  }

  const providersList: IGetSellDetail[] = [];
  resultList.forEach(item => {
    const provider = ramp.getProvider(item.thirdPart);
    if (!provider) return;
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

export const getOrderNo = async (params: IGetOrderNoRequest) => {
  const {
    data: { orderId },
    code,
    message,
    success,
  } = await ramp.service.getOrderNo(params);

  if (!success || code.substring(0, 1) !== '2') {
    throw new Error(message);
  }

  return orderId;
};
