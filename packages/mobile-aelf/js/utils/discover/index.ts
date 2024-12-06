import { useAppCASelector, useAppCommonDispatch } from '@portkey-wallet/hooks';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { changeDrawerOpenStatus } from '@portkey-wallet/store/store-ca/discover/slice';
import { TabContext } from 'components/TabsDrawer/tools';
import { useCallback, useContext } from 'react';

export const useTabDrawer = () => {
  const { networkType } = useCurrentNetworkInfo();
  const dispatch = useAppCommonDispatch();
  const tabContext = useContext(TabContext);
  const { discoverMap = {} } = useAppCASelector(state => state.discover);
  const { tabs } = discoverMap[networkType] ?? {};
  const { showAllTabs } = tabContext;
  const showTabDrawer = useCallback(
    (option?: DiscoverShowOptions) => {
      dispatch(changeDrawerOpenStatus(true));
      if (option) {
        switch (option) {
          case DiscoverShowOptions.SHOW_TABS: {
            showAllTabs();
            break;
          }
        }
      }
    },
    [dispatch, showAllTabs],
  );
  return { currentTabLength: tabs ? tabs.length : 0, showTabDrawer };
};

export enum DiscoverShowOptions {
  SHOW_TABS = 1,
}
