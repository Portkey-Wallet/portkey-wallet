import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, StatusBarProps } from 'react-native';
import { ThemeProvider } from '@rneui/themed';
import NavigationRoot from './js/navigation';
import { useMemo } from 'react';
import { isIos } from '@portkey-wallet/utils/mobile/device';
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
import { lockScreenOrientation } from 'utils/screenOrientation';
import Updater from 'components/Updater';
import CodePush from 'react-native-code-push';
import 'utils/sentryInit';

const codePushOptions = {
  updateDialog: false,
  installMode: CodePush.InstallMode.ON_NEXT_RESTART,
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
};

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

initLanguage();
secureStore.init(Config.PORT_KEY_CODE || 'EXAMPLE_PORT_KEY_CODE');

const persistor = persistStore(store);

const App = () => {
  const statusBarProps = useMemo(() => {
    const barProps: StatusBarProps = { barStyle: 'light-content' };
    if (!isIos) {
      barProps.translucent = true;
      barProps.backgroundColor = 'transparent';
    }
    return barProps;
  }, []);
  useEffect(() => {
    // Lock the screen orientation Right-side up portrait only.
    lockScreenOrientation();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppListener>
          <GlobalStyleHandler>
            <ThemeProvider theme={myTheme}>
              <InterfaceProvider>
                <TopView>
                  <SafeAreaProvider>
                    <StatusBar {...statusBarProps} />
                    <NavigationRoot />
                    <Updater />
                  </SafeAreaProvider>
                </TopView>
              </InterfaceProvider>
            </ThemeProvider>
          </GlobalStyleHandler>
        </AppListener>
      </PersistGate>
    </Provider>
  );
};

export default Sentry.wrap(CodePush(codePushOptions)(App));
