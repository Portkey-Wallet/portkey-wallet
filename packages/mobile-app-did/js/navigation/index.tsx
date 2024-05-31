import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp, CardStyleInterpolators } from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Tab, { IRenderTabMenuItem } from './Tab';
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
import QrCodeNav from 'pages/QrCode';
import MyNav from 'pages/My/router';
import RampNav from 'pages/Ramp';
import DiscoverNav from 'pages/Discover/index';
import Deposit from 'pages/Deposit';
import { isIOS } from '@portkey-wallet/utils/mobile/device';

import TabsDrawer from 'components/TabsDrawer';
import ChatNav from 'pages/Chat/routes';
import ProviderWebPage from 'pages/ProviderWebPage';
import MarketSection from 'pages/Discover/components/MarketSection';

const Stack = isIOS ? createNativeStackNavigator() : createStackNavigator();
export const productionNav = [
  { name: 'Market', component: MarketSection },
  { name: 'Referral', component: Referral },
  { name: 'Tab', component: Tab },
  { name: 'SecurityLock', component: SecurityLock, options: { gestureEnabled: false } },
  { name: 'Receive', component: Receive },
  { name: 'NFTDetail', component: NFTDetail },
  { name: 'ProviderWebPage', component: ProviderWebPage },
  { name: 'Deposit', component: Deposit },

  ...QrCodeNav,
  ...GuardianNav,
  ...ActivityNav,
  ...LoginNav,
  ...TokenNav,
  ...SendNav,
  ...PinNav,
  ...MyNav,
  ...RampNav,
  ...ChatNav,
  ...DiscoverNav,
] as const;

// dev nav
export const devNav = [...productionNav, { name: 'Home', component: Home }] as const;

const stackNav = __DEV__ ? devNav : productionNav;

export type RootStackParamList = {
  [key in typeof devNav[number]['name']]: undefined;
};
export type TabParamList = {
  [key in IRenderTabMenuItem['name']]: undefined;
};
export type RootStackName = typeof devNav[number]['name'];

export type RootNavigationProp = StackNavigationProp<RootStackParamList>;
export default function NavigationRoot() {
  return (
    <NavigationContainer ref={navigationService.setTopLevelNavigator}>
      <TabsDrawer>
        <Stack.Navigator
          initialRouteName="Referral"
          screenOptions={
            isIOS
              ? { headerShown: false }
              : {
                  headerShown: false,
                  gestureVelocityImpact: 1,
                  headerBackAllowFontScaling: false,
                  headerTitleAllowFontScaling: false,
                  cardStyleInterpolator: !isIOS ? CardStyleInterpolators.forHorizontalIOS : undefined,
                }
          }>
          {stackNav.map((item, index) => (
            <Stack.Screen options={(item as any).options} key={index} {...(item as any)} />
          ))}
        </Stack.Navigator>
      </TabsDrawer>
    </NavigationContainer>
  );
}
