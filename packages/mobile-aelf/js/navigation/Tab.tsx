import React, { useEffect, useMemo, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashBoard from 'pages/DashBoard';
import Svg, { IconName } from 'components/Svg';
import { defaultColors } from 'assets/theme';
// import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
// import useLogOut from 'hooks/useLogOut';
// import useInitData from 'hooks/useInitData';
import DiscoverHome from 'pages/Discover/DiscoverHome';
import ActivityListPage from 'pages/Activity/ActivityListPage';
import { pTd } from 'utils/unit';
// import { resetBadge } from 'utils/notifee';
import { TabRouteNameEnum } from 'types/navigate';
import HomeTab from 'pages/Home/HomeTab';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { useBackupWalletModal } from '../pages/Login/hooks/useBackupWalletModal';
// import { TextM } from 'components/CommonText';
// import { useIsAccountExist } from '@portkey-wallet/hooks/hooks-eoa/wallet';

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

// export const tabMenuTypeMap: Record<TabRouteNameEnum, IRenderTabMenuItem> = {
export const tabMenuTypeMap: Record<string, IRenderTabMenuItem> = {
  ['Home']: {
    name: TabRouteNameEnum.TEST,
    index: 0,
    label: 'Wallet',
    icon: 'home',
    isDefault: true,
    component: HomeTab,
  },
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
  // TODO: eoa stashes
  // const isAccountExist = useIsAccountExist();
  // const logOut = useLogOut();
  const { backupWalletModalShow = false } = useRouterParams<{
    backupWalletModalShow?: boolean;
  }>();
  const { showBackupWalletModal } = useBackupWalletModal();
  const [backupWalletShowState, setBackupWalletShowState] = useState<'idle' | 'opened'>('idle');

  useEffect(() => {
    console.log('backupWalletModalShow: ', backupWalletModalShow);
    if (!backupWalletModalShow || backupWalletShowState !== 'idle') {
      return;
    }
    setBackupWalletShowState('opened');
    showBackupWalletModal();
  }, [backupWalletModalShow, showBackupWalletModal, backupWalletShowState]);

  const tabMenuList = useMemo(() => {
    return Object.values(tabMenuTypeMap);
  }, []);

  // TODO: eoa stashes
  // init data
  // useInitData();

  // useEffect(() => {
  //   if (!isAccountExist) {
  //     logOut();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isAccountExist]);

  // useEffect(() => {
  //   resetBadge(); // remove badge because the chat has been removed
  // }, []);

  return (
    <Tab.Navigator
      initialRouteName="Test"
      screenOptions={({ route }) => ({
        tabBarStyle: {
          paddingTop: 0,
          backgroundColor: defaultColors.bgBase2,
          borderTopColor: defaultColors.borderBase1,
          borderTopWidth: route.name === TabRouteNameEnum.DISCOVER ? 0 : pTd(1),
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
