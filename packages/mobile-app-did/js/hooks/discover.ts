import { useAppCASelector, useAppCommonDispatch } from '@portkey-wallet/hooks';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import {
  changeDrawerOpenStatus,
  setActiveTab,
  addRecordsItem,
  createNewTab,
  initNetworkDiscoverMap,
} from '@portkey-wallet/store/store-ca/discover/slice';
import { ITabItem } from '@portkey-wallet/store/store-ca/discover/type';

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
