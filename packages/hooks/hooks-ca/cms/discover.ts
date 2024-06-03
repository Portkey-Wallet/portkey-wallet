import { useCallback, useEffect, useMemo } from 'react';
import { useAppCASelector } from '../index';
import { TDiscoverTabList, TDiscoverLearnGroupList, TDiscoverEarnList } from '@portkey-wallet/types/types-ca/cms';
import { useAppCommonDispatch } from '../..';
import { useCurrentNetworkInfo, useNetworkList } from '../network';
import {
  getDiscoverEarnAsync,
  getDiscoverLearnAsync,
  getDiscoverTabAsync,
} from '@portkey-wallet/store/store-ca/cms/actions';

export const useCMS = () => useAppCASelector(state => state.cms);

export const useDiscoverData = () => {
  const dispatch = useAppCommonDispatch();
  const { networkType } = useCurrentNetworkInfo();
  const { discoverTabListMap, discoverEarnListMap, discoverLearnGroupListMap } = useCMS();

  const discoverHeaderTabList = useMemo<TDiscoverTabList>(
    () => discoverTabListMap?.[networkType] || [],
    [discoverTabListMap, networkType],
  );

  const earnList = useMemo<TDiscoverEarnList>(
    () => discoverEarnListMap?.[networkType] || [],
    [discoverEarnListMap, networkType],
  );

  const learnGroupList = useMemo<TDiscoverLearnGroupList>(
    () => discoverLearnGroupListMap?.[networkType] || [],
    [discoverLearnGroupListMap, networkType],
  );

  const fetchDiscoverTabAsync = useCallback(() => dispatch(getDiscoverTabAsync(networkType)), [dispatch, networkType]);

  const fetchDiscoverEarnAsync = useCallback(
    () => dispatch(getDiscoverEarnAsync(networkType)),
    [dispatch, networkType],
  );

  const fetchDiscoverLearnAsync = useCallback(
    () => dispatch(getDiscoverLearnAsync(networkType)),
    [dispatch, networkType],
  );

  return {
    discoverHeaderTabList,
    earnList,
    learnGroupList,
    fetchDiscoverTabAsync,
    fetchDiscoverEarnAsync,
    fetchDiscoverLearnAsync,
  };
};

export const useInitCMSDiscoverNewData = () => {
  const dispatch = useAppCommonDispatch();
  const networkList = useNetworkList();

  useEffect(() => {
    networkList.forEach(item => {
      dispatch(getDiscoverTabAsync(item.networkType));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
