import { useCallback } from 'react';
import { useAppCommonDispatch } from '../../index';
import ramp, {
  IGetBuyDetailRequest,
  IGetBuyPriceRequest,
  IGetCryptoDataRequest,
  IGetExchangeRequest,
  IGetLimitRequest,
} from '@portkey-wallet/ramp';
import {
  setBuyDefaultCrypto,
  setBuyDefaultCryptoList,
  setBuyDefaultFiat,
  setBuyFiatList,
} from '@portkey-wallet/store/store-ca/ramp/actions';
import { useBuyDefaultCryptoListState, useBuyDefaultCryptoState, useBuyDefaultFiatState, useBuyFiatListState } from '.';

export const useBuyFiat = () => {
  const dispatch = useAppCommonDispatch();
  const buyFiatList = useBuyFiatListState();
  const buyDefaultFiat = useBuyDefaultFiatState();
  const buyDefaultCryptoList = useBuyDefaultCryptoListState();
  const buyDefaultCrypto = useBuyDefaultCryptoState();

  const refreshBuyFiat = useCallback(async () => {
    const {
      data: { fiatList, defaultFiat },
    } = await ramp.service.getBuyFiatData();
    const {
      data: { cryptoList, defaultCrypto },
    } = await ramp.service.getBuyCryptoData({ fiat: defaultFiat.symbol, country: defaultFiat.country });

    dispatch(setBuyFiatList({ list: fiatList }));
    dispatch(
      setBuyDefaultFiat({
        value: defaultFiat,
      }),
    );
    dispatch(
      setBuyDefaultCryptoList({
        list: cryptoList,
      }),
    );
    dispatch(
      setBuyDefaultCrypto({
        value: defaultCrypto,
      }),
    );

    return {
      buyFiatList: fiatList,
      buyDefaultFiat: defaultFiat,
      buyDefaultCryptoList: cryptoList,
      buyDefaultCrypto: defaultCrypto,
    };
  }, [dispatch]);

  return { buyDefaultFiat, buyFiatList, buyDefaultCryptoList, buyDefaultCrypto, refreshBuyFiat };
};

export const useGetBuyCrypto = () => {
  return useCallback(async (params: Required<IGetCryptoDataRequest>) => {
    const {
      data: { cryptoList, defaultCrypto },
    } = await ramp.service.getBuyCryptoData(params);

    return { buyCryptoList: cryptoList, buyDefaultCrypto: defaultCrypto };
  }, []);
};

export const useGetBuyLimit = () => {
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

export const useGetBuyExchange = () => {
  return useCallback(async (params: IGetExchangeRequest) => {
    const {
      data: { exchange },
    } = await ramp.service.getBuyExchange(params);
    return exchange;
  }, []);
};

export const useGetBuyPrice = () => {
  return useCallback(async (params: IGetBuyPriceRequest) => {
    const {
      data: { cryptoAmount, exchange, feeInfo },
    } = await ramp.service.getBuyPrice(params);
    return { cryptoAmount, exchange, feeInfo };
  }, []);
};

export const useGetBuyDetail = () => {
  return useCallback(async (params: IGetBuyDetailRequest) => {
    const {
      data: { providersList },
    } = await ramp.service.getBuyDetail(params);
    return providersList;
  }, []);
};
