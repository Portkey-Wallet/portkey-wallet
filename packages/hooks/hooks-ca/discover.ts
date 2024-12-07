import { request } from '@portkey-wallet/api/api-did';
import { useAppCASelector, useAppCommonDispatch } from '@portkey-wallet/hooks';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { cleanBookmarkList, addBookmarkList } from '@portkey-wallet/store/store-ca/discover/slice';
import { IBookmarkItem } from '@portkey-wallet/store/store-ca/discover/type';
import { DISCOVER_BOOKMARK_MAX_COUNT } from '@portkey-wallet/constants/constants-ca/discover';
import { useCallback, useMemo, useState, useEffect } from 'react';

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

export function useDappSpenderCheck(website?: string, spender?: string, logo?: string) {
  const [spenderValid, setSpenderValid] = useState<boolean>(true);
  const checkDappSpenderValid = useCallback(async (website?: string, spender?: string, logo?: string) => {
    const result = await request.discover.checkSpenderValid({
      params: {
        website,
        logo,
        spender,
      },
    });
    setSpenderValid(result);
  }, []);
  useEffect(() => {
    (async () => {
      await checkDappSpenderValid(website, spender, logo);
    })();
  }, [checkDappSpenderValid, logo, spender, website]);
  return spenderValid;
}
