import React from 'react';
import { Provider } from 'react-redux';
import { store } from 'store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar, StatusBarProps, Text, View } from 'react-native';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import RouterProvider from 'core/router/provider';
import { defaultRouterParams } from 'core/router/context';
// import { PersistGate } from 'redux-persist/integration/react';
// import persistStore from 'redux-persist/es/persistStore';
// import { TextTitle } from '@portkey-wallet/rn-components/components/CommonText';
// let persistStoreSuccess = false;
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
  // const persistor = persistStore(store);
  const routerP = extraProps?.routerParams?.from ? { from: extraProps?.routerParams?.from } : defaultRouterParams;
  const component = (props: any) => {
    return (
      <Provider store={store}>
        {/* <PersistGate
          loading={
            <View
              style={{
                backgroundColor: 'white',
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TextTitle>正在加载</TextTitle>
            </View>
          }
          persistor={persistor}> */}
        <RouterProvider value={routerP}>
          <SafeAreaView
            // eslint-disable-next-line react-native/no-inline-styles
            style={{ width: '100%', height: '100%', backgroundColor: extraProps?.statusbarColor ?? '#5B8EF4' }}>
            <StatusBar {...statusBarProps} />
            <WrappedComponent {...props} />
          </SafeAreaView>
        </RouterProvider>
        {/* </PersistGate> */}
      </Provider>
    );
  };
  return component;
};

export default ProviderComponent;
