import { message } from 'antd';
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
import { handleErrorMessage } from '@portkey-wallet/utils';
import {
  setSellCryptoList,
  setSellDefaultCrypto,
  setSellDefaultFiat,
  setSellFiatList,
} from '@portkey-wallet/store/store-ca/ramp/actions';

export const useUpdateSellDefault = () => {
  const dispatch = useAppCommonDispatch();

  return useCallback(async () => {
    const {
      data: { defaultCrypto: sellDefaultCrypto },
    } = await ramp.service.getSellCryptoData();
    const {
      data: { defaultFiat: sellDefaultFiat },
    } = await ramp.service.getSellFiatData();
    dispatch(setSellDefaultCrypto({ ...sellDefaultCrypto }));
    dispatch(setSellDefaultFiat({ ...sellDefaultFiat }));

    return {
      sellDefaultCrypto,
      sellDefaultFiat,
    };
  }, [dispatch]);
};

export const useUpdateSellCryptoList = () => {
  const dispatch = useAppCommonDispatch();

  return useCallback(
    async (defaultFiatSymbol: string) => {
      const {
        data: { cryptoList: sellCryptoList },
      } = await ramp.service.getSellCryptoData({ fiat: defaultFiatSymbol });
      dispatch(setSellCryptoList({ list: sellCryptoList }));
    },
    [dispatch],
  );
};

export const useUpdateSellFiatList = () => {
  const dispatch = useAppCommonDispatch();

  return useCallback(
    async (defaultCryptoSymbol: string) => {
      const {
        data: { fiatList: sellFiatList },
      } = await ramp.service.getSellFiatData({ crypto: defaultCryptoSymbol });
      dispatch(setSellFiatList({ list: sellFiatList }));
    },
    [dispatch],
  );
};

export const useUpdateSellLimit = () => {
  return useCallback(async (params: IGetLimitRequest) => {
    try {
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
    } catch (error) {
      message.error(handleErrorMessage(error));
    }
  }, []);
};

export const useUpdateSellExchange = () => {
  return useCallback(async (params: IGetExchangeRequest) => {
    try {
      const {
        data: { exchange },
      } = await ramp.service.getSellExchange(params);
      return { exchange };
    } catch (error) {
      message.error(handleErrorMessage(error));
    }
  }, []);
};

export const useUpdateSellPrice = () => {
  return useCallback(async (params: IGetSellPriceRequest) => {
    try {
      const {
        data: { fiatAmount, exchange, feeInfo },
      } = await ramp.service.getSellPrice(params);
      return { fiatAmount, exchange, feeInfo };
    } catch (error) {
      message.error(handleErrorMessage(error));
    }
  }, []);
};

export const useUpdateSellDetail = () => {
  return useCallback(async (params: IGetSellDetailRequest) => {
    try {
      const {
        data: { providersList },
      } = await ramp.service.getSellDetail(params);
      return { providersList };
    } catch (error) {
      message.error(handleErrorMessage(error));
    }
  }, []);
};

export const useSendSellTransaction = () => {
  return useCallback(async (params: IGetSellTransactionRequest) => {
    try {
      await ramp.service.sendSellTransaction(params);
    } catch (error) {
      message.error(handleErrorMessage(error));
    }
  }, []);
};

export const useGetOrderNo = () => {
  return useCallback(async (params: IGetOrderNoRequest) => {
    try {
      await ramp.service.getOrderNo(params);
    } catch (error) {
      message.error(handleErrorMessage(error));
    }
  }, []);
};
