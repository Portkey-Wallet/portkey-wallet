import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import WebView from 'react-native-webview';
import CustomHeader from 'components/CustomHeader';
import SafeAreaBox from 'components/SafeAreaBox';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { pTd } from 'utils/unit';
import navigationService, { NavigateName } from 'utils/navigationService';
import { useHandleRampSell } from './hooks/useHandleRampSell';
import CommonToast from 'components/CommonToast';
import Progressbar, { IProgressbar } from 'components/Progressbar';
import { RAMP_BUY_URL, RAMP_SELL_URL } from 'constants/common';
import { GuardiansApprovedType } from '@portkey-wallet/types/types-ca/guardian';

const safeAreaColorMap = {
  white: defaultColors.bg1,
  blue: defaultColors.bg5,
  gray: defaultColors.bg4,
  transparent: 'transparent',
};

export type SafeAreaColorMapKeyUnit = keyof typeof safeAreaColorMap;

type WebViewPageType = 'default' | 'ramp-buy' | 'ramp-sell';

export interface RampSellParams {
  orderId?: string;
  guardiansApproved?: GuardiansApprovedType[];
}

const ViewOnWebView: React.FC = () => {
  const {
    title = '',
    url,
    webViewPageType = 'default',
    injectedJavaScript,
    params,
  } = useRouterParams<{
    url: string;
    title?: string;
    webViewPageType?: WebViewPageType;
    injectedJavaScript?: string;
    params?: any;
  }>();
  const { successNavigateName } = useRouterParams<{ successNavigateName: NavigateName }>();
  const [browserInfo] = useState({ url, title });

  const webViewRef = React.useRef<WebView>(null);
  const progressBarRef = React.useRef<IProgressbar>(null);

  const handleRampSell = useHandleRampSell();
  const isAchSellHandled = useRef(false);

  const handleNavigationStateChange = useCallback(
    (navState: any) => {
      if (webViewPageType === 'default') return;

      if (webViewPageType === 'ramp-buy') {
        if (navState.url.startsWith(RAMP_BUY_URL)) {
          if (successNavigateName) {
            navigationService.navigate(successNavigateName);
          } else {
            navigationService.navigate('Tab');
          }
        }
        return;
      }
      if (webViewPageType === 'ramp-sell') {
        if (navState.url.startsWith(RAMP_SELL_URL) && !isAchSellHandled.current) {
          isAchSellHandled.current = true;
          navigationService.navigate('Tab');
          const { orderId, guardiansApproved } = (params as RampSellParams) || {};
          if (!orderId) {
            CommonToast.failError('Transaction failed.');
            return;
          }
          handleRampSell(orderId, guardiansApproved);
        }
      }
    },
    [handleRampSell, params, successNavigateName, webViewPageType],
  );

  return (
    <SafeAreaBox edges={['top', 'right', 'left']} style={[{ backgroundColor: safeAreaColorMap.white }]}>
      <CustomHeader themeType={'white'} titleDom={browserInfo?.title} />
      <View style={pageStyles.contentWrap}>
        <Progressbar ref={progressBarRef} />
        <WebView
          ref={webViewRef}
          style={pageStyles.webView}
          source={{ uri: url ?? '' }}
          onNavigationStateChange={handleNavigationStateChange}
          // cacheEnabled={false}
          injectedJavaScript={injectedJavaScript}
          // incognito={incognito}
          applicationNameForUserAgent={'View Only WebView Portkey did Mobile'}
          onLoadProgress={({ nativeEvent }) => progressBarRef.current?.changeInnerBarWidth(nativeEvent.progress)}
        />
      </View>
    </SafeAreaBox>
  );
};

export default ViewOnWebView;

export const pageStyles = StyleSheet.create({
  pageWrap: {
    paddingLeft: 0,
    paddingRight: 0,
    backgroundColor: defaultColors.bg1,
  },
  svgWrap: {
    marginRight: pTd(16),
  },
  contentWrap: {
    position: 'relative',
    flex: 1,
  },
  webViewContainer: {
    flex: 1,
    backgroundColor: 'red',
  },
  webView: {
    width: '100%',
    flex: 1,
  },
});
