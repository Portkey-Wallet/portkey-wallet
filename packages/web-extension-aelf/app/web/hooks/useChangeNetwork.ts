import { NetworkItem } from '@portkey-wallet/types/types-eoa/network';
import { useAppCommonDispatch, useThrottleCallback } from '@portkey-wallet/hooks';
import { useResetStore } from '@portkey-wallet/hooks/hooks-eoa';
import { request } from '@portkey-wallet/api/api-did';
import signalrFCM from '@portkey-wallet/socket/socket-fcm';
import { useCurrentNetworkInfo, useNetworkList, useSwitchNetwork } from '@portkey-wallet/hooks/hooks-eoa/network';
import { useCallback } from 'react';
import { initNetworkDiscoverMap } from '@portkey-wallet/store/store-eoa/discover/slice';
// import { resetDapp } from '@portkey-wallet/store/store-eoa/dapp/actions';
import { SWEventDispatchDisconnect } from 'utils/Wallet/account';

export function useChangeNetwork() {
  const resetStore = useResetStore();
  const switchNetwork = useSwitchNetwork();
  const dispatch = useAppCommonDispatch();

  const onConfirm = useThrottleCallback(
    async (network: NetworkItem) => {
      console.log('dispatch change network:', network);
      await SWEventDispatchDisconnect();
      setTimeout(() => {
        // TODO: check if need to reset dapp state
        // dispatch(resetDapp());
        dispatch(initNetworkDiscoverMap(network.networkType));
        resetStore();
        request.initService();
        switchNetwork();
        signalrFCM.switchNetwork();
      }, 100);
    },
    [dispatch, resetStore, switchNetwork],
  );
  return useThrottleCallback(
    (network: NetworkItem) => {
      onConfirm(network);
    },
    [onConfirm],
  );
}

export function useChangeNetworkDirectly() {
  const currentNetworkInfo = useCurrentNetworkInfo();
  const networkList = useNetworkList();
  const changeNetwork = useChangeNetwork();

  return useCallback(() => {
    const targetNetwork = networkList.find((network) => network.name !== currentNetworkInfo.name);
    changeNetwork(targetNetwork, false);
  }, [changeNetwork, currentNetworkInfo.name, networkList]);
}
