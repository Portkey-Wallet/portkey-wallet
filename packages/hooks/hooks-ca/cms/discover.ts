import { useCallback, useEffect, useMemo } from 'react';
import { useAppCASelector } from '../index';
import { TDiscoverTabList, TDiscoverLearnGroupList, TDiscoverEarnList } from '@portkey-wallet/types/types-ca/cms';
import { useAppCommonDispatch } from '../..';
import { useCurrentNetworkInfo, useNetworkList } from '../network';
import {
  getDiscoverEarnAsync,
  getDiscoverLearnAsync,
  getDiscoverTabAsync,
  getDappWhiteListAsync,
} from '@portkey-wallet/store/store-ca/cms/actions';

const DEFAULT_DISCOVER_TAB_LIST: TDiscoverTabList = [{ index: 2, name: 'Market', value: 'Market' }];

export const useCMS = () => useAppCASelector(state => state.cms);

export const useDiscoverData = () => {
  const dispatch = useAppCommonDispatch();
  const { networkType } = useCurrentNetworkInfo();
  const { discoverTabListMap, discoverEarnListMap, discoverLearnGroupListMap } = useCMS();

  const discoverHeaderTabList = useMemo<TDiscoverTabList>(() => {
    if (!discoverTabListMap?.[networkType] || discoverTabListMap?.[networkType]?.length === 0)
      return DEFAULT_DISCOVER_TAB_LIST;

    return discoverTabListMap?.[networkType] || DEFAULT_DISCOVER_TAB_LIST;
  }, [discoverTabListMap, networkType]);

  const earnList = useMemo<TDiscoverEarnList>(
    () => discoverEarnListMap?.[networkType] || [],
    [discoverEarnListMap, networkType],
  );

  const learnGroupList = useMemo<TDiscoverLearnGroupList>(
    () => discoverLearnGroupListMap?.[networkType] || [],
    [discoverLearnGroupListMap, networkType],
  );
  const learnShortGroupList = useMemo<TDiscoverLearnGroupList>(() => {
    const learnGroupList = discoverLearnGroupListMap?.[networkType] || [];
    return learnGroupList.map(group => ({
      ...group,
      items: group.items?.slice(0, 4),
    }));
  }, [discoverLearnGroupListMap, networkType]);

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
    learnShortGroupList,
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

export const useInitDappWhiteListData = () => {
  const dispatch = useAppCommonDispatch();
  const networkList = useNetworkList();
  useEffect(() => {
    networkList.forEach(item => {
      dispatch(getDappWhiteListAsync(item.networkType));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
