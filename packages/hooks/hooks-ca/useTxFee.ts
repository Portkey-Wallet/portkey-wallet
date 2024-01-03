import { useAppCASelector } from './index';
import { useCallback, useEffect, useMemo } from 'react';
import { useAppCommonDispatch } from '../index';
import { useCurrentNetwork } from './network';
import { fetchTxFeeAsync } from '@portkey-wallet/store/store-ca/txFee/actions';
import { ChainId, NetworkType } from '@portkey-wallet/types';
import { InitialTxFee } from '@portkey-wallet/constants/constants-ca/wallet';
import { useCurrentChainList } from './chainList';

export const useFetchTxFee = () => {
  const dispatch = useAppCommonDispatch();
  const chainList = useCurrentChainList();
  const chainIds = useMemo(() => chainList?.map(chain => chain.chainId), [chainList]);

  useEffect(() => {
    if (chainIds?.length) {
      dispatch(fetchTxFeeAsync(chainIds));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainIds]);
};

export const useGetTxFee = (chainId: ChainId) => {
  const txFee = useAppCASelector(state => state.txFee);
  const currentNetwork = useCurrentNetwork();
  const targetTxFee = useMemo(() => txFee[currentNetwork]?.[chainId], [chainId, currentNetwork, txFee]);

  return useMemo(() => targetTxFee ?? InitialTxFee, [targetTxFee]);
};

export const useGetOneTxFee = () => {
  const txFee = useAppCASelector(state => state.txFee);
  return useCallback(
    (chainId: ChainId, currentNetwork: NetworkType) => {
      return txFee[currentNetwork]?.[chainId] ?? InitialTxFee;
    },
    [txFee],
  );
};
