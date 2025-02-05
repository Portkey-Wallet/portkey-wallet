import { useCurrentNetwork, useNetworkList } from '@portkey-wallet/hooks/hooks-eoa/network';
import { useCallback, useEffect, useMemo } from 'react';
import { ChainId } from '@portkey-wallet/types';
import {
  fetchTransferSupportNetworkList,
  fetchContactSupportNetworkList,
} from '@portkey-wallet/store/store-eoa/config/slice';
import { useAppEOASelector, useAppCommonDispatch } from '../../index';

export const useConfig = () => useAppEOASelector(state => state.config);

export const useTransferNetworkConfig = (isInit = false) => {
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

  useEffect(() => {
    if (!isInit) return;
    fetchAssetSupportConfig();
  }, [fetchAssetSupportConfig, isInit]);

  return {
    fetchAssetSupportConfig,
    checkIsSupportTargetChain,
    getTargetChainSymbolConfigList,
  };
};

export const useContactNetworkConfig = (isInit = false) => {
  const { contactSupportNetworkMap } = useConfig();
  const dispatch = useAppCommonDispatch();
  const currentNetwork = useCurrentNetwork();
  const networkList = useNetworkList();

  const supportNetworkList = useMemo(
    () => contactSupportNetworkMap[currentNetwork],
    [contactSupportNetworkMap, currentNetwork],
  );

  const fetchContactSupportConfig = useCallback(() => {
    dispatch(fetchContactSupportNetworkList(networkList));
  }, [dispatch, networkList]);

  useEffect(() => {
    if (!isInit) return;
    fetchContactSupportConfig();
  }, [fetchContactSupportConfig, isInit]);

  return {
    supportNetworkList,
    fetchContactSupportConfig,
  };
};
