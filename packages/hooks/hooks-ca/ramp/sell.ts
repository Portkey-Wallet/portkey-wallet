import { useCallback } from 'react';
import { useAppCommonDispatch } from '../../index';
import ramp, {
  IGetExchangeRequest,
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
} from '@portkey-wallet/store/store-ca/ramp/actions';
import { useRamp } from '.';

export const useUpdateSellCrypto = () => {
  const dispatch = useAppCommonDispatch();
  const { sellDefaultCrypto, sellCryptoList } = useRamp();
  const refreshSellCrypto = useCallback(async () => {
    const {
      data: { cryptoList, defaultCrypto },
    } = await ramp.service.getSellCryptoData();

    dispatch(setSellDefaultCrypto(defaultCrypto));
    dispatch(setSellCryptoList({ list: cryptoList }));
    return { sellCryptoList: cryptoList, sellDefaultCrypto: defaultCrypto };
  }, [dispatch]);

  return { sellDefaultCrypto, sellCryptoList, refreshSellCrypto };
};

export const useUpdateSellFiat = () => {
  const dispatch = useAppCommonDispatch();
  const { sellDefaultFiat } = useRamp();

  const refreshSellFiat = useCallback(
    async (defaultCryptoSymbol: string) => {
      const {
        data: { fiatList, defaultFiat },
      } = await ramp.service.getSellFiatData({ crypto: defaultCryptoSymbol });

      dispatch(setSellDefaultFiat(defaultFiat));
      return { sellFiatList: fiatList, sellDefaultFiat: defaultFiat };
    },
    [dispatch],
  );
  return { sellDefaultFiat, refreshSellFiat };
};

export const useUpdateSellLimit = () => {
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

export const useUpdateSellExchange = () => {
  return useCallback(async (params: IGetExchangeRequest) => {
    const {
      data: { exchange },
    } = await ramp.service.getSellExchange(params);
    return exchange;
  }, []);
};

export const useUpdateSellPrice = () => {
  return useCallback(async (params: IGetSellPriceRequest) => {
    const {
      data: { fiatAmount, exchange, feeInfo },
    } = await ramp.service.getSellPrice(params);
    return { fiatAmount, exchange, feeInfo };
  }, []);
};

export const useUpdateSellDetail = () => {
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
