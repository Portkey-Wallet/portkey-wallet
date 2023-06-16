import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import WebView from 'react-native-webview';
import CustomHeader from 'components/CustomHeader';
import SafeAreaBox from 'components/SafeAreaBox';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { pTd } from 'utils/unit';
import navigationService from 'utils/navigationService';
import { ACH_REDIRECT_URL, ACH_WITHDRAW_URL } from 'constants/common';
import { useHandleAchSell } from './hooks/useHandleAchSell';
import CommonToast from 'components/CommonToast';
import Progressbar, { IProgressbar } from 'components/Progressbar';

const safeAreaColorMap = {
  white: defaultColors.bg1,
  blue: defaultColors.bg5,
  gray: defaultColors.bg4,
  transparent: 'transparent',
};

export type SafeAreaColorMapKeyUnit = keyof typeof safeAreaColorMap;

type WebViewPageType = 'default' | 'ach' | 'achSell';

export interface AchSellParams {
  orderNo?: string;
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

  const [browserInfo] = useState({ url, title });

  const webViewRef = React.useRef<WebView>(null);
  const progressBarRef = React.useRef<IProgressbar>(null);

  const handleAchSell = useHandleAchSell();
  const isAchSellHandled = useRef(false);

  const handleNavigationStateChange = useCallback(
    (navState: any) => {
      if (webViewPageType === 'default') return;
      if (webViewPageType === 'ach') {
        if (navState.url.startsWith(ACH_REDIRECT_URL)) {
          navigationService.navigate('Tab');
        }
        return;
      }
      if (webViewPageType === 'achSell') {
        if (navState.url.startsWith(ACH_WITHDRAW_URL) && !isAchSellHandled.current) {
          isAchSellHandled.current = true;
          navigationService.navigate('Tab');
          const { orderNo } = (params as AchSellParams) || {};
          if (!orderNo) {
            CommonToast.failError('Transaction failed.');
            return;
          }
          handleAchSell(orderNo);
        }
      }
    },
    [handleAchSell, params, webViewPageType],
  );

  return (
    <SafeAreaBox edges={['top', 'right', 'left']} style={[{ backgroundColor: safeAreaColorMap.blue }]}>
      <CustomHeader themeType={'blue'} titleDom={browserInfo?.title} />
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
