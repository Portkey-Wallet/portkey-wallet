import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { RouterContext, RouterParams, defaultRouterParams } from './context';
import router from '.';
import { PortkeyEntries } from './types';
import { useCredentials } from '@portkey-wallet/rn-base/hooks/store';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { sleep } from '@portkey-wallet/utils';
import navigationService, { useNavigation } from '@portkey-wallet/rn-inject-sdk';
import { isNeedPinPage, mapRoute } from './map';
import CommonToast from '@portkey-wallet/rn-components/components/CommonToast';

const RouterProvider = ({ children, value }: { children: any; value?: RouterParams }) => {
  const hasRun = useRef(false);
  if (!hasRun.current) {
    initRouter(value);
    hasRun.current = true;
  }

  return (
    <RouterContext.Provider value={value ?? defaultRouterParams}>
      <BackHandler>{children}</BackHandler>
    </RouterContext.Provider>
  );
};
function BackHandler({ children }: { children: any }) {
  const navigation = useNavigation();

  const { from } = useContext(RouterContext) as { from: PortkeyEntries };
  const isNeedPinRoute = useRef(isNeedPinPage(from));
  const isLoginPage = useRef(from === mapRoute('LoginPortkey'));
  const isSecurityLockPage = useRef(from === mapRoute('SecurityLock'));
  const [isInteractionDisabled, setIsInteractionDisabled] = useState(false);
  const credentials = useCredentials();
  const wallet = useCurrentWalletInfo();
  const { address, caHash } = wallet;
  const init = useCallback(async () => {
    try {
      if (address) {
        // have pin, do nothing
        if (credentials && caHash) {
          console.log('wallet!->unlocked', 'from', from, 'router pages', router.pages);
          // login/signUp/scanCode...，go back.
          if (!isNeedPinRoute.current) {
            setIsInteractionDisabled(true);
            CommonToast.success('Already Login!');
            await sleep(800);
            console.log('wfs goBack 17', navigation.isFocused(), 'from', from, router.peek()?.name);
            console.log('wfs goBack 17 pages', router.pages);
            if (navigation.isFocused()) {
              navigationService.goBack();
            }
            return;
          }
        } else {
          console.log('wallet!->locked', 'from', from, 'router pages', router.pages);
          // no pin, goto security lock.
          if (isNeedPinRoute.current || isLoginPage.current) {
            console.log('goto SecurityLock 2');
            navigationService.navigate('SecurityLock');
          }
        }
      } else {
        console.log('no wallet', 'from', from, 'router pages', router.pages);
        // no wallet, so goto login page
        // (but signUp page/scanQrcode page don't need goto login page)
        if (isNeedPinRoute.current) {
          navigationService.reset('LoginPortkey');
        }
      }
    } catch (e) {
      console.log('route init', e);
    }
  }, [address, credentials, caHash]);
  useEffect(() => {
    // set current route name for navigationService instance
    console.log('init timing', 'from', from, 'router pages', router.pages);
    if (navigation.isFocused()) {
      console.log('init timing, set current route');
      navigationService.setRouteName(from);
    }
    init();
    return () => {
      console.log('destroy timing, set current route', 'from', from, 'router pages', router.pages);
      navigationService.setRouteName(router.peek()?.name);
    };
  }, [init]);
  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => {
      console.log('wfs listener1 focus call', from);
    });

    const unsubscribeBlur = navigation.addListener('blur', () => {
      console.log('wfs listener1 blur call', from);
    });
    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, []);
  return (
    <View style={styles.container}>
      {children}
      {isInteractionDisabled && <View style={styles.overlay} pointerEvents="box-only" />}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
});
function initRouter(value: { from: string; params: any } | undefined) {
  const currentPage = value?.from as PortkeyEntries;
  router.push({ name: currentPage, params: value?.params });
  console.log('wfs current route list', router.pages);
}
export default RouterProvider;
