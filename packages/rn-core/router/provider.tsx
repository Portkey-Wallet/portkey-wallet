import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { RouterContext, RouterParams, defaultRouterParams } from './context';
import router from '.';
import { PortkeyEntries } from './types';
import { useCredentials } from '@portkey-wallet/rn-base/hooks/store';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { sleep } from '@portkey-wallet/utils';
import navigationService, { useFocusEffect, useNavigation } from '@portkey-wallet/rn-inject-sdk';
import { AppRouteName, isNeedPinPage, mapRoute } from './map';
import CommonToast from '@portkey-wallet/rn-components/components/CommonToast';
import useLatestIsFocusedRef from '@portkey-wallet/rn-base/hooks/useLatestIsFocusedRef';

const RouterProvider = ({ children, value }: { children: any; value?: RouterParams }) => {
  const hasRun = useRef(false);
  // const isNeedPinRoute = useRef(isNeedPinPage(value?.from as PortkeyEntries));
  // const isSecurityLock = useRef(value?.from === mapRoute('SecurityLock'));
  // const [isInteractionDisabled, setIsInteractionDisabled] = useState(false);
  // const isFocused = useLatestIsFocusedRef();
  // console.log('isFocused', isFocused, 'from', value?.from);
  if (!hasRun.current) {
    initRouter(value);
    hasRun.current = true;
  }

  // const credentials = useCredentials();
  // const wallet = useCurrentWalletInfo();
  // const { address, caHash } = wallet;
  // console.log('wfs data', 'wallet', wallet, 'credentials', credentials);
  // const init = useCallback(async () => {
  //   try {
  //     if (address) {
  //       // have pin, do nothing
  //       if (credentials && caHash) {
  //         console.log('有钱包!->已解锁', value?.from, 'isNeedPinRoute.current', isNeedPinRoute.current);
  //         // login/signUp/scanCode...，go back.
  //         if (!isNeedPinRoute.current) {
  //           setIsInteractionDisabled(true);
  //           CommonToast.success('Already Login!');
  //           await sleep(800);
  //           console.log('wfs goBack 17');
  //           navigationService.goBack();
  //           return;
  //         }
  //       } else {
  //         console.log('有钱包!->未解锁');
  //         // no pin, goto security lock.
  //         if (isNeedPinRoute.current) {
  //           console.log('goto SecurityLock 2');
  //           navigationService.reset('SecurityLock');
  //         }
  //       }
  //     } else {
  //       console.log('无钱包!');
  //       // no wallet, so goto login page
  //       // (but signUp page/scanQrcode page don't need goto login page)
  //       if (isNeedPinRoute.current) {
  //         navigationService.reset('LoginPortkey');
  //       }
  //     }
  //   } catch (e) {
  //     console.log('route init', e);
  //   }
  // }, [address, credentials, caHash]);
  // useEffect(() => {
  //   init();
  //   // set current route name for navigationService instance
  //   navigationService.setRouteName(value?.from);
  //   return () => {
  //     navigationService.setRouteName(router.peek()?.name);
  //   };
  // }, [init]);

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
  // console.log('wfs data', 'wallet', wallet, 'credentials', credentials);
  const init = useCallback(async () => {
    try {
      if (address) {
        // have pin, do nothing
        if (credentials && caHash) {
          console.log('有钱包!->已解锁', 'from', from, 'router pages', router.pages);
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
          console.log('有钱包!->未解锁', 'from', from, 'router pages', router.pages);
          // no pin, goto security lock.
          if (isNeedPinRoute.current || isLoginPage.current) {
            console.log('goto SecurityLock 2');
            navigationService.navigate('SecurityLock');
          }
        }
      } else {
        console.log('无钱包!');
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
    console.log('初始化时机', 'from', from, 'router pages', router.pages);
    if (navigation.isFocused()) {
      console.log('初始化时机，设置当前route');
      navigationService.setRouteName(from);
    }
    init();
    return () => {
      console.log('销毁时机，设置当前route', 'from', from, 'router pages', router.pages);
      navigationService.setRouteName(router.peek()?.name);
    };
  }, [init]);
  // usePreventHardwareBack();
  // useHardwareBackPress(() => {
  //   console.log('from', from, 'router', router.pages, 'router.listenersFunc()', router.listenersFunc());
  //   // router.listenersFunc()[from]?.['blur'].forEach(item => item());
  //   // router.pop();
  //   console.log('from2', from, 'router2', router.pages, 'router.listenersFunc()', router.listenersFunc());
  //   return false;
  // });
  // useFocusEffect(
  //   useCallback(() => {
  //     console.log('wfs focus change', from);
  //   }, []),
  // );
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
  // return <>{children}</>;
}
// useHardwareBackPress
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
  // router.listenersFunc()[currentPage]?.['focus'].forEach(item => item());
}
export default RouterProvider;
