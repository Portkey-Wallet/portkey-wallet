import React from 'react';
import { forwardRef, useMemo, useState, useCallback, useRef, useImperativeHandle, ReactNode } from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';

import WebView, { WebViewMessageEvent, WebViewProps } from 'react-native-webview';

export declare type AppleLoginInterface = {
  open(): void;
  close(): void;
};

const styles = StyleSheet.create({
  webView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export type AppleLoginProps = {
  headerComponent?: ReactNode;
  footerComponent?: ReactNode;
  loadingComponent?: ReactNode;
  webViewProps?: Omit<WebViewProps, 'source' | 'style' | 'onMessage' | 'ref'>;
  onVerify: (token: string) => void;
  onExpire?: (...args: any[]) => void;
  onError?: (error: string) => void;
  onClose?: (...args: any[]) => void;
  onLoad?: (...args: any[]) => void;
  theme?: 'dark' | 'light';
  size?: 'invisible' | 'normal' | 'compact';
  baseUrl: string;
  lang?: string;
  style?: StyleProp<ViewStyle>;
  enterprise?: boolean;
  appleLoginDomain?: string;
  gstaticDomain?: string;
  hideBadge?: boolean;
  action?: string;
};

const AppleLogin = forwardRef(function AppleLogin(
  {
    headerComponent,
    footerComponent,
    loadingComponent,
    onVerify,
    onExpire,
    onError,
    onClose,
    onLoad,
    size,
    baseUrl,
    style,
  }: AppleLoginProps,
  ref,
) {
  const isClosed = useRef(false);
  const webViewRef = useRef<any>();
  const [, setVisible] = useState(true);
  const [loading, setLoading] = useState(true);

  const isInvisibleSize = size === 'invisible';

  const handleLoad = useCallback(
    (...args: any[]) => {
      onLoad?.(...args);

      setLoading(false);
    },
    [onLoad],
  );

  const handleClose = useCallback(
    (...args: any[]) => {
      if (isClosed.current) return;
      isClosed.current = true;
      setVisible(false);
      onClose?.(...args);
    },
    [onClose],
  );

  const handleMessage = useCallback(
    (content: WebViewMessageEvent) => {
      try {
        const payload = JSON.parse(content.nativeEvent.data);
        console.log('payload', payload);

        if (payload.close && isInvisibleSize) {
          handleClose();
        }
        if (payload.closeWebView) {
          handleClose();
        }
        if (payload.load) {
          handleLoad(...payload.load);
        }
        if (payload.expire) {
          onExpire?.(payload.expire);
        }
        if (payload.error) {
          handleClose();
          onError?.(payload.error[0]);
        }
        if (payload.verify) {
          handleClose('verified');
          onVerify?.(payload.verify[0]);
        }
      } catch (err) {
        console.warn(err);
      }
    },
    [onVerify, onExpire, onError, handleClose, handleLoad, isInvisibleSize],
  );

  useImperativeHandle(
    ref,
    () => ({
      open: () => {
        setVisible(true);
        setLoading(true);
        isClosed.current = false;
      },
      close: handleClose,
    }),
    [handleClose],
  );

  const webViewStyles = useMemo(() => [styles.webView, style], [style]);

  const renderLoading = () => {
    if (!loading || !loadingComponent) return null;
    return <View style={styles.loadingContainer}>{loadingComponent}</View>;
  };

  return (
    <>
      {headerComponent}
      <WebView
        ref={webViewRef}
        source={{ uri: baseUrl }}
        style={webViewStyles}
        onMessage={handleMessage}
        injectedJavaScript={`(()=>{
          try {
            if(!window.opener) window.opener = {}
            window.opener.postMessage = obj => {
              window.ReactNativeWebView.postMessage(JSON.stringify(obj));
            };
          } catch (error) {
            alert(JSON.stringify(error));
          }
        })()`}
      />
      {footerComponent}
      {renderLoading()}
    </>
  );
});

export default AppleLogin;
