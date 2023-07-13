import { useAppCASelector } from './index';
import { useCallback, useEffect, useMemo } from 'react';
import { useAppCommonDispatch } from '../index';
import { useCurrentNetwork } from './network';
import { fetchTxFeeAsync } from '@portkey-wallet/store/store-ca/txFee/actions';
import { ChainId } from '@portkey-wallet/types';
import { TxFeeItem } from '@portkey-wallet/store/store-ca/txFee/type';
import { InitialTxFee } from '@portkey-wallet/constants/constants-ca/wallet';

export const useFetchTxFee = () => {
  const txFee = useAppCASelector(state => state.txFee);
  const { chainInfo } = useAppCASelector(state => state.wallet);
  const dispatch = useAppCommonDispatch();
  const currentNetwork = useCurrentNetwork();
  const chainIds = useMemo(() => chainInfo?.[currentNetwork]?.map(chain => chain.chainId), [chainInfo, currentNetwork]);

  useEffect(() => {
    if (chainIds?.length) {
      dispatch(fetchTxFeeAsync(chainIds));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainIds]);

  return useCallback(
    (chainId: ChainId) => {
      const targetTxFee = txFee[currentNetwork]?.filter((txf: TxFeeItem) => txf.chainId === chainId);
      return targetTxFee?.[0].transactionFee ?? InitialTxFee;
    },
    [currentNetwork, txFee],
  );
};

export const useGetTxFee = (chainId: ChainId) => {
  const txFee = useAppCASelector(state => state.txFee);
  const currentNetwork = useCurrentNetwork();
  const targetTxFee = useMemo(
    () => txFee[currentNetwork]?.filter((txf: TxFeeItem) => txf.chainId === chainId),
    [chainId, currentNetwork, txFee],
  );

  return useMemo(() => targetTxFee?.[0].transactionFee ?? InitialTxFee, [targetTxFee]);
};
