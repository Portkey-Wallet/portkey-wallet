import { useAppCASelector, useAppCommonDispatch } from '@portkey-wallet/hooks';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import {
  changeDrawerOpenStatus,
  setActiveTab,
  addRecordsItem,
  createNewTab,
} from '@portkey-wallet/store/store-ca/discover/slice';
import { ITabItem } from '@portkey-wallet/store/store-ca/discover/type';

export const useIsDrawerOpen = () => useAppCASelector(state => state.discover.isDrawerOpen);

// discover jump
export const useDiscoverJumpWithNetWork = () => {
  const { networkType } = useCurrentNetworkInfo();
  const dispatch = useAppCommonDispatch();

  const discoverJump = ({ item }: { item: ITabItem }) => {
    dispatch(changeDrawerOpenStatus(true));
    dispatch(createNewTab({ ...item, networkType }));
    dispatch(setActiveTab({ ...item, networkType }));
    dispatch(addRecordsItem({ ...item, networkType }));
  };

  return discoverJump;
};
