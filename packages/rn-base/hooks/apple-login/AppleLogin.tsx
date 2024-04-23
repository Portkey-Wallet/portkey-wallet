import React from 'react';
import { forwardRef, useMemo, useState, useCallback, useRef, useImperativeHandle, ReactNode } from 'react';
import { StyleSheet, View, ViewStyle, StyleProp, TouchableOpacity } from 'react-native';
import WebView, { WebViewMessageEvent, WebViewProps } from 'react-native-webview';
import { LoadingBody } from '@portkey-wallet/rn-components/components/Loading';

export declare type AppleLoginInterface = {
  open(): void;
  close(): void;
};

const styles = StyleSheet.create({
  webView: {
    flex: 1,
    backgroundColor: 'white',
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
  transparentHeader: {
    height: '20%',
    width: '100%',
    backgroundColor: 'transparent',
  },
});

export type AppleLoginProps = {
  headerComponent?: ReactNode;
  footerComponent?: ReactNode;
  webViewProps?: Omit<WebViewProps, 'source' | 'style' | 'onMessage' | 'ref'>;
  onVerify: (token: string) => void;
  onExpire?: (...args: any[]) => void;
  onError?: (error: string) => void;
  onClose?: (...args: any[]) => void;
  onLoad?: (...args: any[]) => void;
  theme?: 'dark' | 'light';
  size?: 'invisible' | 'normal' | 'compact';
  baseUrl: string;
  style?: StyleProp<ViewStyle>;
  enterprise?: boolean;
  appleLoginDomain?: string;
  gstaticDomain?: string;
  hideBadge?: boolean;
  action?: string;
};

const AppleLogin = forwardRef(function AppleLogin(
  { onVerify, onExpire, onError, onClose, onLoad, size, baseUrl, style }: AppleLoginProps,
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
        if (
          payload?.type === 'PortkeySocialLoginOnSuccess' &&
          payload?.data?.provider === 'Apple' &&
          payload?.data?.token
        ) {
          handleClose('verified');
          onVerify?.(payload?.data?.token);
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
    if (!loading) return null;
    return (
      <View style={styles.loadingContainer}>
        <LoadingBody iconType="loading" />
      </View>
    );
  };

  return (
    <>
      <TouchableOpacity style={styles.transparentHeader} onPress={onClose} />
      <WebView
        ref={webViewRef}
        source={{ uri: baseUrl }}
        style={webViewStyles}
        onLoadEnd={() => setLoading(false)}
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
      {renderLoading()}
    </>
  );
});

export default AppleLogin;
