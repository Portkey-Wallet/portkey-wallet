import { useCallback } from 'react';
import { useAppCommonDispatch } from '../../index';
import {
  setBuyDefaultCrypto,
  setBuyDefaultCryptoList,
  setBuyDefaultFiat,
  setBuyFiatList,
} from '@portkey-wallet/store/store-ca/ramp/actions';
import {
  useBuyDefaultCryptoListState,
  useBuyDefaultCryptoState,
  useBuyDefaultFiatState,
  useBuyFiatListState,
} from './index';
import { getBuyCrypto, getBuyFiat } from '@portkey-wallet/utils/ramp';
import { IGetFiatDataRequest, IRampCryptoItem } from '@portkey-wallet/ramp';

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

  const getSpecifiedFiat = useCallback(async ({ crypto, network }: IGetFiatDataRequest) => {
    let specifiedCrypto: IRampCryptoItem[] = [];
    if (!network) {
      const { buyCryptoList } = await getBuyCrypto({});
      specifiedCrypto = buyCryptoList.filter(item => item.symbol === crypto, []);
      network = specifiedCrypto[0].network;
    }
    if (!network) return;
    const { fiatList, defaultFiat } = await getBuyFiat({ crypto, network });

    return { fiatList, defaultFiat, defaultCrypto: specifiedCrypto?.[0] };
  }, []);

  return {
    buyDefaultFiat,
    buyFiatList,
    buyDefaultCryptoList,
    buyDefaultCrypto,
    refreshBuyFiat,
    getSpecifiedFiat,
  };
};
