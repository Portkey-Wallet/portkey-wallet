import { useAppCASelector } from './index';
import { useMemo } from 'react';
import { useAppCommonDispatch } from '../index';
import { initCurrentChainRecentData } from '@portkey-wallet/store/store-ca/recent/slice';

export const initialRecentData = {
  isFetching: false,
  skipCount: 0,
  maxResultCount: 10,
  totalRecordCount: 0,
  recentContactList: [],
};

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
