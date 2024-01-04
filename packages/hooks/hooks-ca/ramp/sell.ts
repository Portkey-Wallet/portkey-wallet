import { useCallback } from 'react';
import { useAppCommonDispatch } from '../../index';
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
} from './index';
import { getSellCrypto, getSellFiat } from '@portkey-wallet/utils/ramp';

export const useSellCrypto = () => {
  const dispatch = useAppCommonDispatch();
  const sellCryptoList = useSellCryptoListState();
  const sellDefaultCrypto = useSellDefaultCryptoState();
  const sellDefaultFiatList = useSellDefaultFiatListState();
  const sellDefaultFiat = useSellDefaultFiatState();

  const refreshSellCrypto = useCallback(async () => {
    const { cryptoList, defaultCrypto } = await getSellCrypto();
    const { sellFiatList, sellDefaultFiat } = await getSellFiat({
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
        list: sellFiatList,
      }),
    );
    dispatch(
      setSellDefaultFiat({
        value: sellDefaultFiat,
      }),
    );
    return {
      sellCryptoList: cryptoList,
      sellDefaultCrypto: defaultCrypto,
      sellDefaultFiatList: sellFiatList,
      sellDefaultFiat,
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
