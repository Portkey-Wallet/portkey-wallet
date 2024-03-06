import React, { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import ProviderWebview, { IWebView } from 'components/ProviderWebview';
import { CaptureOptions, captureRef } from 'react-native-view-shot';
import { IBrowserTab, useBrowser } from 'components/TabsDrawer/context';
import Progressbar, { IProgressbar } from 'components/Progressbar';
import HttpModal from './components/HttpModal';
import { getProtocolAndHost, isDangerousLink } from '@portkey-wallet/utils/dapp/browser';
import { WebViewErrorEvent, WebViewNavigationEvent } from 'react-native-webview/lib/WebViewTypes';
import { useFetchCurrentRememberMeBlackList } from '@portkey-wallet/hooks/hooks-ca/cms';
import useEffectOnce from 'hooks/useEffectOnce';
import OverlayModal from 'components/OverlayModal';
import { WebViewProps } from 'react-native-webview';

type BrowserTabProps = {
  isHidden: boolean;
  id: string | number;
  uri: string;
  autoApprove?: boolean;
  onLoadEnd?: (nativeEvent: any) => void;
  onNavigationStateChange?: WebViewProps['onNavigationStateChange'];
};

const Options: CaptureOptions = { quality: 0.2, format: 'jpg' };

const BrowserTab = forwardRef<IBrowserTab, BrowserTabProps>(function BrowserTab(
  { isHidden, uri, onLoadEnd, autoApprove, onNavigationStateChange },
  forward,
) {
  const viewRef = useRef<any>(null);
  const webViewRef = useRef<IWebView | null>(null);

  const progressbarRef = useRef<IProgressbar>(null);
  const { setTabRef } = useBrowser();
  const isApproved = useRef<boolean>(false);
  const options = useMemo(
    () => ({
      capture: () => captureRef(viewRef?.current, Options),
      reload: () => webViewRef.current?.reload(),
      goBack: () => webViewRef.current?.goBack(),
      goForward: () => webViewRef.current?.goForward(),
      goBackHome: () => {
        const INJECT_CODE = `(function () {
          window.location.href = '${uri}'
          })();`;
        webViewRef.current?.injectJavaScript(INJECT_CODE);
      },
    }),
    [uri],
  );

  useImperativeHandle(forward, () => options, [options]);
  const fetchCurrentRememberMeBlackList = useFetchCurrentRememberMeBlackList();

  useEffect(() => {
    if (isHidden) return;
    setTabRef?.(options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHidden, options]);

  const onPageLoadEnd = useCallback(
    ({ nativeEvent }: WebViewNavigationEvent | WebViewErrorEvent) => {
      if (!isDangerousLink(getProtocolAndHost(uri)) && !isApproved.current && autoApprove) {
        isApproved.current = true;
        if (!isHidden) webViewRef.current?.autoApprove();
      }
      onLoadEnd?.(nativeEvent);
    },
    [uri, autoApprove, isHidden, onLoadEnd],
  );

  useEffectOnce(() => {
    OverlayModal.hide();
    fetchCurrentRememberMeBlackList();
  });

  return (
    <View
      ref={viewRef}
      collapsable={false}
      style={[styles.webViewContainer, isHidden && styles.webViewContainerHidden]}>
      <Progressbar ref={progressbarRef} />
      <ProviderWebview
        isDiscover
        ref={webViewRef}
        source={{ uri }}
        isHidden={isHidden}
        onLoadEnd={onPageLoadEnd}
        onNavigationStateChange={onNavigationStateChange}
        onLoadProgress={({ nativeEvent }) => progressbarRef.current?.changeInnerBarWidth(nativeEvent.progress)}
      />
      <HttpModal uri={uri} />
    </View>
  );
});

export default memo(BrowserTab, (prevProps: BrowserTabProps, nextProps: BrowserTabProps) => {
  return (
    prevProps.isHidden === nextProps.isHidden &&
    prevProps.uri === nextProps.uri &&
    prevProps.autoApprove === nextProps.autoApprove
  );
});

export const styles = StyleSheet.create({
  webViewContainerHidden: {
    opacity: 0,
    display: 'none',
    width: 0,
    height: 0,
    position: 'relative',
  },
  webViewContainer: {
    flex: 1,
  },
});
