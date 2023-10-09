import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import ProviderWebview, { IWebView } from 'components/ProviderWebview';
import Progressbar, { IProgressbar } from 'components/Progressbar';
import SafeAreaBox from 'components/SafeAreaBox';
import CustomHeader from 'components/CustomHeader';
import { SafeAreaColorMap } from 'components/PageContainer';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { DappMap } from '@portkey-wallet/constants/constants-ca/network';

const EBridge = () => {
  const webViewRef = useRef<IWebView | null>(null);
  const progressbarRef = useRef<IProgressbar>(null);
  const { eBridgeUrl } = useCurrentNetworkInfo();

  return (
    <SafeAreaBox edges={['top', 'right', 'left']} style={[{ backgroundColor: SafeAreaColorMap.blue }]}>
      <CustomHeader themeType={'blue'} titleDom="Bridge" />
      <View style={styles.contentWrap}>
        <Progressbar ref={progressbarRef} />
        <ProviderWebview
          ref={webViewRef}
          style={styles.webview}
          source={{ uri: eBridgeUrl || DappMap.bridge }}
          onLoadProgress={({ nativeEvent }) => progressbarRef.current?.changeInnerBarWidth(nativeEvent.progress)}
        />
      </View>
    </SafeAreaBox>
  );
};

export default EBridge;

const styles = StyleSheet.create({
  pageContainer: {
    paddingHorizontal: 0,
  },
  webViewContainer: {
    flex: 1,
  },
  webview: {
    width: '100%',
    flex: 1,
  },
  contentWrap: {
    position: 'relative',
    flex: 1,
  },
});
