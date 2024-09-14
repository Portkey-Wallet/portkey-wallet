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
import { DisclaimerModal, ModalCloseTracer } from 'components/DisclaimerModal';
import { useFocusEffect } from '@react-navigation/native';
import { pTd } from 'utils/unit';

const ProviderWebPage = () => {
  const { url, title, icon } = useRouterParams<{
    url: string;
    title: string;
    icon?: IconName;
  }>();
  return (
    <SafeAreaBox edges={['top', 'right', 'left']} style={{ backgroundColor: SafeAreaColorMap.white }}>
      <View style={[GStyles.flex1, BGStyles.bg4]}>
        <CustomHeader themeType={'white'} titleDom={title} />
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
  const [refusedDisclaimer, setRefusedDisclaimer] = useState(false);
  useFocusEffect(
    useCallback(() => {
      if (!disclaimerInfo) {
        return;
      }
      const { origin } = getUrlObj(url);
      if (!needInnerDisclaimerCheck || checkDappIsConfirmed(origin)) {
        setRefusedDisclaimer(false);
      } else {
        setRefusedDisclaimer(true);
      }
    }, [checkDappIsConfirmed, disclaimerInfo, needInnerDisclaimerCheck, url]),
  );

  return (
    <View style={styles.contentWrap}>
      {refusedDisclaimer ? (
        <View style={styles.disclaimerWrap}>
          <DisclaimerModal
            url={url}
            title={disclaimerInfo?.title || ''}
            description={disclaimerInfo?.description || ''}
            icon={disclaimerInfo?.icon}
            tracer={new ModalCloseTracer()}
            style={styles.disclaimerModal}
            isShowRightCloseIcon={true}
            disclaimerCheckFailCallBack={disclaimerCheckFailCallBack}
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            disclaimerCheckSuccessCallBack={() => {}}
          />
          <View style={styles.disclaimerBottomGap} />
        </View>
      ) : (
        <>
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
          {isWebviewLoading && <Placeholder dappName={title} icon={icon} />}
        </>
      )}
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
  disclaimerWrap: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  disclaimerModal: {
    height: pTd(600),
    borderBottomEndRadius: 0,
    borderBottomLeftRadius: 0,
  },
  disclaimerBottomGap: {
    height: pTd(12),
    backgroundColor: 'white',
  },
});
