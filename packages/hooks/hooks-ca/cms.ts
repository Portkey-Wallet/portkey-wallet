import { useEffect, useMemo } from 'react';
import { useAppCASelector } from '.';
import { useAppCommonDispatch } from '../index';
import { useCurrentNetworkInfo, useNetworkList } from '@portkey-wallet/hooks/hooks-ca/network';
import { getSocialMediaAsync } from '@portkey-wallet/store/store-ca/cms/actions';

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
