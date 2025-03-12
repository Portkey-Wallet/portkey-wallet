// import { useAppCASelector, useAppCommonDispatch, useAppEOASelector } from '@portkey-wallet/hooks';
import { useAppCASelector, useAppCommonDispatch } from '@portkey-wallet/hooks';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-eoa/network';
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
  changeMarketList,
  changeMarketType,
  changeMarketSort,
  resetMarketSort,
  rollBackMarketSort,
  markFavorites,
  unMarkFavorites,
} from '@portkey-wallet/store/store-eoa/discover/slice';
import { ITabItem } from '@portkey-wallet/store/store-eoa/discover/type';
import { isUrl } from '@portkey-wallet/utils';
import { prefixUrlWithProtocol } from '@portkey-wallet/utils/dapp/browser';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ICryptoCurrencyItem,
  IMarketSort,
  IMarketSortDir,
  IMarketType,
} from '@portkey-wallet/store/store-eoa/discover/type';
import { useAppSelector } from 'store/hooks';
import { request } from '@portkey-wallet/api/api-eoa';

export const useIsDrawerOpen = () => useAppCASelector(state => state.discover.isDrawerOpen);

// check and init
export const useCheckAndInitNetworkDiscoverMap = () => {
  const { networkType } = useCurrentNetworkInfo();
  const dispatch = useAppCommonDispatch();
  const { discoverMap } = useAppCASelector(state => state.discover);

  useEffect(() => {
    if (!discoverMap || !discoverMap[networkType]) {
      dispatch(initNetworkDiscoverMap(networkType));
    }
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
      if (autoApprove) {
        dispatch(addAutoApproveItem(id));
      }
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
const sorDirList: IMarketSortDir[] = ['desc', 'asc', ''];
export const useMarket = () => {
  const dispatch = useAppCommonDispatch();
  const { networkType } = useCurrentNetworkInfo();
  const { discoverMap, favorites } = useAppSelector(state => state.discover);
  const currentNetworkFavorites = favorites[networkType];
  const marketInfo = discoverMap?.[networkType]?.marketInfo;
  const initMarketInfo = useRef(marketInfo);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCryptoCurrencyList = useCallback(
    async (
      // type: IMarketType,
      // sort?: IMarketSort,
      // sortDir?: IMarketSortDir,
      // favoriteTokenIds?: string[],
      {
        type,
        sort,
        sortDir,
        favoriteTokenIds = [],
      }: {
        type: IMarketType;
        sort?: IMarketSort;
        sortDir?: IMarketSortDir;
        favoriteTokenIds?: string[];
      },
    ): Promise<ICryptoCurrencyItem[]> => {
      try {
        setRefreshing(true);
        const params: { type?: IMarketType; sort?: IMarketSort; sortDir?: IMarketSortDir } = {};
        if (type) {
          params.type = type;
          if (type === 'Favorites') {
            params.type = 'Hot';
          }
        }
        if (sort) {
          params.sort = sort;
        }
        if (sortDir) {
          params.sortDir = sortDir;
        }
        let result = await request.discover.getCryptoCurrencyList({
          params: params,
        });
        console.log('getCryptoCurrencyList: ', result, type);
        if (type === 'Favorites') {
          const favoritesList = result.filter((item: ICryptoCurrencyItem) => favoriteTokenIds.includes(item.id + ''));
          console.log('getCryptoCurrencyList: favoritesList', favoritesList, favoriteTokenIds);
          result = favoritesList;
        }
        const output = result.map((item: ICryptoCurrencyItem) => {
          return {
            ...item,
            collected: favoriteTokenIds.includes(item.id + ''),
          };
        });
        console.log('getCryptoCurrencyList: output', output, favoriteTokenIds);
        return output;
      } catch (e) {
        throw `fetch market data failed,  caused by: ${JSON.stringify(e)}`;
      } finally {
        setRefreshing(false);
      }
    },
    [],
  );
  // not Favorites
  useEffect(() => {
    //init
    if (marketInfo?.type === 'Favorites' || refreshing) {
      return;
    }
    (async () => {
      console.log('useEffect fetchCryptoCurrencyList: ', initMarketInfo, marketInfo);
      // const localCryptoCurrencyList = await fetchCryptoCurrencyList(
      //   // initMarketInfo.current?.type || 'Hot',
      //   marketInfo?.type || 'Hot',
      //   !initMarketInfo.current?.sortDir ? undefined : initMarketInfo.current?.sort,
      //   initMarketInfo.current?.sortDir,
      // );
      const localCryptoCurrencyList = await fetchCryptoCurrencyList({
        type: marketInfo?.type || 'Hot',
        sort: !initMarketInfo.current?.sortDir ? undefined : initMarketInfo.current?.sort,
        sortDir: initMarketInfo.current?.sortDir,
        favoriteTokenIds: currentNetworkFavorites,
      });
      dispatch(changeMarketList({ networkType, cryptoCurrencyList: localCryptoCurrencyList }));
    })();
  }, [
    marketInfo?.type,
    dispatch,
    // marketInfo,
    // fetchCryptoCurrencyList,
    initMarketInfo.current?.sort,
    initMarketInfo.current?.sortDir,
    initMarketInfo.current?.type,
    networkType,
  ]);

  // update Favorites list only
  useEffect(() => {
    if (marketInfo?.type !== 'Favorites' || refreshing) {
      return;
    }
    (async () => {
      console.log('useEffect fetchCryptoCurrencyList, Favorites only: ', initMarketInfo);
      const localCryptoCurrencyList = await fetchCryptoCurrencyList({
        type: 'Favorites',
        sort: !initMarketInfo.current?.sortDir ? undefined : initMarketInfo.current?.sort,
        sortDir: initMarketInfo.current?.sortDir,
        favoriteTokenIds: currentNetworkFavorites,
      });
      dispatch(changeMarketList({ networkType, cryptoCurrencyList: localCryptoCurrencyList }));
    })();
  }, [dispatch, currentNetworkFavorites, marketInfo?.type, networkType]);

  const handleType = useCallback(
    //market type change
    async (type: IMarketType) => {
      dispatch(resetMarketSort({ networkType }));
      dispatch(changeMarketType({ networkType, marketType: type }));
      const localCryptoCurrencyList = await fetchCryptoCurrencyList({
        type,
        favoriteTokenIds: currentNetworkFavorites,
      });
      dispatch(changeMarketList({ networkType, cryptoCurrencyList: localCryptoCurrencyList }));
      console.log('handleType: ', type);
    },
    [dispatch, fetchCryptoCurrencyList, networkType, currentNetworkFavorites],
  );
  const refreshList = useCallback(
    //market type change
    async () => {
      console.log('refreshList: ', marketInfo, currentNetworkFavorites);
      // const localCryptoCurrencyList = await fetchCryptoCurrencyList(
      //   marketInfo?.type || 'Hot',
      //   marketInfo?.sort,
      //   marketInfo?.sortDir,
      // );
      const localCryptoCurrencyList = await fetchCryptoCurrencyList({
        type: marketInfo?.type || 'Hot',
        sort: marketInfo?.sort,
        sortDir: marketInfo?.sortDir,
        favoriteTokenIds: currentNetworkFavorites,
      });
      dispatch(changeMarketList({ networkType, cryptoCurrencyList: localCryptoCurrencyList }));
    },
    [
      dispatch,
      fetchCryptoCurrencyList,
      currentNetworkFavorites,
      marketInfo,
      networkType,
      // marketInfo?.sort,
      // marketInfo?.sortDir,
      // marketInfo?.type,
    ],
  );
  const handleSort = useCallback(
    // market sort change
    async (sort: IMarketSort) => {
      if (refreshing) {
        return;
      }
      console.log('wfs=== handleSort', {
        sort: marketInfo?.sort,
        sortDir: marketInfo?.sortDir,
        type: marketInfo?.type,
      });
      try {
        let nextSortDir: IMarketSortDir = '';
        if (marketInfo?.sort === sort) {
          const currentSortDir = marketInfo?.sortDir;
          console.log('wfs=== currentIndex', sorDirList.indexOf(currentSortDir));
          const currentIndex = sorDirList.indexOf(currentSortDir);
          if (currentIndex !== -1) {
            nextSortDir = sorDirList[(currentIndex + 1) % sorDirList.length];
          }
        } else {
          dispatch(resetMarketSort({ networkType }));
          nextSortDir = 'desc';
        }
        console.log('wfs=== handleSort', { sort, sortDir: nextSortDir });
        dispatch(changeMarketSort({ networkType, markSort: { sort, sortDir: nextSortDir } }));
        // const localCryptoCurrencyList = await fetchCryptoCurrencyList(
        //   marketInfo?.type || 'Hot',
        //   nextSortDir === '' ? '' : sort,
        //   nextSortDir,
        // );
        const localCryptoCurrencyList = await fetchCryptoCurrencyList({
          type: marketInfo?.type || 'Hot',
          sort: nextSortDir === '' ? '' : sort,
          sortDir: nextSortDir,
        });
        dispatch(changeMarketList({ networkType, cryptoCurrencyList: localCryptoCurrencyList }));
      } catch (e) {
        dispatch(rollBackMarketSort({ networkType }));
        throw e;
      }
    },
    [
      dispatch,
      fetchCryptoCurrencyList,
      marketInfo?.sort,
      marketInfo?.sortDir,
      marketInfo?.type,
      networkType,
      refreshing,
    ],
  );
  return {
    marketInfo,
    refreshing,
    handleType,
    refreshList,
    handleSort,
  };
};
export const useMarketFavorite = () => {
  const dispatch = useAppCommonDispatch();
  const { networkType } = useCurrentNetworkInfo();
  const markFavorite = useCallback(
    async (id: string, symbol: string) => {
      console.log('wfs=== markFavorite', {
        id,
        symbol,
      });
      dispatch(
        markFavorites({
          tokenId: id,
          networkType,
        }),
      );
      // await request.discover.markFavorite({
      //   params: {
      //     id,
      //     symbol,
      //   },
      // });
    },
    [dispatch, networkType],
  );
  const unMarkFavorite = useCallback(
    async (id: string, symbol: string) => {
      console.log('wfs=== unMarkFavorite', {
        id,
        symbol,
      });
      dispatch(
        unMarkFavorites({
          tokenId: id,
          networkType,
        }),
      );
      // await request.discover.unMarkFavorite({
      //   params: {
      //     id,
      //     symbol,
      //   },
      // });
    },
    [dispatch, networkType],
  );
  return {
    markFavorite,
    unMarkFavorite,
  };
};
