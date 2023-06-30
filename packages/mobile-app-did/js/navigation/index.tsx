import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp, CardStyleInterpolators } from '@react-navigation/stack';

import Tab, { TabMenuItem } from './Tab';
import navigationService from 'utils/navigationService';
import LoginNav from 'pages/Login';
import PinNav from 'pages/Pin';
import TokenNav from 'pages/Token';
import SendNav from 'pages/Send';
import ActivityNav from 'pages/Activity';
import Home from 'pages/Home';
import GuardianNav from 'pages/Guardian';

import Referral from 'pages/Referral';
import SecurityLock from 'pages/SecurityLock';
import Receive from 'pages/Receive';
import NFTDetail from 'pages/NFT/NFTDetail';
import QrScanner from 'pages/QrScanner';
import MyNav from 'pages/My/router';
import BuyNav from 'pages/Buy';
import DiscoverNav from 'pages/Discover/index';
import { isIos } from '@portkey-wallet/utils/mobile/device';
import Discover from 'Test/Discover';

import TabsDrawer from 'components/TabsDrawer';

const Stack = createStackNavigator();
export const productionNav = [
  { name: 'Referral', component: Referral },
  { name: 'Tab', component: Tab },
  { name: 'SecurityLock', component: SecurityLock, options: { gestureEnabled: false } },
  { name: 'Receive', component: Receive },
  { name: 'NFTDetail', component: NFTDetail },
  { name: 'QrScanner', component: QrScanner },

  ...GuardianNav,
  ...ActivityNav,
  ...LoginNav,
  ...TokenNav,
  ...SendNav,
  ...PinNav,
  ...MyNav,
  ...BuyNav,
  ...DiscoverNav,
] as const;

// dav nav
export const davNav = [
  ...productionNav,
  { name: 'Home', component: Home },
  { name: 'Discover', component: Discover },
] as const;

const stackNav = __DEV__ ? davNav : productionNav;

export type RootStackParamList = {
  [key in typeof davNav[number]['name']]: undefined;
};
export type TabParamList = {
  [key in TabMenuItem['name']]: undefined;
};
export type RootStackName = typeof davNav[number]['name'];

export type RootNavigationProp = StackNavigationProp<RootStackParamList>;
export default function NavigationRoot() {
  return (
    <NavigationContainer ref={navigationService.setTopLevelNavigator}>
      <TabsDrawer>
        <Stack.Navigator
          initialRouteName="Referral"
          screenOptions={{
            headerShown: false,
            gestureVelocityImpact: 1,
            headerBackAllowFontScaling: false,
            headerTitleAllowFontScaling: false,
            cardStyleInterpolator: !isIos ? CardStyleInterpolators.forHorizontalIOS : undefined,
          }}>
          {stackNav.map((item, index) => (
            <Stack.Screen options={(item as any).options} key={index} {...(item as any)} />
          ))}
        </Stack.Navigator>
      </TabsDrawer>
    </NavigationContainer>
  );
}
