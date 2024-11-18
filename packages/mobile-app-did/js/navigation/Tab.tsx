import React, { useEffect, useMemo } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashBoard from 'pages/DashBoard';
import Svg, { IconName } from 'components/Svg';
import { defaultColors } from 'assets/theme';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import useLogOut from 'hooks/useLogOut';
import useInitData from 'hooks/useInitData';
import DiscoverHome from 'pages/Discover/DiscoverHome';
import ActivityListPage from 'pages/Activity/ActivityListPage';
import { pTd } from 'utils/unit';
import { useUnreadCount } from '@portkey-wallet/hooks/hooks-ca/im';
import { useIsChatShow, useTabMenuList } from '@portkey-wallet/hooks/hooks-ca/cms';
import { setBadge } from 'utils/notifee';
import { TabRouteNameEnum } from 'types/navigate';

const Tab = createBottomTabNavigator();

export interface IRenderTabMenuItem {
  name: TabRouteNameEnum;
  label: string;
  index: number;
  icon: IconName;
  largeIcon?: IconName;
  component: React.FC;
  isDefault?: boolean;
}

export const tabMenuTypeMap: Record<TabRouteNameEnum, IRenderTabMenuItem> = {
  [TabRouteNameEnum.WALLET]: {
    name: TabRouteNameEnum.WALLET,
    index: 0,
    label: 'Wallet',
    icon: 'home',
    isDefault: true,
    component: DashBoard,
  },
  [TabRouteNameEnum.ACTIVITY]: {
    name: TabRouteNameEnum.ACTIVITY,
    index: 1,
    label: 'Activity',
    largeIcon: 'clock',
    icon: 'clock',
    component: ActivityListPage,
  },
  [TabRouteNameEnum.DISCOVER]: {
    name: TabRouteNameEnum.DISCOVER,
    index: 2,
    label: 'Discover',
    icon: 'discover',
    component: DiscoverHome,
  },
};

export const defaultTabMenuList = Object.values(tabMenuTypeMap).filter(item => item.isDefault);

export default function TabRoot() {
  const { address } = useCurrentWalletInfo();
  const tabMenuListStore = useTabMenuList();
  const unreadCount = useUnreadCount();
  const isChatShow = useIsChatShow();
  const logOut = useLogOut();

  const tabMenuList = useMemo(() => {
    if (__DEV__) {
      return Object.values(tabMenuTypeMap);
    }

    const _tabMenuListStore = tabMenuListStore.reduce((acc: typeof tabMenuListStore, cur) => {
      if (!acc.find(item => item.type.value === cur.type.value)) {
        acc.push(cur);
      }
      return acc;
    }, []);

    if (!_tabMenuListStore.length) {
      return defaultTabMenuList;
    }

    return _tabMenuListStore
      .map(item => ({
        name: item?.type?.value,
        label: item?.title,
        index: item?.index,
        icon: tabMenuTypeMap?.[item?.type?.value as TabRouteNameEnum]?.icon || 'my',
        component: tabMenuTypeMap?.[item?.type?.value as TabRouteNameEnum]?.component,
      }))
      .filter(item => item.component !== undefined);
  }, [tabMenuListStore]);

  // init data
  useInitData();

  useEffect(() => {
    if (!address) {
      logOut();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  useEffect(() => {
    // TODO: need to adjust other message
    if (!isChatShow) {
      return;
    }
    setBadge(unreadCount);
  }, [isChatShow, unreadCount]);

  return (
    <Tab.Navigator
      initialRouteName="Wallet"
      screenOptions={({ route }) => ({
        tabBarStyle: {
          paddingTop: 6,
          backgroundColor: defaultColors.bgBase2,
          borderTopColor: defaultColors.borderBase1,
          borderTopWidth: pTd(1),
        },
        tabBarAllowFontScaling: false,
        header: () => null,
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBarIcon: ({ focused }) => {
          const tabMenu = tabMenuList.find(tab => tab.name === route.name);

          return (
            <Svg
              icon={tabMenu?.icon || 'my'}
              size={pTd(24)}
              color={focused ? defaultColors.primaryColorV2 : defaultColors.font26}
            />
          );
        },
      })}>
      {tabMenuList.map(ele => (
        <Tab.Screen
          key={ele.name}
          name={ele.name}
          component={ele.component}
          options={{
            tabBarShowLabel: false,
            tabBarActiveTintColor: defaultColors.primaryColorV2,
          }}
        />
      ))}
    </Tab.Navigator>
  );
}
