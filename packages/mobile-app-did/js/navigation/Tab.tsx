import React, { useEffect, useMemo } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashBoard from 'pages/DashBoard';
import Svg, { IconName } from 'components/Svg';
import { defaultColors } from 'assets/theme';
import { useLanguage } from 'i18n/hooks';
import MyMenu from 'pages/My';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import useLogOut from 'hooks/useLogOut';
import useInitData from 'hooks/useInitData';
import { useTabMenuList } from 'hooks/cms';
import DiscoverHome from 'pages/Discover/DiscoverHome';
import ChatHome from 'pages/Chat/ChatHome';
import { formatMessageCountToStr } from '@portkey-wallet/utils/chat';

const Tab = createBottomTabNavigator();

enum TabRouteNameEnum {
  WALLET = 'Wallet',
  DISCOVER = 'Discover',
  CHAT = 'Chat',
  SETTINGS = 'Settings',
}

export interface IRenderTabMenuItem {
  name: TabRouteNameEnum;
  label: string;
  index: number;
  icon: IconName;
  component: React.FC;
}

export const tabMenuTypeMap: Record<TabRouteNameEnum, IRenderTabMenuItem> = {
  [TabRouteNameEnum.WALLET]: {
    name: TabRouteNameEnum.WALLET,
    index: 0,
    label: 'wallet',
    icon: 'logo-icon',
    component: DashBoard,
  },
  [TabRouteNameEnum.DISCOVER]: {
    name: TabRouteNameEnum.DISCOVER,
    index: 1,
    label: 'Discover',
    icon: 'discover',
    component: DiscoverHome,
  },
  [TabRouteNameEnum.CHAT]: {
    name: TabRouteNameEnum.CHAT,
    index: 2,
    label: 'Chat',
    icon: 'my',
    component: ChatHome,
  },
  [TabRouteNameEnum.SETTINGS]: {
    name: TabRouteNameEnum.SETTINGS,
    index: 3,
    label: 'Wallet',
    icon: 'my',
    component: MyMenu,
  },
};

export const defaultTabMenuList = Object.values(tabMenuTypeMap);

export default function TabRoot() {
  const { t } = useLanguage();
  const { address } = useCurrentWalletInfo();
  const tabMenuListStore = useTabMenuList();

  const tabMenuList = useMemo(() => {
    if (__DEV__) return defaultTabMenuList;
    const _tabMenuListStore = tabMenuListStore.reduce((acc: typeof tabMenuListStore, cur) => {
      if (!acc.find(item => item.type.value === cur.type.value)) {
        acc.push(cur);
      }
      return acc;
    }, []);

    if (_tabMenuListStore.length) return defaultTabMenuList;

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

  const logOut = useLogOut();
  useEffect(() => {
    if (!address) logOut();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);
  return (
    <Tab.Navigator
      initialRouteName="Wallet"
      screenOptions={({ route }) => ({
        tabBarAllowFontScaling: false,
        header: () => null,
        tabBarIcon: ({ focused }) => {
          const iconName: IconName = tabMenuList.find(tab => tab.name === route.name)?.icon ?? 'logo-icon';
          return <Svg icon={iconName} size={22} color={focused ? defaultColors.font4 : defaultColors.font7} />;
        },
      })}>
      {tabMenuList.map(ele => (
        <Tab.Screen
          key={ele.name}
          name={ele.name}
          component={ele.component}
          options={{
            tabBarBadge: ele.name === TabRouteNameEnum.CHAT ? formatMessageCountToStr(200) : undefined,
            title: t(ele.label),
            tabBarActiveTintColor: defaultColors.font4,
          }}
        />
      ))}
    </Tab.Navigator>
  );
}
