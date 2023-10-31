import { message } from 'antd';
import { useCallback } from 'react';
import { useAppCommonDispatch } from '../../index';
import ramp, {
  IGetBuyDetailRequest,
  IGetBuyPriceRequest,
  IGetExchangeRequest,
  IGetLimitRequest,
} from '@portkey-wallet/ramp';
import { handleErrorMessage } from '@portkey-wallet/utils';
import {
  setBuyCryptoList,
  setBuyDefaultCrypto,
  setBuyDefaultFiat,
  setBuyFiatList,
} from '@portkey-wallet/store/store-ca/ramp/actions';

export const useUpdateBuyDefault = () => {
  const dispatch = useAppCommonDispatch();

  return useCallback(async () => {
    const {
      data: { defaultCrypto: buyDefaultCrypto },
    } = await ramp.service.getBuyCryptoData();
    const {
      data: { defaultFiat: buyDefaultFiat },
    } = await ramp.service.getBuyFiatData();

    dispatch(setBuyDefaultCrypto({ ...buyDefaultCrypto }));
    dispatch(setBuyDefaultFiat({ ...buyDefaultFiat }));
    return {
      buyDefaultCrypto,
      buyDefaultFiat,
    };
  }, [dispatch]);
};

export const useUpdateBuyCryptoList = () => {
  const dispatch = useAppCommonDispatch();

  return useCallback(
    async (defaultFiatSymbol: string) => {
      const {
        data: { cryptoList: buyCryptoList },
      } = await ramp.service.getBuyCryptoData({ fiat: defaultFiatSymbol });

      dispatch(setBuyCryptoList({ list: buyCryptoList }));
    },
    [dispatch],
  );
};

export const useUpdateBuyFiatList = () => {
  const dispatch = useAppCommonDispatch();

  return useCallback(
    async (defaultCryptoSymbol: string) => {
      const {
        data: { fiatList: buyFiatList },
      } = await ramp.service.getBuyFiatData({ crypto: defaultCryptoSymbol });
      dispatch(setBuyFiatList({ list: buyFiatList }));
    },
    [dispatch],
  );
};

export const useUpdateBuyLimit = () => {
  return useCallback(async (params: IGetLimitRequest) => {
    try {
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
    } catch (error) {
      message.error(handleErrorMessage(error));
    }
  }, []);
};

export const useUpdateBuyExchange = () => {
  return useCallback(async (params: IGetExchangeRequest) => {
    try {
      const {
        data: { exchange },
      } = await ramp.service.getBuyExchange(params);
      return { exchange };
    } catch (error) {
      message.error(handleErrorMessage(error));
    }
  }, []);
};

export const useUpdateBuyPrice = () => {
  return useCallback(async (params: IGetBuyPriceRequest) => {
    try {
      const {
        data: { cryptoAmount, exchange, feeInfo },
      } = await ramp.service.getBuyPrice(params);
      return { cryptoAmount, exchange, feeInfo };
    } catch (error) {
      message.error(handleErrorMessage(error));
    }
  }, []);
};

export const useUpdateBuyDetail = () => {
  return useCallback(async (params: IGetBuyDetailRequest) => {
    try {
      const {
        data: { providersList },
      } = await ramp.service.getBuyDetail(params);
      return { providersList };
    } catch (error) {
      message.error(handleErrorMessage(error));
    }
  }, []);
};
