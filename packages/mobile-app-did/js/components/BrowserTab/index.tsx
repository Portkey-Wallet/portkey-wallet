import React, { forwardRef, memo, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { screenHeight, screenWidth } from '@portkey-wallet/utils/mobile/device';
import ProviderWebview, { IWebView } from 'components/ProviderWebview';
import { captureRef } from 'react-native-view-shot';
import { useBrowser } from 'components/TabsDrawer/context';
import Progressbar from 'components/Progressbar';

type BrowserTabProps = {
  isHidden: boolean;
  uri: string;
};

const BrowserTab = forwardRef<any, BrowserTabProps>(function BrowserTab({ isHidden, uri }, forward) {
  const viewRef = useRef<any>(null);
  const webViewRef = useRef<IWebView | null>(null);
  const progressbarRef = useRef<any>(null);

  const { setTabRef } = useBrowser();

  const options = useMemo(
    () => ({
      capture: () => captureRef(viewRef?.current, { quality: 0.2, format: 'jpg' }),
      reload: () => webViewRef.current?.reload(),
    }),
    [],
  );
  useImperativeHandle(forward, () => options, [options]);

  useEffect(() => {
    if (isHidden) return;
    setTabRef?.(options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHidden, options]);

  return (
    <View
      ref={viewRef}
      collapsable={false}
      style={[styles.webViewContainer, isHidden && styles.webViewContainerHidden]}>
      <Progressbar ref={progressbarRef} />
      <ProviderWebview
        ref={webViewRef}
        source={{ uri }}
        onLoadProgress={({ nativeEvent }) => progressbarRef.current.changeInnerBarWidth(nativeEvent.progress)}
      />
    </View>
  );
});

export default memo(BrowserTab, (prevProps: BrowserTabProps, nextProps: BrowserTabProps) => {
  return prevProps.isHidden === nextProps.isHidden && prevProps.uri === nextProps.uri;
});

export const styles = StyleSheet.create({
  webViewContainerHidden: {
    flex: 0,
    opacity: 0,
    display: 'none',
    width: 0,
    height: 0,
    position: 'relative',
  },
  webViewContainer: {
    width: screenWidth,
    height: screenHeight,
  },
});
