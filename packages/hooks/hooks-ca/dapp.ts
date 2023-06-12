import { useMemo } from 'react';
import { useAppCASelector } from '.';
import { useWallet } from './wallet';

export const useDapp = () => useAppCASelector(state => state.dapp);

export const useCurrentDappList = () => {
  const { dappMap } = useDapp();
  const { currentNetwork } = useWallet();
  return useMemo(() => {
    return dappMap[currentNetwork];
  }, [currentNetwork, dappMap]);
};
