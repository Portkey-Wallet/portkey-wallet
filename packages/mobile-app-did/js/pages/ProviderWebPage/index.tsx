import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import ProviderWebview, { IWebView } from 'components/ProviderWebview';
import Progressbar, { IProgressbar } from 'components/Progressbar';
import SafeAreaBox from 'components/SafeAreaBox';
import CustomHeader from 'components/CustomHeader';
import { SafeAreaColorMap } from 'components/PageContainer';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import GStyles from 'assets/theme/GStyles';
import { BGStyles } from 'assets/theme/styles';

const ProviderWebPage = () => {
  const webViewRef = useRef<IWebView | null>(null);
  const progressbarRef = useRef<IProgressbar>(null);
  const { url, title } = useRouterParams<{ url: string; title: string }>();

  return (
    <SafeAreaBox edges={['top', 'right', 'left']} style={{ backgroundColor: SafeAreaColorMap.blue }}>
      <View style={[GStyles.flex1, BGStyles.bg4]}>
        <CustomHeader themeType={'blue'} titleDom={title} />
        <View style={styles.contentWrap}>
          <Progressbar ref={progressbarRef} />
          <ProviderWebview
            ref={webViewRef}
            style={styles.webview}
            source={{ uri: url }}
            onLoadProgress={({ nativeEvent }) => progressbarRef.current?.changeInnerBarWidth(nativeEvent.progress)}
          />
        </View>
      </View>
    </SafeAreaBox>
  );
};

export default ProviderWebPage;

const styles = StyleSheet.create({
  webview: {
    width: '100%',
    flex: 1,
  },
  contentWrap: {
    position: 'relative',
    flex: 1,
  },
});
