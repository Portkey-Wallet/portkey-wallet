import React from 'react';
import { Provider } from 'react-redux';
import { store } from 'store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar, StatusBarProps } from 'react-native';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import RouterProvider from 'core/router/provider';
import { defaultRouterParams } from 'core/router/context';

type HigherOrderComponent<T = unknown> = (
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
  const routerP = extraProps?.routerParams?.from ? { from: extraProps?.routerParams?.from } : defaultRouterParams;
  const component = (props: any) => {
    return (
      <Provider store={store}>
        <RouterProvider value={routerP}>
          <SafeAreaView
            // eslint-disable-next-line react-native/no-inline-styles
            style={{ width: '100%', height: '100%', backgroundColor: extraProps?.statusbarColor ?? '#5B8EF4' }}>
            <StatusBar {...statusBarProps} />
            <WrappedComponent {...props} />
          </SafeAreaView>
        </RouterProvider>
      </Provider>
    );
  };
  return component;
};

export default ProviderComponent;
