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

  const otherProps = {} as { onClose: () => void; onOpen: () => void };

  return (
    <Drawer
      open={!!pin && isDrawerOpen}
      swipeEnabled={false}
      drawerPosition="right"
      drawerStyle={{ width: ScreenWidth }}
      renderDrawerContent={() => tabsDrawerContent}
      {...otherProps}>
      {children}
    </Drawer>
  );
}
