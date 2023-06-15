import { useAppCASelector } from '@portkey-wallet/hooks/hooks-ca';
import { ScreenWidth } from '@rneui/base';
import React from 'react';
import { Drawer } from 'react-native-drawer-layout';
import TabsDrawerContent from './TabsDrawerContent';
import { usePin } from 'hooks/store';
type TabsDrawerPropsType = {
  children: React.ReactNode;
};

export default function TabsDrawer(props: TabsDrawerPropsType) {
  const { children } = props;

  const pin = usePin();
  const { isDrawerOpen } = useAppCASelector(state => state.discover);

  const tabsDrawerContent = React.useMemo(() => <TabsDrawerContent />, []);

  return (
    <Drawer
      open={!!pin && isDrawerOpen}
      onClose={() => {
        // if no close, the drawer will crash
        console.log('close');
      }}
      onOpen={() => {
        // if no onOpen, the drawer will crash
        console.log('open');
      }}
      swipeEnabled={false}
      drawerPosition="right"
      drawerStyle={{ width: ScreenWidth }}
      renderDrawerContent={() => tabsDrawerContent}>
      {children}
    </Drawer>
  );
}
