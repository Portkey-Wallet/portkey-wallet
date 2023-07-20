import React, { forwardRef, memo, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import WebView, { WebViewProps } from 'react-native-webview';
import useEffectOnce from 'hooks/useEffectOnce';
import EntryScriptWeb3 from 'utils/EntryScriptWeb3';
import { MobileStream } from 'dapp/mobileStream';
import DappMobileOperator from 'dapp/dappMobileOperator';
import { WebViewErrorEvent, WebViewNavigationEvent } from 'react-native-webview/lib/WebViewTypes';
import URL from 'url-parse';
import { store } from 'store';
import { DappOverlay } from 'dapp/dappOverlay';
import { DappMobileManager } from 'dapp/dappManager';
import { getFaviconUrl } from '@portkey-wallet/utils/dapp/browser';
import { isIos } from '@portkey-wallet/utils/mobile/device';

export interface IWebView {
  goBack: WebView['goBack'];
  reload: WebView['reload'];
  postMessage: WebView['postMessage'];
  injectJavaScript: WebView['injectJavaScript'];
  goForward: WebView['goForward'];
  autoApprove: () => void;
}

const ProviderWebview = forwardRef<IWebView | undefined, WebViewProps>(function ProviderWebview(props, forward) {
  const webViewRef = useRef<WebView | null>(null);
  const operatorRef = useRef<DappMobileOperator | null>(null);
  // Android will trigger onLoadEnd before onLoadStart, Mark start status.
  const loadStartRef = useRef<boolean>(false);
  const [entryScriptWeb3, setEntryScriptWeb3] = useState<string>();
  useEffectOnce(() => {
    const getEntryScriptWeb3 = async () => {
      const script = await EntryScriptWeb3.get();
      setEntryScriptWeb3(script);
      if (!isIos) webViewRef.current?.injectJavaScript(script);
    };

    getEntryScriptWeb3();
    return () => {
      operatorRef.current?.onDestroy();
    };
  });

  const initOperator = useCallback(
    (origin: string) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (!isIos) webViewRef.current?.injectJavaScript(entryScriptWeb3!);

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
      if (!loadStartRef.current) loadStartRef.current = true;
      const { origin } = new URL(nativeEvent.url);
      initOperator(origin);
    },
    [initOperator],
  );
  const handleUpdate = useCallback(({ nativeEvent }: WebViewNavigationEvent | WebViewErrorEvent) => {
    const { origin, pathname = '', query = '' } = new URL(nativeEvent.url);
    const realUrl = `${origin}${pathname}${query}`;
    const icon = getFaviconUrl(realUrl, 50);
    operatorRef.current?.updateDappInfo({
      origin,
      name: nativeEvent.title,
      icon,
    });
  }, []);
  useImperativeHandle(
    forward,
    () => ({
      goBack: () => webViewRef.current?.goBack(),
      /**
       * Go forward one page in the webview's history.
       */
      goForward: () => webViewRef.current?.goForward(),

      /**
       * Reloads the current page.
       */
      reload: () => webViewRef.current?.reload(),

      /**
       * Stop loading the current page.
       */
      stopLoading: () => webViewRef.current?.reload(),

      /**
       * Executes the JavaScript string.
       */
      injectJavaScript: (script: string) => webViewRef.current?.injectJavaScript(script),

      /**
       * Focuses on WebView redered page.
       */
      requestFocus: () => webViewRef.current?.requestFocus(),

      /**
       * Posts a message to WebView.
       */
      postMessage: (message: string) => webViewRef.current?.postMessage(message),
      /**
       * auto approve
       */
      autoApprove: () => operatorRef.current?.autoApprove(),
    }),
    [],
  );
  if (!entryScriptWeb3) return null;
  return (
    <WebView
      ref={webViewRef}
      style={styles.webView}
      decelerationRate="normal"
      injectedJavaScriptBeforeContentLoaded={isIos ? entryScriptWeb3 : undefined}
      applicationNameForUserAgent={'WebView Portkey did Mobile'}
      {...props}
      onLoadStart={event => {
        onLoadStart(event);
        props.onLoadStart?.(event);
      }}
      onLoadEnd={event => {
        if (!loadStartRef.current) return;
        handleUpdate(event);
        props.onLoadEnd?.(event);
      }}
      onLoad={event => {
        if (!loadStartRef.current) return;
        handleUpdate(event);
        props.onLoad?.(event);
      }}
      onMessage={event => {
        const { nativeEvent } = event;
        operatorRef.current?.handleRequestMessage(nativeEvent.data);
        props.onMessage?.(event);
      }}
    />
  );
});

export default memo(ProviderWebview);

export const styles = StyleSheet.create({
  webView: {
    flex: 1,
    zIndex: 1,
  },
});
