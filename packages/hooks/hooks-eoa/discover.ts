import { request } from '@portkey-wallet/api/api-did';
import { useAppCASelector, useAppCommonDispatch } from '@portkey-wallet/hooks';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-eoa/network';
// import { cleanBookmarkList, addBookmarkList } from '@portkey-wallet/store/store-eoa/discover/slice';
import { cleanBookmarkList } from '@portkey-wallet/store/store-eoa/discover/slice';
// import { IBookmarkItem } from '@portkey-wallet/store/store-eoa/discover/type';
// import { DISCOVER_BOOKMARK_MAX_COUNT } from '@portkey-wallet/constants/constants-eoa/discover';
import { useCallback, useEffect, useMemo, useState } from 'react';

export const useBookmarkList = () => {
  const { networkType } = useCurrentNetworkInfo();
  const dispatch = useAppCommonDispatch();
  const { discoverMap } = useAppCASelector(state => state.discover);

  const clean = useCallback(() => {
    dispatch(cleanBookmarkList(networkType));
  }, [dispatch, networkType]);

  const refresh = useCallback(
    // async () => {
    // async (skipCount = 0, maxResultCount = DISCOVER_BOOKMARK_MAX_COUNT) => {
    async () => {
      // const result = await request.discover.getBookmarks({
      //   params: {
      //     skipCount,
      //     maxResultCount,
      //   },
      // });
      //
      // if (skipCount === 0) {
      //   clean();
      // }
      // dispatch(addBookmarkList({ networkType, list: result.items || [] }));
      // return result as {
      //   items: IBookmarkItem[];
      //   totalCount: number;
      // };
      const bookmarkList = discoverMap?.[networkType]?.bookmarkList || [];
      return {
        items: bookmarkList,
        totalCount: bookmarkList.length,
      };
    },
    [discoverMap, networkType],
  );

  const bookmarkList = useMemo(() => discoverMap?.[networkType]?.bookmarkList || [], [discoverMap, networkType]);

  return {
    refresh,
    clean,
    bookmarkList,
  };
};

export function useDappInfo(website: string, logo: string) {
  const [isInWebSet, setIsInWebSet] = useState<boolean>(true);
  const checkDappIsLegal = useCallback(async (website: string, logo: string) => {
    const result = await request.discover.checkDappInfo({
      params: {
        website,
        logo,
      },
    });
    setIsInWebSet(result);
  }, []);
  useEffect(() => {
    (async () => {
      await checkDappIsLegal(website, logo);
    })();
  }, [checkDappIsLegal, logo, website]);
  return isInWebSet;
}
