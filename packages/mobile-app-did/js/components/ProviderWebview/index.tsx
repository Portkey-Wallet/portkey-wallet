import React, { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Linking, StyleSheet } from 'react-native';
import WebView, { WebViewProps } from 'react-native-webview';
import useEffectOnce from 'hooks/useEffectOnce';
import EntryScriptWeb3 from 'utils/EntryScriptWeb3';
import { MobileStream } from 'dapp/mobileStream';
import DappMobileOperator from 'dapp/dappMobileOperator';
import {
  FileDownloadEvent,
  WebViewErrorEvent,
  WebViewNavigation,
  WebViewNavigationEvent,
} from 'react-native-webview/lib/WebViewTypes';
import URL from 'url-parse';
import { store } from 'store';
import { DappOverlay } from 'dapp/dappOverlay';
import { DappMobileManager } from 'dapp/dappManager';
import { getFaviconUrl } from '@portkey-wallet/utils/dapp/browser';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import { useDeepEQMemo } from 'hooks';
import * as Application from 'expo-application';
import { ShouldStartLoadRequest } from 'react-native-webview/lib/WebViewTypes';
import { PROTOCOL_ALLOW_LIST } from 'constants/web';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCMS } from '@portkey-wallet/hooks/hooks-ca/cms/discover';

export const BLANK_PAGE = 'about:blank';
const PORTKEY_AUDIO_MANAGER_SCRIPT =
  'let _portkeyPausedAudioList = []; function _portkeyPauseAudio() { _portkeyPausedAudioList = []; const audioList = document.getElementsByTagName("audio"); Array.from(audioList).forEach(function(audio){if (!audio.paused) {audio.pause(); _portkeyPausedAudioList.push(audio);}});} function _portkeyResumeAudio() { _portkeyPausedAudioList && _portkeyPausedAudioList.forEach(function(audio){audio.play();}); _portkeyPausedAudioList = []; }';

export interface IWebView {
  goBack: WebView['goBack'];
  reload: WebView['reload'];
  postMessage: WebView['postMessage'];
  injectJavaScript: WebView['injectJavaScript'];
  goForward: WebView['goForward'];
  autoApprove: () => void;
}
// DefaultSource
// fix android not refreshing
const DefaultSource = { uri: '' };

const ProviderWebview = forwardRef<
  IWebView | undefined,
  WebViewProps & {
    isHidden?: boolean;
    isDiscover?: boolean;
  }
