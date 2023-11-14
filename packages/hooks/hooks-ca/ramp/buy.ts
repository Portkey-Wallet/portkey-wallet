import { useCallback } from 'react';
import { useAppCommonDispatch } from '../../index';
import {
  setBuyDefaultCrypto,
  setBuyDefaultCryptoList,
  setBuyDefaultFiat,
  setBuyFiatList,
} from '@portkey-wallet/store/store-ca/ramp/actions';
import { useBuyDefaultCryptoListState, useBuyDefaultCryptoState, useBuyDefaultFiatState, useBuyFiatListState } from '.';
import { getBuyCrypto, getBuyFiat } from '@portkey-wallet/utils/ramp';

export const useBuyFiat = () => {
  const dispatch = useAppCommonDispatch();
  const buyFiatList = useBuyFiatListState();
  const buyDefaultFiat = useBuyDefaultFiatState();
  const buyDefaultCryptoList = useBuyDefaultCryptoListState();
  const buyDefaultCrypto = useBuyDefaultCryptoState();

  const refreshBuyFiat = useCallback(async () => {
    const { fiatList, defaultFiat } = await getBuyFiat();
    const { buyCryptoList, buyDefaultCrypto } = await getBuyCrypto({
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
        value: buyDefaultCrypto,
      }),
    );

    return {
      buyFiatList: fiatList,
      buyDefaultFiat: defaultFiat,
      buyDefaultCryptoList: buyCryptoList,
      buyDefaultCrypto,
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
