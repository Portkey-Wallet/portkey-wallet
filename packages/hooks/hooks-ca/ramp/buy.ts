import { useCallback } from 'react';
import { useAppCommonDispatch } from '../../index';
import ramp, {
  IGetBuyDetailRequest,
  IGetBuyPriceRequest,
  IGetExchangeRequest,
  IGetLimitRequest,
} from '@portkey-wallet/ramp';
import { setBuyDefaultCrypto, setBuyDefaultFiat, setBuyFiatList } from '@portkey-wallet/store/store-ca/ramp/actions';
import { useRamp } from '.';

export const useUpdateBuyCrypto = () => {
  const dispatch = useAppCommonDispatch();
  const { buyDefaultCrypto } = useRamp();

  const refreshBuyCrypto = useCallback(
    async (targetFiatSymbol: string) => {
      const {
        data: { cryptoList, defaultCrypto },
      } = await ramp.service.getBuyCryptoData({ fiat: targetFiatSymbol });

      dispatch(setBuyDefaultCrypto(defaultCrypto));
      return { buyCryptoList: cryptoList };
    },
    [dispatch],
  );

  return { buyDefaultCrypto, refreshBuyCrypto };
};

export const useUpdateBuyFiat = () => {
  const dispatch = useAppCommonDispatch();
  const { buyDefaultFiat, buyFiatList } = useRamp();

  const refreshBuyFiat = useCallback(async () => {
    const {
      data: { fiatList, defaultFiat },
    } = await ramp.service.getBuyFiatData();

    dispatch(setBuyDefaultFiat(defaultFiat));
    dispatch(setBuyFiatList({ list: fiatList }));
    return { buyFiatList: fiatList, buyDefaultFiat: defaultFiat };
  }, [dispatch]);

  return { buyDefaultFiat, buyFiatList, refreshBuyFiat };
};

export const useUpdateBuyLimit = () => {
  return useCallback(async (params: IGetLimitRequest) => {
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
  }, []);
};

export const useUpdateBuyExchange = () => {
  return useCallback(async (params: IGetExchangeRequest) => {
    const {
      data: { exchange },
    } = await ramp.service.getBuyExchange(params);
    return exchange;
  }, []);
};

export const useUpdateBuyPrice = () => {
  return useCallback(async (params: IGetBuyPriceRequest) => {
    const {
      data: { cryptoAmount, exchange, feeInfo },
    } = await ramp.service.getBuyPrice(params);
    return { cryptoAmount, exchange, feeInfo };
  }, []);
};

export const useUpdateBuyDetail = () => {
  return useCallback(async (params: IGetBuyDetailRequest) => {
    const {
      data: { providersList },
    } = await ramp.service.getBuyDetail(params);
    return providersList;
  }, []);
};
