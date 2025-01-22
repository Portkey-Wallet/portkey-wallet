import { useCallback, useMemo } from 'react';
import { useAppEOASelector } from '../index';
import { NetworkList } from '@portkey-wallet/constants/constants-eoa/network';
import { useAppCommonDispatch } from '../../index';
import { setCurrentNetwork } from '@portkey-wallet/store/store-eoa/network/actions';
import { NetworkType } from '@portkey-wallet/types';

export const useNetworkState = () => useAppEOASelector(state => state.network);

export const useChainListMapState = () => useAppEOASelector(state => state.network.chainListMap);

export const useCurrentNetwork = () => useAppEOASelector(state => state.network.currentNetwork);

export const useIsMainnet = () => {
  const currentNetwork = useCurrentNetwork();
  return useMemo(() => currentNetwork === 'MAINNET', [currentNetwork]);
};

export const useNetworkList = () => {
  return NetworkList;
};

export const useCurrentNetworkInfo = () => {
  const currentNetwork = useCurrentNetwork();
  const networkList = useNetworkList();

  return useMemo(
    () => networkList.find(item => item.networkType === currentNetwork) || networkList[0],
    [currentNetwork, networkList],
  );
};

export const useSetCurrentNetwork = () => {
  const dispatch = useAppCommonDispatch();
  return useCallback(
    (network: NetworkType) => {
      dispatch(
        setCurrentNetwork({
          currentNetwork: network,
        }),
      );
    },
    [dispatch],
  );
};

export const useSwitchNetwork = () => {
  const isMainnet = useIsMainnet();
  const setCurrentNetwork = useSetCurrentNetwork();

  return useCallback(() => {
    setCurrentNetwork(isMainnet ? 'TESTNET' : 'MAINNET');
  }, [isMainnet, setCurrentNetwork]);
};
