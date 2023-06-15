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

const Tab = createBottomTabNavigator();
type TabMenuTypeType = { icon: IconName; component: React.FC };
export interface TabMenuItem extends TabMenuTypeType {
  name: 'Wallet' | 'Discover' | 'Settings';
  label: string;
  index: number;
}

export const tabMenuTypeMap: Record<string, TabMenuTypeType> = {
  Wallet: {
    icon: 'logo-icon',
    component: DashBoard,
  },
  Settings: {
    icon: 'my',
    component: MyMenu,
  },
  Discover: {
    icon: 'discover',
    component: DiscoverHome,
  },
};

export const defaultTabMenuList: TabMenuItem[] = [
  { name: 'Wallet', label: 'Wallet', index: 0, icon: 'logo-icon', component: DashBoard },
  { name: 'Discover', label: 'Discover', index: 1, icon: 'discover', component: DiscoverHome },
  { name: 'Settings', label: 'My', index: 2, icon: 'my', component: MyMenu },
];

export default function TabRoot() {
  const { t } = useLanguage();
  const { address } = useCurrentWalletInfo();
  const tabMenuListStore = useTabMenuList();

  const tabMenuList = useMemo(() => {
    const _tabMenuListStore = tabMenuListStore.reduce((acc: typeof tabMenuListStore, cur) => {
      if (!acc.find(item => item.type.value === cur.type.value)) {
        acc.push(cur);
      }
      return acc;
    }, []);

    if (!_tabMenuListStore.length) return defaultTabMenuList;

    return _tabMenuListStore
      .map(item => ({
        name: item.type.value,
        label: item.title,
        index: item.index,
        ...tabMenuTypeMap[item.type.value],
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
            title: t(ele.label),
            tabBarActiveTintColor: defaultColors.font4,
          }}
        />
      ))}
    </Tab.Navigator>
  );
}
