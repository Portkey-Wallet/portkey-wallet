import { useAppCASelector, useAppCommonDispatch, useAppCommonSelector } from '@portkey-wallet/hooks';
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
  changeMarketList,
  changeMarketType,
  changeMarketSort,
  resetMarketSort,
  rollBackMarketSort,
} from '@portkey-wallet/store/store-ca/discover/slice';
import { ITabItem } from '@portkey-wallet/store/store-ca/discover/type';
import { isUrl } from '@portkey-wallet/utils';
import { prefixUrlWithProtocol } from '@portkey-wallet/utils/dapp/browser';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ICryptoCurrencyItem,
  IMarketSort,
  IMarketSortDir,
  IMarketType,
} from '@portkey-wallet/store/store-ca/discover/type';
import { useAppSelector } from 'store/hooks';
import { request } from '@portkey-wallet/api/api-did';

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
const sorDirList: IMarketSortDir[] = ['desc', 'asc', ''];
export const useMarket = () => {
  const dispatch = useAppCommonDispatch();
  const { networkType } = useCurrentNetworkInfo();
  const { discoverMap } = useAppSelector(state => state.discover);
  const marketInfo = discoverMap?.[networkType]?.marketInfo;
  const [refreshing, setRefreshing] = useState(false);
  // const [cryptoCurrencyList, setCryptoCurrencyList] = useState<ICryptoCurrencyItem[]>();
  // const [marketType, setMarketType] = useState<IMarketType>('Hot');
  // const [marketSort, setMarketSort] = useState<IMarketSort>();
  // const [marketSortDir, setMarketSortDir] = useState<IMarketSortDir>();
  const fetchCryptoCurrencyList = useCallback(
    async (type: IMarketType, sort?: IMarketSort, sortDir?: IMarketSortDir): Promise<ICryptoCurrencyItem[]> => {
      try {
        setRefreshing(true);
        const params: { type?: IMarketType; sort?: IMarketSort; sortDir?: IMarketSortDir } = {};
        if (type) {
          params.type = type;
        }
        if (sort) {
          params.sort = sort;
        }
        if (sortDir) {
          params.sortDir = sortDir;
        }
        const result = await request.discover.getCryptoCurrencyList({
          params: params,
        });
        console.log('wfs result===', result);
        return result;
      } catch (e) {
        throw `fetch market data failed,  caused by: ${e}`;
      } finally {
        setRefreshing(false);
      }
    },
    [],
  );
  useEffect(() => {
    //init
    (async () => {
      const localCryptoCurrencyList = await fetchCryptoCurrencyList('Hot');
      // setCryptoCurrencyList(localCryptoCurrencyList);
      dispatch(changeMarketList({ networkType, cryptoCurrencyList: localCryptoCurrencyList }));
    })();
  }, [dispatch, fetchCryptoCurrencyList, networkType]);
  const handleType = useCallback(
    //market type change
    async (type: IMarketType) => {
      dispatch(resetMarketSort({ networkType }));
      dispatch(changeMarketType({ networkType, marketType: type }));
      const localCryptoCurrencyList = await fetchCryptoCurrencyList(type);
      // setCryptoCurrencyList(localCryptoCurrencyList);
      dispatch(changeMarketList({ networkType, cryptoCurrencyList: localCryptoCurrencyList }));
    },
    [dispatch, fetchCryptoCurrencyList, networkType],
  );
  // const resetSort = useCallback(() => {
  //   dispatch(resetMarketSort({ networkType }));
  // }, [dispatch, networkType]);
  const refreshList = useCallback(
    //market type change
    async () => {
      const localCryptoCurrencyList = await fetchCryptoCurrencyList(
        marketInfo?.type || 'Hot',
        marketInfo?.sort,
        marketInfo?.sortDir,
      );
      // setCryptoCurrencyList(localCryptoCurrencyList);
      dispatch(changeMarketList({ networkType, cryptoCurrencyList: localCryptoCurrencyList }));
    },
    [dispatch, fetchCryptoCurrencyList, marketInfo?.sort, marketInfo?.sortDir, marketInfo?.type, networkType],
  );
  const handleSort = useCallback(
    // market sort change
    async (sort: IMarketSort) => {
      try {
        let nextSortDir: IMarketSortDir = '';
        console.log('wfs=== marketInfo?.sort', marketInfo?.sort);
        console.log('wfs=== marketInfo?.sortDir', marketInfo?.sortDir);
        console.log('wfs=== sort', sort);
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
        dispatch(changeMarketSort({ networkType, markSort: { sort, sortDir: nextSortDir } }));
        const localCryptoCurrencyList = await fetchCryptoCurrencyList(
          marketInfo?.type || 'Hot',
          nextSortDir === '' ? '' : sort,
          nextSortDir,
        );
        dispatch(changeMarketList({ networkType, cryptoCurrencyList: localCryptoCurrencyList }));
      } catch (e) {
        dispatch(rollBackMarketSort({ networkType }));
      }
    },
    [dispatch, fetchCryptoCurrencyList, marketInfo?.sort, marketInfo?.sortDir, marketInfo?.type, networkType],
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
  const markFavorite = useCallback(async (id: number, symbol: string) => {
    console.log('wfs=== markFavorite', {
      id,
      symbol,
    });
    await request.discover.markFavorite({
      params: {
        id,
        symbol,
      },
    });
  }, []);
  const unMarkFavorite = useCallback(async (id: number, symbol: string) => {
    console.log('wfs=== unMarkFavorite', {
      id,
      symbol,
    });
    await request.discover.unMarkFavorite({
      params: {
        id,
        symbol,
      },
    });
  }, []);
  return {
    markFavorite,
    unMarkFavorite,
  };
};