>(function ProviderWebview(props, forward) {
  const [source, setSource] = useState<WebViewProps['source']>(DefaultSource);
  const webViewRef = useRef<WebView | null>(null);
  const operatorRef = useRef<DappMobileOperator | null>(null);
  // Android will trigger onLoadEnd before onLoadStart, Mark start status.
  const loadStartRef = useRef<boolean>(false);
  const prePageUrl = useRef<string>();
  const [entryScriptWeb3, setEntryScriptWeb3] = useState<string>();
  const { networkType } = useCurrentNetworkInfo();
  const { dappWhiteListMap } = useCMS();
  useEffectOnce(() => {
    const getEntryScriptWeb3 = async () => {
      const script = await EntryScriptWeb3.get();
      const scriptWithAudioManager = `${PORTKEY_AUDIO_MANAGER_SCRIPT};${script}`;
      setEntryScriptWeb3(scriptWithAudioManager);
      if (!isIOS) webViewRef.current?.injectJavaScript(scriptWithAudioManager);
    };

    getEntryScriptWeb3();
    return () => {
      operatorRef.current?.onDestroy();
    };
  });

  const memoSource = useDeepEQMemo(() => props.source, [props.source]);

  useEffect(() => {
    // fix android not refreshing
    // asynchronously change Source
    setTimeout(() => {
      setSource(memoSource);
    }, 0);
  }, [memoSource]);

  useEffect(() => {
    if (props.isHidden) {
      webViewRef.current?.injectJavaScript('_portkeyPauseAudio && _portkeyPauseAudio();');
    } else {
      webViewRef.current?.injectJavaScript('_portkeyResumeAudio && _portkeyResumeAudio();');
    }
    operatorRef.current?.setIsLockDapp(!!props.isHidden);
  }, [props.isHidden]);

  const initOperator = useCallback(
    (origin: string) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (!isIOS) webViewRef.current?.injectJavaScript(entryScriptWeb3!);

      operatorRef.current = new DappMobileOperator({
        origin,
        isDiscover: props.isDiscover,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        stream: new MobileStream(webViewRef.current!),
        dappManager: new DappMobileManager({ store: store as any }),
        dappOverlay: new DappOverlay(),
        dappWhiteList: dappWhiteListMap[networkType],
      });
    },
    [dappWhiteListMap, entryScriptWeb3, networkType, props.isDiscover],
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
      stopLoading: () => webViewRef.current?.stopLoading(),

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
  const onFileDownload = useCallback(async (event: FileDownloadEvent) => {
    try {
      await Linking.openURL(event.nativeEvent.downloadUrl);
    } catch (er: any) {
      console.log('Failed to open Link:', er.message);
    } finally {
      webViewRef.current?.reload();
    }
  }, []);
  const onShouldStartLoadWithRequest = ({ url }: ShouldStartLoadRequest) => {
    const { protocol } = new URL(url);
    if (PROTOCOL_ALLOW_LIST.includes(protocol)) return true;
    // if (SCHEME_ALLOW_LIST.includes(protocol)) {
    // open natively
    Linking.openURL(url).catch(er => {
      console.log('Failed to open Link:', er.message);
    });
    // }
    return false;
  };
  const webViewDom = useMemo(
    () => (
      <WebView
        ref={webViewRef}
        // style={styles.webView}
        decelerationRate="normal"
        originWhitelist={['*']}
        injectedJavaScript={!isIOS ? entryScriptWeb3 : undefined}
        injectedJavaScriptBeforeContentLoaded={isIOS ? entryScriptWeb3 : undefined}
        applicationNameForUserAgent={`WebView Portkey did Mobile PortkeyV${Application.nativeApplicationVersion}`}
        {...props}
        style={styles.webView}
        source={source}
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
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
        onNavigationStateChange={(event: WebViewNavigation) => {
          if (prePageUrl.current === BLANK_PAGE && event.url !== BLANK_PAGE && !isIOS)
            webViewRef.current?.clearHistory?.();
          prePageUrl.current = event.url;
          props.onNavigationStateChange?.(event);
        }}
        onMessage={event => {
          const { nativeEvent } = event;
          operatorRef.current?.handleRequestMessage(nativeEvent.data);
          props.onMessage?.(event);
        }}
        onFileDownload={props.onFileDownload ? props.onFileDownload : onFileDownload}
        // fix webview show blank page when not used for some time in android
        // https://github.com/react-native-webview/react-native-webview/blob/master/docs/Reference.md#onrenderprocessgone
        onRenderProcessGone={() => webViewRef.current?.reload()}
        // fix webview show blank page when not used for some time in iOS
        // https://github.com/react-native-webview/react-native-webview/blob/master/docs/Reference.md#oncontentprocessdidterminate
        onContentProcessDidTerminate={() => webViewRef.current?.reload()}
      />
    ),
    [entryScriptWeb3, handleUpdate, onFileDownload, onLoadStart, props, source],
  );
  if (!entryScriptWeb3) return null;

  if (isIOS) return webViewDom;

  return (
    <KeyboardAwareScrollView enableOnAndroid={true} contentContainerStyle={styles.scrollStyle}>
      {webViewDom}
    </KeyboardAwareScrollView>
  );
});

export default memo(ProviderWebview);

export const styles = StyleSheet.create({
  scrollStyle: {
    flex: 1,
  },
  webView: {
    flex: 1,
    zIndex: 1,
  },
});
