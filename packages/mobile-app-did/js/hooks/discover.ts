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
import { IBookmarkItem, ITabItem } from '@portkey-wallet/store/store-ca/discover/type';
import { DISCOVER_BOOKMARK_MAX_COUNT } from 'constants/common';
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
    ({ item, autoApprove }: { item: ITabItem; autoApprove?: boolean }) => {
      dispatch(createNewTab({ ...item, networkType }));
      dispatch(setActiveTab({ ...item, networkType }));
      dispatch(addRecordsItem({ ...item, networkType }));
      dispatch(changeDrawerOpenStatus(true));
      if (autoApprove) dispatch(addAutoApproveItem(item.id));
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
      console.log('discoverMap', discoverMap && discoverMap[networkType]?.whiteList);
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

export const useBookmarkList = () => {
  const { networkType } = useCurrentNetworkInfo();
  const dispatch = useAppCommonDispatch();
  const { discoverMap } = useAppCASelector(state => state.discover);

  const clean = useCallback(() => {
    dispatch(cleanBookmarkList(networkType));
  }, [dispatch, networkType]);

  const refresh = useCallback(
    async (skipCount = 0, maxResultCount = DISCOVER_BOOKMARK_MAX_COUNT) => {
      const result = await request.discover.getBookmarks({
        params: {
          skipCount,
          maxResultCount,
        },
      });

      if (skipCount === 0) {
        clean();
      }
      dispatch(addBookmarkList({ networkType, list: result.items || [] }));
      return result as {
        items: IBookmarkItem[];
        totalCount: number;
      };
    },
    [clean, dispatch, networkType],
  );

  const bookmarkList = useMemo(() => discoverMap?.[networkType]?.bookmarkList || [], [discoverMap, networkType]);

  return {
    refresh,
    clean,
    bookmarkList,
  };
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
