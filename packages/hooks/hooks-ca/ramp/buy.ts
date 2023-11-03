import { useCallback } from 'react';
import { useAppCommonDispatch } from '../../index';
import ramp from '@portkey-wallet/ramp';
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
