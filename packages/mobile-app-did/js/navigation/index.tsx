import * as React from 'react';
import { useRef, useCallback } from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { type ParamListBase } from '@react-navigation/core';
import { createStackNavigator, StackNavigationProp, CardStyleInterpolators } from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { reportPageShow } from 'utils/analysisiReport';

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
import CryptoGift from 'pages/CryptoGift';
import GiftHistory from 'pages/CryptoGift/GiftHistory';
import GiftDetail from 'pages/CryptoGift/GiftDetail';
import GiftResult from 'pages/CryptoGift/GiftResult';
import { useActivityModalConfig } from '@portkey-wallet/hooks/hooks-ca/api';
import useJump from 'hooks/useJump';
import { ActivityModalConfig, TimingType } from '@portkey-wallet/types/types-ca/cms';
import { ButtonRowProps } from 'components/ButtonRow';
import { parseLink } from '@portkey-wallet/hooks/hooks-ca/cms/util';
import ActionSheet from 'components/ActionSheet';
import { useAppCommonDispatch } from '@portkey-wallet/hooks';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { setActivityModalCurrentTimeShowed, setActivityModalShowed } from '@portkey-wallet/store/store-ca/cms/actions';

// key: page route key, value: is page show
const PageShowMap = new Map<string, boolean>();

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
  { name: 'CryptoGift', component: CryptoGift },
  { name: 'GiftHistory', component: GiftHistory },
  { name: 'GiftDetail', component: GiftDetail },
  { name: 'GiftResult', component: GiftResult },

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
let lastPage: string | undefined;
export default function NavigationRoot() {
  const navigationRef = useRef<NavigationContainerRef<ParamListBase>>();
  const dispatch = useAppCommonDispatch();
  const { networkType } = useCurrentNetworkInfo();

  const jump = useJump();
  const getModalConfig = useActivityModalConfig();
  const showModal = useCallback(
    async (configItem: ActivityModalConfig): Promise<boolean> => {
      return new Promise(resolve => {
        if (configItem.showed) {
          resolve(true);
        } else {
          const buttons: ButtonRowProps['buttons'] = [];
          if (configItem.positiveTitle) {
            buttons.push({
              title: configItem.positiveTitle,
              onPress: () => {
                const link = parseLink(configItem.positiveAction, '');
                console.log('link', link);
                if (link.location) {
                  jump(link);
                }
              },
            });
          }
          if (configItem.negtiveTitle) {
            buttons.push({
              title: configItem.negtiveTitle,
            });
          }
          const onDismiss = () => {
            resolve(true);
          };
          ActionSheet.alert({
            isCloseShow: configItem.showClose,
            bgImage: configItem.headerImg ? { uri: configItem.headerImg } : undefined,
            title: configItem.title,
            message: configItem.description,
            buttons,
            onDismiss,
          });
          if (configItem.timingType !== TimingType.AppOpen) {
            dispatch(
              setActivityModalShowed({
                network: networkType,
                id: configItem.id || 0,
              }),
            );
          }
          dispatch(
            setActivityModalCurrentTimeShowed({
              network: networkType,
              id: configItem.id || 0,
            }),
          );
        }
      });
    },
    [dispatch, jump, networkType],
  );
  const renderActivityModal = useCallback(
    (config: ActivityModalConfig[], index: number) => {
      if (index >= config.length) {
        return;
      }
      showModal(config[index]).then(value => {
        if (value) {
          renderActivityModal(config, index + 1);
        }
      });
    },
    [showModal],
  );
  const refHandler = (ref: any) => {
    navigationRef.current = ref;
    navigationService.setTopLevelNavigator(ref);
  };

  const onNavigationStateChange = useCallback(async () => {
    const currentRouteName = navigationRef?.current?.getCurrentRoute()?.name;
    const routesLength = navigationRef.current?.getState()?.routes?.length || 0;
    if (routesLength > 0) {
      const lastElement = navigationRef.current?.getState()?.routes[routesLength - 1];
      if (lastElement?.name !== lastPage) {
        const timingTypeArray = [TimingType.Page];
        // if the latest page is tab page
        if (lastElement?.name === 'Tab') {
          timingTypeArray.push(TimingType.AppOpen);
          timingTypeArray.push(TimingType.AppOpenOnce);
        }
        console.log('current Page is: ', lastElement?.name);
        getModalConfig(timingTypeArray, lastElement?.name || '', config => {
          renderActivityModal(config, 0);
        });
      }
      lastPage = lastElement?.name;
    }
    const currentRouteKey = navigationRef?.current?.getCurrentRoute()?.key;
    if (!currentRouteName || !currentRouteKey) return;
    if (PageShowMap.get(currentRouteKey)) return;
    reportPageShow({ page_name: currentRouteName });
    PageShowMap.set(currentRouteKey, true);
  }, [getModalConfig, renderActivityModal]);

  return (
    <NavigationContainer ref={refHandler} onStateChange={onNavigationStateChange}>
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
            <Stack.Screen
              options={(item as any).options}
              key={index}
              {...(item as any)}
              initialParams={{ type: 'Page111' }}
            />
          ))}
        </Stack.Navigator>
      </TabsDrawer>
    </NavigationContainer>
  );
}
