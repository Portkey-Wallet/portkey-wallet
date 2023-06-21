import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { fetchBuyFiatListAsync } from '@portkey-wallet/store/store-ca/payment/actions';
import { getSymbolImagesAsync } from '@portkey-wallet/store/store-ca/tokenManagement/action';
import { getWalletNameAsync } from '@portkey-wallet/store/store-ca/wallet/actions';
import { useCallback } from 'react';
import { useAppDispatch } from 'store/hooks';
import { useGetCurrentCAViewContract } from './contract';
import { useGetGuardiansInfoWriteStore, useGetVerifierServers } from './guardian';
import useEffectOnce from './useEffectOnce';

export default function useInitData() {
  const dispatch = useAppDispatch();
  const getCurrentCAViewContract = useGetCurrentCAViewContract();
  const { caHash } = useCurrentWalletInfo();
  const getVerifierServers = useGetVerifierServers();

  const getGuardiansInfoWriteStore = useGetGuardiansInfoWriteStore();
  const isMainNetwork = useIsMainnet();

  const init = useCallback(async () => {
    try {
      // mainnet only
      if (isMainNetwork) {
        dispatch(fetchBuyFiatListAsync());
        // dispatch(fetchSellFiatListAsync());
      }
      getCurrentCAViewContract();
      dispatch(getWalletNameAsync());
      dispatch(getSymbolImagesAsync());
      // getGuardiansInfoWriteStore after getVerifierServers
      await getVerifierServers();
      getGuardiansInfoWriteStore({
        caHash,
      });
    } catch (error) {
      console.log(error, '====error');
    }
  }, [caHash, dispatch, getCurrentCAViewContract, getGuardiansInfoWriteStore, getVerifierServers, isMainNetwork]);
  useEffectOnce(() => {
    // init data after transition animation
    const timer = setTimeout(init, 500);
    return () => clearTimeout(timer);
  });
}
