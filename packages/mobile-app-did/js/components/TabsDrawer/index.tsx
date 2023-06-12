import { useAppCASelector } from '@portkey-wallet/hooks/hooks-ca';
import { ScreenWidth } from '@rneui/base';
import React from 'react';
import { Drawer } from 'react-native-drawer-layout';
import TabsDrawerContent from './TabsDrawerContent';

interface TabsDrawerPropsType {
  children: React.ReactNode;
}

export default function TabsDrawer(props: TabsDrawerPropsType) {
  const { children } = props;

  const { isDrawerOpen } = useAppCASelector(state => state.discover);

  const tabsDrawerContent = React.useMemo(() => <TabsDrawerContent />, []);

  return (
    <Drawer
      open={isDrawerOpen}
      swipeEnabled={false}
      onOpen={() => console.log('open')}
      onClose={() => console.log('close')}
      drawerPosition="right"
      drawerStyle={{ width: ScreenWidth }}
      renderDrawerContent={() => {
        return tabsDrawerContent;
      }}>
      {children}
    </Drawer>
  );
}
