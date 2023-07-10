import { useAppCASelector, useAppCommonDispatch } from '@portkey-wallet/hooks';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import {
  addUrlToWhiteList,
  changeDrawerOpenStatus,
  setActiveTab,
  addRecordsItem,
  createNewTab,
  initNetworkDiscoverMap,
} from '@portkey-wallet/store/store-ca/discover/slice';
import { ITabItem } from '@portkey-wallet/store/store-ca/discover/type';
import { useCallback } from 'react';

export const useIsDrawerOpen = () => useAppCASelector(state => state.discover.isDrawerOpen);

// discover jump
export const useDiscoverJumpWithNetWork = () => {
  const { networkType } = useCurrentNetworkInfo();
  const dispatch = useAppCommonDispatch();

  const { discoverMap } = useAppCASelector(state => state.discover);

  const discoverJump = ({ item }: { item: ITabItem }) => {
    if (!discoverMap || !discoverMap[networkType]) dispatch(initNetworkDiscoverMap(networkType));

    dispatch(createNewTab({ ...item, networkType }));
    dispatch(setActiveTab({ ...item, networkType }));
    dispatch(addRecordsItem({ ...item, networkType }));
    dispatch(changeDrawerOpenStatus(true));
  };

  return discoverJump;
};

// discover whiteList
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
