import { useCallback } from 'react';
import { useAppCommonDispatch } from '../../index';
import ramp, {
  IGetExchangeRequest,
  IGetFiatDataRequest,
  IGetLimitRequest,
  IGetOrderNoRequest,
  IGetSellDetailRequest,
  IGetSellPriceRequest,
  IGetSellTransactionRequest,
} from '@portkey-wallet/ramp';
import {
  setSellCryptoList,
  setSellDefaultCrypto,
  setSellDefaultFiat,
  setSellDefaultFiatList,
} from '@portkey-wallet/store/store-ca/ramp/actions';
import {
  useSellCryptoListState,
  useSellDefaultCryptoState,
  useSellDefaultFiatListState,
  useSellDefaultFiatState,
} from '.';

export const useSellCrypto = () => {
  const dispatch = useAppCommonDispatch();
  const sellCryptoList = useSellCryptoListState();
  const sellDefaultCrypto = useSellDefaultCryptoState();
  const sellDefaultFiatList = useSellDefaultFiatListState();
  const sellDefaultFiat = useSellDefaultFiatState();

  const refreshSellCrypto = useCallback(async () => {
    const {
      data: { cryptoList, defaultCrypto },
    } = await ramp.service.getSellCryptoData();
    const {
      data: { fiatList, defaultFiat },
    } = await ramp.service.getSellFiatData({
      crypto: defaultCrypto.symbol,
      network: defaultCrypto.network,
    });

    dispatch(setSellCryptoList({ list: cryptoList }));
    dispatch(
      setSellDefaultCrypto({
        value: defaultCrypto,
      }),
    );
    dispatch(
      setSellDefaultFiatList({
        list: fiatList,
      }),
    );
    dispatch(
      setSellDefaultFiat({
        value: defaultFiat,
      }),
    );
    return {
      sellCryptoList: cryptoList,
      sellDefaultCrypto: defaultCrypto,
      sellDefaultFiatList: fiatList,
      sellDefaultFiat: defaultFiat,
    };
  }, [dispatch]);

  return {
    sellCryptoList,
    sellDefaultCrypto,
    sellDefaultFiatList,
    sellDefaultFiat,
    refreshSellCrypto,
  };
};

export const useGetSellFiat = () => {
  return useCallback(async (params: Required<IGetFiatDataRequest>) => {
    const {
      data: { fiatList, defaultFiat },
    } = await ramp.service.getSellFiatData(params);

    return { sellFiatList: fiatList, sellDefaultFiat: defaultFiat };
  }, []);
};

export const useGetSellLimit = () => {
  return useCallback(async (params: IGetLimitRequest) => {
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
  }, []);
};

export const useGetSellExchange = () => {
  return useCallback(async (params: IGetExchangeRequest) => {
    const {
      data: { exchange },
    } = await ramp.service.getSellExchange(params);
    return exchange;
  }, []);
};

export const useGetSellPrice = () => {
  return useCallback(async (params: IGetSellPriceRequest) => {
    const {
      data: { fiatAmount, exchange, feeInfo },
    } = await ramp.service.getSellPrice(params);
    return { fiatAmount, exchange, feeInfo };
  }, []);
};

export const useGetSellDetail = () => {
  return useCallback(async (params: IGetSellDetailRequest) => {
    const {
      data: { providersList },
    } = await ramp.service.getSellDetail(params);
    return providersList;
  }, []);
};

export const useSendSellTransaction = () => {
  return useCallback(async (params: IGetSellTransactionRequest) => {
    await ramp.service.sendSellTransaction(params);
  }, []);
};

export const useGetOrderNo = () => {
  return useCallback(async (params: IGetOrderNoRequest) => {
    const { data: orderNo } = await ramp.service.getOrderNo(params);
    return orderNo;
  }, []);
};
