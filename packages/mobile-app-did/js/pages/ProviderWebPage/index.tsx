import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ProviderWebview, { IWebView } from 'components/ProviderWebview';
import Progressbar, { IProgressbar } from 'components/Progressbar';
import SafeAreaBox from 'components/SafeAreaBox';
import CustomHeader from 'components/CustomHeader';
import { SafeAreaColorMap } from 'components/PageContainer';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import GStyles from 'assets/theme/GStyles';
import { BGStyles } from 'assets/theme/styles';
import { IconName } from 'components/Svg';
import Placeholder from './components/Placeholder';
import { getUrlObj } from '@portkey-wallet/utils/dapp/browser';
import { useDisclaimer } from '@portkey-wallet/hooks/hooks-ca/disclaimer';
import DisclaimerModal from 'components/DisclaimerModal';
import { useFocusEffect } from '@react-navigation/native';

const ProviderWebPage = () => {
  const { url, title, icon } = useRouterParams<{
    url: string;
    title: string;
    icon?: IconName;
  }>();
  return (
    <SafeAreaBox edges={['top', 'right', 'left']} style={{ backgroundColor: SafeAreaColorMap.blue }}>
      <View style={[GStyles.flex1, BGStyles.bg4]}>
        <CustomHeader themeType={'blue'} titleDom={title} />
        <ProviderWebPageComponent url={url} title={title} icon={icon} />
      </View>
    </SafeAreaBox>
  );
};

export const ProviderWebPageComponent = ({
  url,
  icon,
  title,
  disclaimerInfo,
  needInnerDisclaimerCheck,
  disclaimerCheckFailCallBack,
}: {
  url: string;
  title: string;
  disclaimerInfo?: {
    title: string;
    description: string;
    icon?: IconName;
  };
  icon?: IconName;
  needInnerDisclaimerCheck?: boolean;
  disclaimerCheckFailCallBack?: () => void;
}) => {
  const { checkDappIsConfirmed } = useDisclaimer();
  const webViewRef = useRef<IWebView | null>(null);
  const progressbarRef = useRef<IProgressbar>(null);
  const [isWebviewLoading, setWebviewLoading] = useState(true);
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (!disclaimerInfo) {
        setShowPlaceholder(isWebviewLoading);
        return;
      }
      if (needInnerDisclaimerCheck) {
        try {
          const { origin } = getUrlObj(url);
          if (!checkDappIsConfirmed(origin)) {
            return DisclaimerModal.showDisclaimerModal({
              ...disclaimerInfo,
              url,
              disclaimerCheckFailCallBack,
              disclaimerCheckSuccessCallBack: () => setShowPlaceholder(false),
            });
          } else {
            setShowPlaceholder(isWebviewLoading);
          }
        } catch (error) {
          console.log(error);
        }
      }
    }, [
      checkDappIsConfirmed,
      disclaimerCheckFailCallBack,
      disclaimerInfo,
      isWebviewLoading,
      needInnerDisclaimerCheck,
      url,
    ]),
  );

  return (
    <View style={styles.contentWrap}>
      <Progressbar ref={progressbarRef} />
      <ProviderWebview
        ref={webViewRef}
        style={styles.webview}
        source={{ uri: url }}
        onLoadProgress={({ nativeEvent }) => progressbarRef.current?.changeInnerBarWidth(nativeEvent.progress)}
        onLoadEnd={() => {
          setWebviewLoading(false);
        }}
      />
      {showPlaceholder && <Placeholder dappName={title} icon={icon} />}
    </View>
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
