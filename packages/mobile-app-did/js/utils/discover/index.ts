import { useAppCommonDispatch } from '@portkey-wallet/hooks';
import { changeDrawerOpenStatus } from '@portkey-wallet/store/store-ca/discover/slice';
import { TabContext } from 'components/TabsDrawer/tools';
import { useCallback, useContext } from 'react';

export const useTabDrawer = () => {
  const dispatch = useAppCommonDispatch();
  const tabContext = useContext(TabContext);
  console.log('tabContext', tabContext);
  const { showAllTabs, currentTabLength } = tabContext;
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
  return { currentTabLength, showTabDrawer };
};

export enum DiscoverShowOptions {
  SHOW_TABS = 1,
}
