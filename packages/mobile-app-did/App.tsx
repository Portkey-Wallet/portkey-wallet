import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, StatusBarProps } from 'react-native';
import { ThemeProvider } from '@rneui/themed';
import NavigationRoot from './js/navigation';
import { useMemo } from 'react';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import { Provider } from 'react-redux';
import { store } from 'store';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { myTheme } from 'assets/theme';
import { initLanguage } from 'i18n';
import * as SplashScreen from 'expo-splash-screen';
import * as Sentry from '@sentry/react-native';
import secureStore from '@portkey-wallet/utils/mobile/secureStore';
import Config from 'react-native-config';
import TopView from 'rn-teaset/components/Overlay/TopView';
import AppListener from 'components/AppListener/index';
import InterfaceProvider from 'contexts/useInterface';
import GlobalStyleHandler from 'components/GlobalStyleHandler';
import ErrorBoundary from 'components/ErrorBoundary';
import { lockScreenOrientation } from 'utils/screenOrientation';
import { setupAppCheck } from 'utils/appCheck';
import Updater from 'components/Updater';
import CodePush from 'react-native-code-push';
import 'utils/sentryInit';
import 'utils/logBox';
import 'utils/initExceptionManager';
import { initRequest } from 'utils/initRequest';
import './js/headlessTask';
import { initFCMSignalR } from 'utils/FCM';
import { initNotifications } from 'utils/notifee';
import { logBoxTextColorSaver } from 'utils/textColor';
import { CODE_PUSH_OPTIONS } from 'constants/codePush';
import { useEffectOnce } from '@portkey-wallet/hooks';

if (__DEV__) {
  logBoxTextColorSaver();
}

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

initLanguage();
setupAppCheck();
initNotifications();
initFCMSignalR();
secureStore.init(Config.PORT_KEY_CODE || 'EXAMPLE_PORT_KEY_CODE');

const persistor = persistStore(store);

const App = () => {
  const statusBarProps = useMemo(() => {
    const barProps: StatusBarProps = { barStyle: 'light-content' };
    if (!isIOS) {
      barProps.translucent = true;
      barProps.backgroundColor = 'transparent';
    }
    return barProps;
  }, []);
  useEffect(() => {
    // Lock the screen orientation Right-side up portrait only.
    lockScreenOrientation();
  }, []);
  useEffectOnce(() => {
    initRequest();
  });
  return (
    <SafeAreaProvider>
      <ErrorBoundary view="root">
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <AppListener>
              <GlobalStyleHandler>
                <ThemeProvider theme={myTheme}>
                  <InterfaceProvider>
                    <TopView>
                      <StatusBar {...statusBarProps} barStyle={'light-content'} />
                      <NavigationRoot />
                      <Updater />
                    </TopView>
                  </InterfaceProvider>
                </ThemeProvider>
              </GlobalStyleHandler>
            </AppListener>
          </PersistGate>
        </Provider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
};

export default Sentry.wrap(CodePush(CODE_PUSH_OPTIONS)(App));
