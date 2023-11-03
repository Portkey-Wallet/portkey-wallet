import { useCallback } from 'react';
import { useAppCommonDispatch } from '../../index';
import ramp from '@portkey-wallet/ramp';
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
