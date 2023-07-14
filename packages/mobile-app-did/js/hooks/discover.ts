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
} from '@portkey-wallet/store/store-ca/discover/slice';
import { ITabItem } from '@portkey-wallet/store/store-ca/discover/type';
import { useCallback, useEffect, useMemo } from 'react';

export const useIsDrawerOpen = () => useAppCASelector(state => state.discover.isDrawerOpen);

// discover jump
export const useDiscoverJumpWithNetWork = () => {
  const { networkType } = useCurrentNetworkInfo();
  const dispatch = useAppCommonDispatch();

  const { discoverMap } = useAppCASelector(state => state.discover);

  const discoverJump = useCallback(
    ({ item, autoApprove }: { item: ITabItem; autoApprove?: boolean }) => {
      if (!discoverMap || !discoverMap[networkType]) dispatch(initNetworkDiscoverMap(networkType));

      dispatch(createNewTab({ ...item, networkType }));
      dispatch(setActiveTab({ ...item, networkType }));
      dispatch(addRecordsItem({ ...item, networkType }));
      dispatch(changeDrawerOpenStatus(true));
      if (autoApprove) dispatch(addAutoApproveItem(item.id));
    },
    [discoverMap, dispatch, networkType],
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
      console.log('discoverMap', discoverMap && discoverMap[networkType]?.whiteList);
      return discoverMap && discoverMap[networkType]?.whiteList.includes(url);
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

export const useBookmarkList = () => {
  // const { networkType } = useCurrentNetworkInfo();
  // const dispatch = useAppCommonDispatch();
  // const { discoverMap } = useAppCASelector(state => state.discover);

  useEffect(() => {
    //
  }, []);

  // const bookmarkList = useMemo(() => discoverMap?.[networkType]?.bookmarkList || [], [discoverMap, networkType]);

  return [
    {
      id: 1,
      name: 'portkey1',
      url: 'https://portkey.finance/',
      sortWeight: 1,
    },
    {
      id: 2,
      name: 'portkey2',
      url: 'https://portkey.finance/',
      sortWeight: 2,
    },
    {
      id: 3,
      name: 'portkey3',
      url: 'https://portkey.finance/',
      sortWeight: 3,
    },
    {
      id: 4,
      name: 'portkey4',
      url: 'https://portkey.finance/',
      sortWeight: 4,
    },
  ];
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
