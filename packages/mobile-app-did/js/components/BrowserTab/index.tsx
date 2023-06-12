import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import WebView from 'react-native-webview';
import { pTd } from 'utils/unit';
import useEffectOnce from 'hooks/useEffectOnce';
import EntryScriptWeb3 from 'utils/EntryScriptWeb3';
import { MobileStream } from 'dapp/mobileStream';
import DappMobileOperator from 'dapp/dappMobileOperator';
import { WebViewErrorEvent, WebViewNavigationEvent } from 'react-native-webview/lib/WebViewTypes';
import URL from 'url-parse';
import { store } from 'store';
import { DappOverlay } from 'dapp/dappOverlay';
import { DappMobileManager } from 'dapp/dappManager';
import { getHost } from '@portkey-wallet/utils/dapp/browser';
import { isIos } from '@portkey-wallet/utils/mobile/device';

type BrowserTabProps = {
  uri: string;
};

const BrowserTab: React.FC<BrowserTabProps> = ({ uri }) => {
  const webViewRef = useRef<WebView | null>(null);
  const operatorRef = useRef<DappMobileOperator | null>(null);
  const [entryScriptWeb3, setEntryScriptWeb3] = useState<string>();
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

  const initOperator = useCallback(
    (origin: string) => {
      if (!isIos) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        webViewRef.current?.injectJavaScript(entryScriptWeb3!);
      }
      operatorRef.current = new DappMobileOperator({
        origin,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        stream: new MobileStream(webViewRef.current!),
        dappManager: new DappMobileManager({ store: store as any }),
        dappOverlay: new DappOverlay(),
      });
    },
    [entryScriptWeb3],
  );

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
  if (!entryScriptWeb3) return null;
  return (
    <WebView
      ref={webViewRef}
      style={styles.webView}
      decelerationRate="normal"
      source={{ uri }}
      injectedJavaScriptBeforeContentLoaded={isIos ? entryScriptWeb3 : ''}
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
  );
};

export default BrowserTab;

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
