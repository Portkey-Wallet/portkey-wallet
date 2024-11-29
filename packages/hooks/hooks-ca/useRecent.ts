import { useAppCASelector } from './index';
import { useMemo } from 'react';
import { useAppCommonDispatch } from '../index';
import { initCurrentChainRecentData, initialRecentData } from '@portkey-wallet/store/store-ca/recent/slice';

export const useRecent = (caAddress: string) => {
  const recentState = useAppCASelector(state => state.recent);
  const dispatch = useAppCommonDispatch();

  return useMemo(() => {
    if (recentState?.[caAddress]) {
      return recentState?.[caAddress];
    } else {
      dispatch(initCurrentChainRecentData({ caAddress }));
      return initialRecentData;
    }
  }, [recentState, caAddress, dispatch]);
};
