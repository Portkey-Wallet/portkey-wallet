import { useAppCASelector, useAppCommonDispatch } from '@portkey-wallet/hooks';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import {
  addUrlToWhiteList,
  changeDrawerOpenStatus,
  setActiveTab,
  addRecordsItem,
  createNewTab,
  initNetworkDiscoverMap,
  addAutoApproveItem,
  upDateRecordsItem,
  updateTab,
} from '@portkey-wallet/store/store-ca/discover/slice';
import { ITabItem } from '@portkey-wallet/store/store-ca/discover/type';
import { isUrl } from '@portkey-wallet/utils';
import { prefixUrlWithProtocol } from '@portkey-wallet/utils/dapp/browser';
import { useCallback, useEffect, useMemo } from 'react';

export const useIsDrawerOpen = () => useAppCASelector(state => state.discover.isDrawerOpen);

// check and init
export const useCheckAndInitNetworkDiscoverMap = () => {
  const { networkType } = useCurrentNetworkInfo();
  const dispatch = useAppCommonDispatch();
  const { discoverMap } = useAppCASelector(state => state.discover);

  useEffect(() => {
    if (!discoverMap || !discoverMap[networkType]) dispatch(initNetworkDiscoverMap(networkType));
  }, [discoverMap, dispatch, networkType]);
};

// discover jump
export const useDiscoverJumpWithNetWork = () => {
  const { networkType } = useCurrentNetworkInfo();
  const dispatch = useAppCommonDispatch();

  const discoverJump = useCallback(
    ({ item, autoApprove }: { item: Omit<ITabItem, 'id'>; autoApprove?: boolean }) => {
      const id = Date.now();

      dispatch(createNewTab({ ...item, id, networkType }));
      dispatch(setActiveTab({ ...item, id, networkType }));
      dispatch(addRecordsItem({ ...item, id, networkType }));
      dispatch(changeDrawerOpenStatus(true));
      if (autoApprove) dispatch(addAutoApproveItem(id));
    },
    [dispatch, networkType],
  );

  return discoverJump;
};

// discover whiteList (http)
export const useDiscoverWhiteList = () => {
  const { networkType } = useCurrentNetworkInfo();
  const dispatch = useAppCommonDispatch();

  const { discoverMap } = useAppCASelector(state => state.discover);

  const checkIsInWhiteList = useCallback(
    (url: string) => {
      return discoverMap && discoverMap[networkType]?.whiteList?.includes(url);
    },
    [discoverMap, networkType],
  );

  const upDateWhiteList = useCallback(
    (url: string) => {
      dispatch(addUrlToWhiteList({ url, networkType }));
    },
    [dispatch, networkType],
  );

  return { checkIsInWhiteList, upDateWhiteList };
};

export const useRecordsList = (isReverse = true): ITabItem[] => {
  const { networkType } = useCurrentNetworkInfo();
  const { discoverMap } = useAppCASelector(state => state.discover);

  const list = useMemo(() => {
    const recordList = JSON.parse(JSON.stringify(discoverMap?.[networkType]?.recordsList || ([] as ITabItem[])));

    return isReverse ? recordList.reverse() : recordList;
  }, [discoverMap, isReverse, networkType]);

  return list || [];
};

export const useCheckAndUpDateRecordItemName = () => {
  const { networkType } = useCurrentNetworkInfo();
  const { discoverMap } = useAppCASelector(state => state.discover);
  const dispatch = useAppCommonDispatch();

  return useCallback(
    ({ id, name }: { id: number; name: string }) => {
      try {
        const recordsItem = discoverMap?.[networkType]?.recordsList?.find(ele => ele.id === id);
        if (recordsItem && (!recordsItem.name || isUrl(prefixUrlWithProtocol(recordsItem.name)))) {
          dispatch(upDateRecordsItem({ ...recordsItem, name, networkType }));
        }
      } catch (err) {
        console.log(err);
      }
    },
    [discoverMap, dispatch, networkType],
  );
};

export const useCheckAndUpDateTabItemName = () => {
  const { networkType } = useCurrentNetworkInfo();
  const { discoverMap } = useAppCASelector(state => state.discover);
  const dispatch = useAppCommonDispatch();

  return useCallback(
    ({ id, name }: { id: number; name: string }) => {
      try {
        const tabItem = discoverMap?.[networkType]?.tabs?.find(ele => ele.id === id);
        if (tabItem && (!tabItem.name || isUrl(prefixUrlWithProtocol(tabItem.name)))) {
          dispatch(updateTab({ ...tabItem, name, networkType }));
        }
      } catch (err) {
        console.log(err);
      }
    },
    [discoverMap, dispatch, networkType],
  );
};
