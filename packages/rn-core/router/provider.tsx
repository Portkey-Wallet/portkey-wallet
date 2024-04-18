import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { RouterContext, RouterParams, defaultRouterParams } from './context';
import router from '.';
import { PortkeyEntries } from './types';
import { initRouter } from './util';
import { styles } from './styles';
import { useCredentials } from '@portkey-wallet/rn-base/hooks/store';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { sleep } from '@portkey-wallet/utils';
import navigationService, { useFocusEffect, useNavigation } from '@portkey-wallet/rn-inject-sdk';
import { isNeedUnlockPage, mapRoute } from './map';
import CommonToast from '@portkey-wallet/rn-components/components/CommonToast';

const RouterProvider = ({ children, value }: { children: any; value?: RouterParams }) => {
  const hasRun = useRef(false);
  if (!hasRun.current) {
    initRouter(value);
    hasRun.current = true;
  }

  return (
    <RouterContext.Provider value={value ?? defaultRouterParams}>
      <ViewStub>{children}</ViewStub>
    </RouterContext.Provider>
  );
};
function ViewStub({ children }: { children: any }) {
  const navigation = useNavigation();
  const { from } = useContext(RouterContext) as { from: PortkeyEntries };
  const isNeedUnlockRoute = useRef(isNeedUnlockPage(from));
  const isLoginPage = useRef(from === mapRoute('LoginPortkey') || from === mapRoute('SignupPortkey'));
  const isSecurityLockPage = useRef(from === mapRoute('SecurityLock'));
  const [isInteractionDisabled, setIsInteractionDisabled] = useState(false);
  const credentials = useCredentials();
  const wallet = useCurrentWalletInfo();

  const { address, caHash } = wallet;
  const init = useCallback(async () => {
    try {
      if (address) {
        // wallet is available and unlocked
        if (credentials && caHash) {
          console.log('wallet!->unlocked', 'from', from, 'router pages', router.pages);
          // login/signUp/scanCode...，go back.
          if (isLoginPage.current) {
            setIsInteractionDisabled(true);
            CommonToast.success('Already Login!');
            await sleep(800);
            if (navigation.isFocused()) {
              navigationService.goBack();
            }
            return;
          }
          // wallet is available, but locked
        } else {
          console.log('wallet!->locked', 'from', from, 'router pages', router.pages);
          // no pin, goto security lock.
          if (isNeedUnlockRoute.current || isLoginPage.current) {
            console.log('goto SecurityLock 2');
            navigationService.navigate('SecurityLock');
          }
        }
        // wallet is unavailable
      } else {
        console.log('no wallet', 'from', from, 'router pages', router.pages);
        // no wallet, so goto login page
        // (but signUp page/scanQrcode etc page don't need goto login page)
        if (isNeedUnlockRoute.current || isSecurityLockPage.current) {
          navigationService.reset('LoginPortkey');
        }
      }
    } catch (e) {
      console.log('route init', e);
    }
  }, [address, credentials, caHash]);

  useEffect(() => {
    // check if wallet is available. check if wallet is unlock.
    init();
  }, [init]);

  useEffect(() => {
    // set current route name for navigationService instance
    navigationService.setRouteName(from);
    return () => {
      navigationService.setRouteName(router.peek()?.name);
    };
  }, []);

  return (
    <View style={styles.container}>
      {children}
      {isInteractionDisabled && <View style={styles.overlay} pointerEvents="box-only" />}
    </View>
  );
}

export default RouterProvider;
