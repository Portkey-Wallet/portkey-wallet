import React from 'react';
import { forwardRef, useMemo, useState, useCallback, useRef, useImperativeHandle, ReactNode } from 'react';
import { StyleSheet, ActivityIndicator, View, ModalProps, ViewStyle, StyleProp, Modal } from 'react-native';

import WebView, { WebViewMessageEvent, WebViewProps } from 'react-native-webview';
import getTemplate from './getTemplate';

export declare type RecaptchaInterface = {
  open(): void;
  close(): void;
};

const styles = StyleSheet.create({
  webView: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
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

const originWhitelist = ['*'];

export type RecaptchaProps = {
  headerComponent?: ReactNode;
  footerComponent?: ReactNode;
  loadingComponent?: ReactNode;
  webViewProps?: Omit<WebViewProps, 'source' | 'style' | 'onMessage' | 'ref'>;
  modalProps?: Omit<ModalProps, 'visible' | 'onRequestClose'>;
  onVerify: (token: string) => void;
  onExpire?: (...args: any[]) => void;
  onError?: (error: string) => void;
  onClose?: (...args: any[]) => void;
  onLoad?: (...args: any[]) => void;
  theme?: 'dark' | 'light';
  size?: 'invisible' | 'normal' | 'compact';
  siteKey: string;
  baseUrl: string;
  lang?: string;
  style?: StyleProp<ViewStyle>;
  enterprise?: boolean;
  recaptchaDomain?: string;
  gstaticDomain?: string;
  hideBadge?: boolean;
  action?: string;
};

const Recaptcha = forwardRef(function Recaptcha(
  {
    headerComponent,
    footerComponent,
    loadingComponent,
    webViewProps,
    modalProps,
    onVerify,
    onExpire,
    onError,
    onClose,
    onLoad,
    theme,
    size,
    siteKey,
    baseUrl,
    lang,
    style,
    enterprise,
    recaptchaDomain,
    gstaticDomain,
    hideBadge,
    action,
  }: RecaptchaProps,
  ref,
) {
  const isClosed = useRef(true);
  const webViewRef = useRef<any>();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const isInvisibleSize = size === 'invisible';

  const html = useMemo(() => {
    return getTemplate(
      {
        siteKey,
        size,
        theme,
        lang,
        action,
      },
      enterprise,
      recaptchaDomain,
      gstaticDomain,
      hideBadge,
    );
  }, [siteKey, size, theme, lang, action, enterprise, recaptchaDomain, gstaticDomain, hideBadge]);

  const handleLoad = useCallback(
    (...args: any[]) => {
      onLoad?.(...args);

      if (isInvisibleSize) {
        webViewRef.current?.injectJavaScript(`
                window.rnRecaptcha.execute();
            `);
      }

      setLoading(false);
    },
    [onLoad, isInvisibleSize],
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
        if (payload.close && isInvisibleSize) {
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
          handleClose();
          onVerify?.(payload.verify[0]);
        }
      } catch (err) {
        console.warn(err);
      }
    },
    [onVerify, onExpire, onError, handleClose, handleLoad, isInvisibleSize],
  );

  const source = useMemo(
    () => ({
      html,
      baseUrl,
    }),
    [html, baseUrl],
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
    if (!loading && source) return null;
    return <View style={styles.loadingContainer}>{loadingComponent || <ActivityIndicator size="large" />}</View>;
  };

  return (
    <Modal transparent {...modalProps} visible={visible} onRequestClose={handleClose}>
      {headerComponent}
      <WebView
        ref={webViewRef}
        bounces={false}
        // allowsBackForwardNavigationGestures={false}
        originWhitelist={originWhitelist}
        onShouldStartLoadWithRequest={event => {
          // prevent navigation on iOS
          return event.navigationType === 'other';
        }}
        onNavigationStateChange={() => {
          // prevent navigation on Android
          if (!loading) webViewRef.current?.stopLoading();
        }}
        {...webViewProps}
        source={source}
        style={webViewStyles}
        onMessage={handleMessage}
      />
      {footerComponent}
      {renderLoading()}
    </Modal>
  );
});

export default Recaptcha;
