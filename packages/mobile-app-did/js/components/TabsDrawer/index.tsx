import { useAppCASelector } from '@portkey-wallet/hooks/hooks-ca';
import { ScreenWidth } from '@rneui/base';
import React, { memo } from 'react';
import { Drawer } from 'react-native-drawer-layout';
import TabsDrawerContent from './TabsDrawerContent';
import { usePin } from 'hooks/store';
import { changeDrawerOpenStatus } from '@portkey-wallet/store/store-ca/discover/slice';
import { useAppCommonDispatch } from '@portkey-wallet/hooks';

type TabsDrawerPropsType = {
  children: React.ReactNode;
};

const TabsDrawer = (props: TabsDrawerPropsType) => {
  const { children } = props;

  const pin = usePin();
  const dispatch = useAppCommonDispatch();
  const { isDrawerOpen } = useAppCASelector(state => state.discover);

  const tabsDrawerContent = React.useMemo(() => <TabsDrawerContent />, []);

  return (
    <Drawer
      open={!!pin && isDrawerOpen}
      onClose={() => {
        // if no close, the drawer will crash
        dispatch(changeDrawerOpenStatus(false));
      }}
      onOpen={() => {
        // if no onOpen, the drawer will crash
        dispatch(changeDrawerOpenStatus(true));
      }}
      swipeEnabled={isDrawerOpen}
      drawerPosition="right"
      drawerStyle={{ width: ScreenWidth }}
      renderDrawerContent={() => tabsDrawerContent}>
      {children}
    </Drawer>
  );
};

export default memo(TabsDrawer);
