import { request } from '@portkey-wallet/api/api-did';
import { useAppCASelector, useAppCommonDispatch } from '@portkey-wallet/hooks';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import {
  addUrlToWhiteList,
  changeDrawerOpenStatus,
  setActiveTab,
  addRecordsItem,
  createNewTab,
  initNetworkDiscoverMap,
  cleanBookmarkList,
  addBookmarkList,
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

const DISCOVER_BOOKMARK_MAX_COUNT = 30;

export const useBookmarkList = () => {
  const { networkType } = useCurrentNetworkInfo();
  const dispatch = useAppCommonDispatch();
  const { discoverMap } = useAppCASelector(state => state.discover);

  const refresh = useCallback(
    async (pager = 0) => {
      const result = await request.discover.getBookmarks({
        params: {
          skipCount: pager * DISCOVER_BOOKMARK_MAX_COUNT,
          maxResultCount: DISCOVER_BOOKMARK_MAX_COUNT,
        },
      });
      if (pager === 0) {
        dispatch(cleanBookmarkList(networkType));
      }
      dispatch(addBookmarkList({ networkType, list: result.items || [] }));
      return result;
    },
    [dispatch, networkType],
  );

  const bookmarkList = useMemo(() => discoverMap?.[networkType]?.bookmarkList || [], [discoverMap, networkType]);

  return {
    refresh,
    bookmarkList,
  };
};

export const useRecordsList = (isReverse: boolean): ITabItem[] => {
  const { networkType } = useCurrentNetworkInfo();
  const { discoverMap } = useAppCASelector(state => state.discover);

  const list = useMemo(() => {
    return [];
  }, [discoverMap, isReverse, networkType]);

  return list || [];
};
