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
} from '@portkey-wallet/ramp';

// ======== buy ========
export const useGetBuyCrypto = async (params: Required<IGetCryptoDataRequest>) => {
  const {
    data: { cryptoList, defaultCrypto },
  } = await ramp.service.getBuyCryptoData(params);

  return { buyCryptoList: cryptoList, buyDefaultCrypto: defaultCrypto };
};

export const useGetBuyLimit = async (params: IGetLimitRequest) => {
  const {
    data: {
      fiat: { symbol, minLimit, maxLimit },
    },
  } = await ramp.service.getBuyLimit(params);
  return {
    symbol,
    minLimit,
    maxLimit,
  };
};

export const useGetBuyExchange = async (params: IGetExchangeRequest) => {
  const {
    data: { exchange },
  } = await ramp.service.getBuyExchange(params);
  return exchange;
};

export const useGetBuyPrice = async (params: IGetBuyPriceRequest) => {
  const {
    data: { cryptoAmount, exchange, feeInfo },
  } = await ramp.service.getBuyPrice(params);
  return { cryptoAmount, exchange, feeInfo };
};

export const useGetBuyDetail = async (params: IGetBuyDetailRequest) => {
  const {
    data: { providersList },
  } = await ramp.service.getBuyDetail(params);
  return providersList;
};

// ======== sell ========
export const useGetSellFiat = async (params: Required<IGetFiatDataRequest>) => {
  const {
    data: { fiatList, defaultFiat },
  } = await ramp.service.getSellFiatData(params);

  return { sellFiatList: fiatList, sellDefaultFiat: defaultFiat };
};

export const useGetSellLimit = async (params: IGetLimitRequest) => {
  const {
    data: {
      crypto: { symbol, minLimit, maxLimit },
    },
  } = await ramp.service.getSellLimit(params);
  return {
    symbol,
    minLimit,
    maxLimit,
  };
};

export const useGetSellExchange = async (params: IGetExchangeRequest) => {
  const {
    data: { exchange },
  } = await ramp.service.getSellExchange(params);
  return exchange;
};

export const useGetSellPrice = async (params: IGetSellPriceRequest) => {
  const {
    data: { fiatAmount, exchange, feeInfo },
  } = await ramp.service.getSellPrice(params);
  return { fiatAmount, exchange, feeInfo };
};

export const useGetSellDetail = async (params: IGetSellDetailRequest) => {
  const {
    data: { providersList },
  } = await ramp.service.getSellDetail(params);
  return providersList;
};

export const useSendSellTransaction = async (params: IGetSellTransactionRequest) => {
  await ramp.service.sendSellTransaction(params);
};

export const useGetOrderNo = async (params: IGetOrderNoRequest) => {
  const { data: orderNo } = await ramp.service.getOrderNo(params);
  return orderNo;
};
