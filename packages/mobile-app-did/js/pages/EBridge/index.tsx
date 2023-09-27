import React, { useRef } from 'react';
import { StyleSheet } from 'react-native';
import ProviderWebview, { IWebView } from 'components/ProviderWebview';
import Progressbar, { IProgressbar } from 'components/Progressbar';
import PageContainer from 'components/PageContainer';
import { DappMap } from '@portkey-wallet/constants/constants-ca/network';

const EBridge = () => {
  const webViewRef = useRef<IWebView | null>(null);
  const progressbarRef = useRef<IProgressbar>(null);

  return (
    <PageContainer
      titleDom="Bridge"
      safeAreaColor={['blue', 'white']}
      scrollViewProps={{ disabled: true }}
      containerStyles={styles.pageContainer}>
      <Progressbar ref={progressbarRef} />
      <ProviderWebview
        ref={webViewRef}
        style={styles.providerWebview}
        source={{ uri: DappMap.bridge }}
        onLoadProgress={({ nativeEvent }) => progressbarRef.current?.changeInnerBarWidth(nativeEvent.progress)}
      />
    </PageContainer>
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
  providerWebview: {
    flex: 1,
  },
});
