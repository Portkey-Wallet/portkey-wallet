import { useCurrentNetwork, useNetworkList } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCallback, useMemo } from 'react';
import { ChainId } from '@portkey-wallet/types';
import {
  fetchTransferSupportNetworkList,
  fetchContactSupportNetworkList,
} from '@portkey-wallet/store/store-ca/config/slice';
import { useAppCASelector, useAppCommonDispatch } from '../../index';

export const useConfig = () => useAppCASelector(state => state.config);

export const useTransferNetworkConfig = () => {
  const { sendAssetSupportNetworkMap } = useConfig();
  const dispatch = useAppCommonDispatch();
  const currentNetwork = useCurrentNetwork();
  const networkList = useNetworkList();

  const targetMap = sendAssetSupportNetworkMap[currentNetwork];

  const getTargetChainSymbolConfigList = useCallback(
    (fromChainId: ChainId, symbol: string) => {
      return targetMap?.[fromChainId]?.[symbol];
    },
    [targetMap],
  );

  const checkIsSupportTargetChain = useCallback(
    ({ fromChainId, symbol, network }: { fromChainId: ChainId; symbol: string; network: string }) => {
      return targetMap?.[fromChainId]?.[symbol]?.find(ele => ele.network === network);
    },
    [targetMap],
  );

  const fetchAssetSupportConfig = useCallback(() => {
    dispatch(fetchTransferSupportNetworkList(networkList));
  }, [dispatch, networkList]);

  return {
    fetchAssetSupportConfig,
    checkIsSupportTargetChain,
    getTargetChainSymbolConfigList,
  };
};

export const useContactNetworkConfig = () => {
  const { contactSupportNetworkMap } = useConfig();
  const dispatch = useAppCommonDispatch();
  const currentNetwork = useCurrentNetwork();
  const networkList = useNetworkList();

  const supportNetworkList = useMemo(
    () => contactSupportNetworkMap?.[currentNetwork] || [],
    [contactSupportNetworkMap, currentNetwork],
  );

  const fetchContactSupportConfig = useCallback(() => {
    console.log('aaaa');
    dispatch(fetchContactSupportNetworkList(networkList));
  }, [dispatch, networkList]);

  return {
    supportNetworkList,
    fetchContactSupportConfig,
  };
};
