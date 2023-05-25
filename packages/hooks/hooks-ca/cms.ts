import { useEffect, useMemo } from 'react';
import { useAppCASelector } from '.';
import { useAppCommonDispatch } from '../index';
import { useCurrentNetworkInfo, useNetworkList } from '@portkey-wallet/hooks/hooks-ca/network';
import { getDiscoverGroupAsync, getSocialMediaAsync } from '@portkey-wallet/store/store-ca/cms/actions';

export const useCMS = () => useAppCASelector(state => state.cms);

export function useSocialMediaList(isInit = false) {
  const dispatch = useAppCommonDispatch();
  const { socialMediaListNetMap } = useCMS();
  const { networkType } = useCurrentNetworkInfo();
  const networkList = useNetworkList();

  const socialMediaList = useMemo(() => socialMediaListNetMap[networkType] || [], [networkType, socialMediaListNetMap]);

  useEffect(() => {
    if (isInit) {
      networkList.forEach(item => {
        dispatch(getSocialMediaAsync(item.networkType));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isInit) {
      dispatch(getSocialMediaAsync(networkType));
    }
  }, [dispatch, isInit, networkType]);

  return socialMediaList;
}

export function useDiscoverGroupList(isInit = false) {
  const dispatch = useAppCommonDispatch();
  const { discoverGroupListNetMap } = useCMS();
  const { networkType } = useCurrentNetworkInfo();
  const networkList = useNetworkList();

  const discoverGroupList = useMemo(
    () => discoverGroupListNetMap[networkType] || [],
    [networkType, discoverGroupListNetMap],
  );

  useEffect(() => {
    if (isInit) {
      networkList.forEach(item => {
        dispatch(getDiscoverGroupAsync(item.networkType));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isInit) {
      dispatch(getDiscoverGroupAsync(networkType));
    }
  }, [dispatch, isInit, networkType]);

  return discoverGroupList;
}
