import { useCallback } from 'react';
import { useAppCommonDispatch } from '../../index';
import {
  setBuyDefaultCrypto,
  setBuyDefaultCryptoList,
  setBuyDefaultFiat,
  setBuyFiatList,
} from 'packages/store/store-ca/ramp/actions';
import {
  useBuyDefaultCryptoListState,
  useBuyDefaultCryptoState,
  useBuyDefaultFiatState,
  useBuyFiatListState,
} from './index';
import { getBuyCrypto, getBuyFiat } from 'packages/utils/ramp';

export const useBuyFiat = () => {
  const dispatch = useAppCommonDispatch();
  const buyFiatList = useBuyFiatListState();
  const buyDefaultFiat = useBuyDefaultFiatState();
  const buyDefaultCryptoList = useBuyDefaultCryptoListState();
  const buyDefaultCrypto = useBuyDefaultCryptoState();

  const refreshBuyFiat = useCallback(async () => {
    const { fiatList, defaultFiat } = await getBuyFiat();
    const { buyCryptoList, buyDefaultCrypto: buy1 } = await getBuyCrypto({
      fiat: defaultFiat.symbol,
      country: defaultFiat.country,
    });

    dispatch(setBuyFiatList({ list: fiatList }));
    dispatch(
      setBuyDefaultFiat({
        value: defaultFiat,
      }),
    );
    dispatch(
      setBuyDefaultCryptoList({
        list: buyCryptoList,
      }),
    );
    dispatch(
      setBuyDefaultCrypto({
        value: buy1,
      }),
    );

    return {
      buyFiatList: fiatList,
      buyDefaultFiat: defaultFiat,
      buyDefaultCryptoList: buyCryptoList,
      buyDefaultCrypto: buy1,
    };
  }, [dispatch]);

  return {
    buyDefaultFiat,
    buyFiatList,
    buyDefaultCryptoList,
    buyDefaultCrypto,
    refreshBuyFiat,
  };
};
