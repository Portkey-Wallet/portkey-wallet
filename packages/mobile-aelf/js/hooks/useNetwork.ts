import { useAppCommonDispatch } from '@portkey-wallet/hooks';
import { useUser } from './store';
import { useCallback } from 'react';
import { setNetworkType } from 'store/user/actions';

export const useNetwork = () => {
  const dispatch = useAppCommonDispatch();
  const { networkType } = useUser();
  const switchNetwork = useCallback(() => {
    const changedNetworkType = networkType === 'MAINNET' ? 'TESTNET' : 'MAINNET';
    dispatch(setNetworkType(changedNetworkType));
  }, [dispatch, networkType]);
  return {
    switchNetwork,
  };
};
export const useIsMainnet = () => {
  const { networkType } = useUser();
  return networkType === 'MAINNET';
};
