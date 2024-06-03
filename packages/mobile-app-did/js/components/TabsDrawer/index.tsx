import { useAppCASelector } from '@portkey-wallet/hooks/hooks-ca';
import { ScreenWidth } from '@rneui/base';
import React, { memo, useMemo, useRef } from 'react';
import { Drawer } from 'react-native-drawer-layout';
import { TabsDrawerContent } from './TabsDrawerContent';
import { usePin } from 'hooks/store';
import { changeDrawerOpenStatus } from '@portkey-wallet/store/store-ca/discover/slice';
import { useAppCommonDispatch, useThrottleCallback } from '@portkey-wallet/hooks';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import { IDrawerContentRef, TabContext, tabContextDefaultValue } from './tools';

type TabsDrawerPropsType = {
  children: React.ReactNode;
};

const TabsDrawer = (props: TabsDrawerPropsType) => {
  const { children } = props;
  const tabsRef = useRef<IDrawerContentRef>(tabContextDefaultValue);

  const pin = usePin();
  const dispatch = useAppCommonDispatch();
  const { isDrawerOpen } = useAppCASelector(state => state.discover);
  const tabsDrawerContent = useMemo(() => <TabsDrawerContent ref={tabsRef} />, []);

  const onClose = useThrottleCallback(
    () => {
      if (pin) dispatch(changeDrawerOpenStatus(false));
    },
    [dispatch, pin],
    1000,
  );

  return (
    <TabContext.Provider value={tabsRef.current}>
      <Drawer
        open={!!pin && isDrawerOpen}
        onClose={onClose}
        onOpen={() => {
          // if no onOpen, the drawer will crash
          dispatch(changeDrawerOpenStatus(true));
        }}
        // onTransitionEnd={onTransitionEnd}
        swipeEnabled={isIOS && isDrawerOpen}
        drawerPosition="right"
        drawerStyle={{ width: ScreenWidth }}
        renderDrawerContent={() => tabsDrawerContent}>
        {children}
      </Drawer>
    </TabContext.Provider>
  );
};

export default memo(TabsDrawer);
