import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { getSymbolImagesAsync } from '@portkey-wallet/store/store-ca/tokenManagement/action';
import { getCaHolderInfoAsync } from '@portkey-wallet/store/store-ca/wallet/actions';
import { useCallback, useEffect, useRef } from 'react';
import { useAppDispatch } from 'store/hooks';
import { useGetCurrentCAViewContract } from './contract';
import { useGetGuardiansInfoWriteStore, useGetVerifierServers } from './guardian';
import useEffectOnce from './useEffectOnce';
import { useCurrentNetwork } from '@portkey-wallet/hooks/network';
import { reportUserCurrentNetwork } from 'utils/analysisiReport';
import { useCheckAndInitNetworkDiscoverMap } from './discover';
import { usePin } from './store';
import { getManagerAccount } from 'utils/redux';
import { useInitIM } from '@portkey-wallet/hooks/hooks-ca/im';
import { useBookmarkList } from '@portkey-wallet/hooks/hooks-ca/discover';
import { useIsChatShow } from '@portkey-wallet/hooks/hooks-ca/cms';
import im from '@portkey-wallet/im';
import { useInitRamp } from '@portkey-wallet/hooks/hooks-ca/ramp';
import { isIOS } from '@portkey-wallet/utils/mobile/device';

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
  const { netWorkType } = useCurrentNetwork();

  const getGuardiansInfoWriteStore = useGetGuardiansInfoWriteStore();
  const isMainNetwork = useIsMainnet();
  useCheckAndInitNetworkDiscoverMap();

  const { refresh: loadBookmarkList } = useBookmarkList();
  const initIM = useInitIM();
  const initRamp = useInitRamp({
    clientType: isIOS ? 'iOS' : 'Android',
  });

  const loadIM = useCallback(async () => {
    if (!pin) return;
    const account = getManagerAccount(pin);
    if (!account || !wallet.caHash) return;

    try {
      await initIM(account, wallet.caHash);
      console.log('init finish');
    } catch (error) {
      console.log('im init error', error);
    }
  }, [initIM, pin, wallet.caHash]);
  const loadIMRef = useRef(loadIM);
  loadIMRef.current = loadIM;

  const init = useCallback(async () => {
    try {
      getCurrentCAViewContract();
      dispatch(getCaHolderInfoAsync());
      dispatch(getSymbolImagesAsync());

      loadBookmarkList();
      initRamp();
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
    initRamp,
    isMainNetwork,
    loadBookmarkList,
    wallet.caHash,
  ]);

  const isChat = useIsChatShow();
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isChat) {
        loadIMRef.current();
      } else {
        im.destroy();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [isChat]);

  useEffectOnce(() => {
    // init data after transition animation
    const timer = setTimeout(init, 500);
    return () => clearTimeout(timer);
  });

  useEffect(() => {
    // report user`s current environment of network
    reportUserCurrentNetwork(netWorkType);
  }, [netWorkType]);
}
