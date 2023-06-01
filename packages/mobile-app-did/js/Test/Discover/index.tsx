import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import WebView from 'react-native-webview';
import CustomHeader from 'components/CustomHeader';
import SafeAreaBox from 'components/SafeAreaBox';
import { pTd } from 'utils/unit';
import navigationService from 'utils/navigationService';
import useEffectOnce from 'hooks/useEffectOnce';
import EntryScriptWeb3 from 'utils/EntryScriptWeb3';
import { MobileStream } from 'dapp/mobileStream';
import DappMobileOperator from 'dapp/dappMobileOperator';
import { WebViewErrorEvent, WebViewNavigationEvent } from 'react-native-webview/lib/WebViewTypes';
import URL from 'url-parse';
import { store } from 'store';
import { DappOverlay } from 'dapp/dappOverlay';
import { DappMobileManager } from 'dapp/dappManager';
import { useDapp } from '../../../../hooks/hooks-ca/dapp';
import CommonButton from 'components/CommonButton';
import DappEventBus from 'dapp/dappEventBus';
import { useAppDispatch } from 'store/hooks';
import { getHost } from '@portkey-wallet/utils/dapp/browser';

const safeAreaColorMap = {
  white: defaultColors.bg1,
  blue: defaultColors.bg5,
  gray: defaultColors.bg4,
  transparent: 'transparent',
};

export type SafeAreaColorMapKeyUnit = keyof typeof safeAreaColorMap;

EntryScriptWeb3.init();
const Discover: React.FC = () => {
  const webViewRef = useRef<WebView | null>(null);
  const operatorRef = useRef<DappMobileOperator | null>(null);
  const [entryScriptWeb3, setEntryScriptWeb3] = useState<string>();
  const dapp = useDapp();
  const dispatch = useAppDispatch();
  console.log(dapp, '=====dapp');
  useEffectOnce(() => {
    const getEntryScriptWeb3 = async () => {
      const script = await EntryScriptWeb3.get();
      setEntryScriptWeb3(script);
    };

    getEntryScriptWeb3();
    return () => {
      operatorRef?.current?.onDestroy();
    };
  });

  const initOperator = useCallback((origin: string) => {
    operatorRef.current = new DappMobileOperator({
      origin,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      stream: new MobileStream(webViewRef.current!),
      dappManager: new DappMobileManager({ store: store as any }),
      dappOverlay: new DappOverlay(),
    });
  }, []);

  const onLoadStart = useCallback(
    ({ nativeEvent }: WebViewNavigationEvent) => {
      const { origin } = new URL(nativeEvent.url);
      initOperator(origin);
    },
    [initOperator],
  );
  const handleUpdate = useCallback(({ nativeEvent }: WebViewNavigationEvent | WebViewErrorEvent) => {
    const { origin, pathname = '', query = '' } = new URL(nativeEvent.url);
    const realUrl = `${origin}${pathname}${query}`;
    const icon = `https://api.faviconkit.com/${getHost(realUrl)}/50`;
    operatorRef.current?.updateDappInfo({
      origin,
      name: nativeEvent.title,
      icon,
    });
  }, []);
  return (
    <SafeAreaBox edges={['top', 'right', 'left']} style={[{ backgroundColor: safeAreaColorMap.blue }]}>
      <CustomHeader titleDom="Discover" leftCallback={navigationService.goBack} />
      <WebView
        ref={webViewRef}
        style={styles.webView}
        decelerationRate="normal"
        source={{ uri: 'http://localhost:3000/' }}
        injectedJavaScriptBeforeContentLoaded={entryScriptWeb3}
        onMessage={({ nativeEvent }) => {
          operatorRef.current?.handleRequestMessage(nativeEvent.data);
        }}
        onLoadStart={onLoadStart}
        onLoad={handleUpdate}
        onLoadProgress={({ nativeEvent }) => {
          console.log(nativeEvent.progress, '=onLoadProgress');
        }}
        onLoadEnd={handleUpdate}
        applicationNameForUserAgent={'WebView Portkey did Mobile'}
      />
      <CommonButton
        onPress={() => {
          DappEventBus.dispatchEvent({
            eventName: 'accountsChanged',
            data: {
              AELF: ['iC1BZJsrn9jEYJ4ABgDnpqaYYbu7JB3fZuBJS5xAoZJB3yBVU'],
              tDVW: ['2BhwLPoSj2z3GSTrBphmqJJ9yq3hdxtLaDQgyoJnJBHvB9cpw1'],
            },
          });
        }}
        title="accountsChanged"
      />
      <CommonButton
        onPress={() => {
          DappEventBus.dispatchEvent({
            eventName: 'chainChanged',
            data: ['AELF', 'tDVV'],
          });
        }}
        title="accountsChanged2"
      />
    </SafeAreaBox>
  );
};

export default Discover;

export const styles = StyleSheet.create({
  pageWrap: {
    paddingLeft: 0,
    paddingRight: 0,
    backgroundColor: defaultColors.bg1,
  },
  svgWrap: {
    marginRight: pTd(16),
  },
  webViewContainer: {
    flex: 1,
    backgroundColor: 'red',
  },
  webView: {
    width: '100%',
    flex: 1,
  },
  noResult: {},
});
