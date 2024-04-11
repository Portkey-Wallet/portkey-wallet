import React from 'react';
import { Provider } from 'react-redux';
import { store } from 'store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar, StatusBarProps } from 'react-native';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import RouterProvider from '@portkey-wallet/rn-core/router/provider';
import { defaultRouterParams } from '@portkey-wallet/rn-core/router/context';
import { ThemeProvider } from '@rneui/themed';
import { myTheme } from 'assets/theme';
import InterfaceProvider from '@portkey-wallet/rn-base/contexts/useInterface';
import TopView from 'rn-teaset/components/Overlay/TopView';
import { useLatestRef } from '@portkey-wallet/hooks';
import Initializer from './Initializer';
// import { PersistGate } from 'redux-persist/integration/react';
// import persistStore from 'redux-persist/es/persistStore';
// import { TextTitle } from '@portkey-wallet/rn-components/components/CommonText';
// let persistStoreSuccess = false;
type HigherOrderComponent<T = any> = (
  WrappedComponent: React.ComponentType<T>,
  extraProps?: { statusbarColor?: string; routerParams?: { from?: string } },
) => React.ComponentType<T>;

const ProviderComponent: HigherOrderComponent = (
  WrappedComponent,
  extraProps: { statusbarColor?: string; routerParams?: { from?: string } } = {},
) => {
  const statusBarProps: StatusBarProps = { barStyle: 'light-content' };
  if (!isIOS) {
    statusBarProps.translucent = true;
    statusBarProps.backgroundColor = 'transparent';
  }
  // const persistor = persistStore(store);
  const component = (props: any) => {
    const routerP = extraProps?.routerParams?.from
      ? { from: extraProps?.routerParams?.from, params: props }
      : defaultRouterParams;
    return (
      <Provider store={store}>
        <Initializer />
        <ThemeProvider theme={myTheme}>
          <InterfaceProvider>
            <RouterProvider value={routerP}>
              <TopView>
                <SafeAreaView
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{ width: '100%', height: '100%', backgroundColor: extraProps?.statusbarColor ?? '#5B8EF4' }}>
                  <StatusBar {...statusBarProps} />
                  <WrappedComponent {...props} />
                </SafeAreaView>
              </TopView>
            </RouterProvider>
          </InterfaceProvider>
        </ThemeProvider>
      </Provider>
    );
  };
  return component;
};

export default ProviderComponent;
