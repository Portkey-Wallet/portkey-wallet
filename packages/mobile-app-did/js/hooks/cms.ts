import { useCMS } from '@portkey-wallet/hooks/hooks-ca/cms';
import { useCurrentNetworkInfo, useNetworkList } from '@portkey-wallet/hooks/hooks-ca/network';
import { getTabMenuAsync } from '@portkey-wallet/store/store-ca/cms/actions';
import { useEffect, useMemo } from 'react';
import { useAppDispatch } from 'store/hooks';

export function useTabMenuList(isInit = false) {
  const dispatch = useAppDispatch();
  const { tabMenuListNetMap } = useCMS();
  const { networkType } = useCurrentNetworkInfo();
  const networkList = useNetworkList();

  const tabMenuList = useMemo(() => tabMenuListNetMap[networkType] || [], [networkType, tabMenuListNetMap]);

  useEffect(() => {
    if (isInit) {
      networkList.forEach(item => {
        dispatch(getTabMenuAsync(item.networkType));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isInit) {
      dispatch(getTabMenuAsync(networkType));
    }
  }, [dispatch, isInit, networkType]);

  return tabMenuList;
}
