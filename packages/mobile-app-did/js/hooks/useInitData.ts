import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { fetchBuyFiatListAsync, fetchSellFiatListAsync } from '@portkey-wallet/store/store-ca/payment/actions';
import { getSymbolImagesAsync } from '@portkey-wallet/store/store-ca/tokenManagement/action';
import { getCaHolderInfoAsync } from '@portkey-wallet/store/store-ca/wallet/actions';
import { useCallback } from 'react';
import { useAppDispatch } from 'store/hooks';
import { useGetCurrentCAViewContract } from './contract';
import { useGetGuardiansInfoWriteStore, useGetVerifierServers } from './guardian';
import useEffectOnce from './useEffectOnce';
import { useBookmarkList, useCheckAndInitNetworkDiscoverMap } from './discover';
import { usePin } from './store';
import { getManagerAccount } from 'utils/redux';
import im from '@portkey-wallet/im';
import { useInitIm } from '@portkey-wallet/hooks/hooks-ca/im';

// const getCurrentCAContract = useGetCurrentCAContract();

// const getDeviceInfo = useGetDeviceInfo();
// const originChainId = useOriginChainId();
// const chainInfo = useCurrentChain(originChainId);
// const getHolderInfo = useGetHolderInfo();
// const { userGuardiansList } = useGuardiansInfo();
// const createChannel = useCreateP2pChannel();

export default function useInitData() {
  const dispatch = useAppDispatch();
  const pin = usePin();
  const getCurrentCAViewContract = useGetCurrentCAViewContract();
  const wallet = useCurrentWalletInfo();
  const getVerifierServers = useGetVerifierServers();

  const getGuardiansInfoWriteStore = useGetGuardiansInfoWriteStore();
  const isMainNetwork = useIsMainnet();
  useCheckAndInitNetworkDiscoverMap();

  const { refresh: loadBookmarkList } = useBookmarkList();
  const initIm = useInitIm();

  const initIM = useCallback(async () => {
    if (!pin) return;
    const account = getManagerAccount(pin);
    if (!account || !wallet.caHash) return;

    try {
      await initIm(account, wallet.caHash);
    } catch (error) {
      console.log('im init error', error);
    }
  }, [initIm, pin, wallet.caHash]);

  const init = useCallback(async () => {
    try {
      // mainnet only
      if (isMainNetwork) {
        dispatch(fetchBuyFiatListAsync());
        dispatch(fetchSellFiatListAsync());
      }
      getCurrentCAViewContract();
      dispatch(getCaHolderInfoAsync());
      dispatch(getSymbolImagesAsync());

      loadBookmarkList();
      initIM();
      // getGuardiansInfoWriteStore after getVerifierServers
      await getVerifierServers();
      getGuardiansInfoWriteStore({
        caHash: wallet.caHash,
      });
    } catch (error) {
      console.log(error, '====error');
    }
  }, [
    dispatch,
    getCurrentCAViewContract,
    getGuardiansInfoWriteStore,
    getVerifierServers,
    initIM,
    isMainNetwork,
    loadBookmarkList,
    wallet.caHash,
  ]);

  useEffectOnce(() => {
    // init data after transition animation
    const timer = setTimeout(init, 500);
    return () => clearTimeout(timer);
  });
}
