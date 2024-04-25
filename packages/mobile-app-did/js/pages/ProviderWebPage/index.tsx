import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ProviderWebview, { IWebView } from 'components/ProviderWebview';
import Progressbar, { IProgressbar } from 'components/Progressbar';
import SafeAreaBox from 'components/SafeAreaBox';
import CustomHeader from 'components/CustomHeader';
import { SafeAreaColorMap } from 'components/PageContainer';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import GStyles from 'assets/theme/GStyles';
import { BGStyles } from 'assets/theme/styles';
import { useSecuritySafeCheckAndToast } from 'hooks/security';
import navigationService from 'utils/navigationService';
import { IconName } from 'components/Svg';
import Placeholder from './components/Placeholder';

const ProviderWebPage = () => {
  const webViewRef = useRef<IWebView | null>(null);
  const progressbarRef = useRef<IProgressbar>(null);
  const securitySafeCheckAndToast = useSecuritySafeCheckAndToast();
  const {
    url,
    title,
    needSecuritySafeCheck = false,
    icon,
  } = useRouterParams<{ url: string; title: string; needSecuritySafeCheck?: boolean; icon?: IconName }>();

  const [showPlaceholder, setShowPlaceholder] = useState(needSecuritySafeCheck);

  useEffect(() => {
    (async () => {
      if (needSecuritySafeCheck) {
        if (!(await securitySafeCheckAndToast())) {
          navigationService.goBack();
        } else {
          setShowPlaceholder(false);
        }
      }
    })();
  }, [needSecuritySafeCheck, securitySafeCheckAndToast, url]);

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
          {showPlaceholder && <Placeholder dappName={title} icon={icon} />}
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
