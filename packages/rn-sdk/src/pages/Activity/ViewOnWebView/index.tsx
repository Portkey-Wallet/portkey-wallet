import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import WebView from 'react-native-webview';
import CustomHeader from 'components/CustomHeader';
import SafeAreaBox from 'components/SafeAreaBox';
import { pTd } from 'utils/unit';
import CommonToast from 'components/CommonToast';
import Progressbar, { IProgressbar } from 'components/Progressbar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import GStyles from 'assets/theme/GStyles';
import { RAMP_BUY_URL, RAMP_SELL_URL } from 'pages/Ramp/constants';
import useBaseContainer from 'model/container/UseBaseContainer';
import { PortkeyEntries } from 'config/entries';
import { useHandleRampSell } from './hooks/useHandleRampSell';
import { GuardiansApprovedType } from 'types/guardians';

const safeAreaColorMap = {
  white: defaultColors.bg1,
  blue: defaultColors.bg5,
  gray: defaultColors.bg4,
  transparent: 'transparent',
};

export type SafeAreaColorMapKeyUnit = keyof typeof safeAreaColorMap;

type WebViewPageType = 'default' | 'ramp-buy' | 'ramp-sell';

export interface AchSellParams {
  orderNo?: string;
}

export interface ViewOnWebViewProps {
  url: string;
  title?: string;
  webViewPageType?: WebViewPageType;
  injectedJavaScript?: string;
  params?: any;
}
export interface RampSellParams {
  orderId?: string;
  guardiansApproved?: GuardiansApprovedType[];
}
const ViewOnWebView = ({
  title = '',
  url,
  webViewPageType = 'default',
  injectedJavaScript,
  params,
}: ViewOnWebViewProps) => {
  const [browserInfo] = useState({ url, title });
  const { navigateTo } = useBaseContainer({ entryName: PortkeyEntries.VIEW_ON_WEBVIEW });
  const webViewRef = React.useRef<WebView>(null);
  const progressBarRef = React.useRef<IProgressbar>(null);

  const handleRampSell = useHandleRampSell();
  const isAchSellHandled = useRef(false);

  const handleNavigationStateChange = useCallback(
    (navState: any) => {
      console.log('webViewPageType', webViewPageType);
      console.log('navState');
      console.log(JSON.stringify(navState));
      if (webViewPageType === 'default') return;
      if (webViewPageType === 'ramp-buy') {
        if (navState.url.startsWith(RAMP_BUY_URL)) {
          navigateTo(PortkeyEntries.RAMP_HOME_ENTRY);
        }
        return;
      }
      if (webViewPageType === 'ramp-sell') {
        if (navState.url.startsWith(RAMP_SELL_URL) && !isAchSellHandled.current) {
          isAchSellHandled.current = true;
          navigateTo(PortkeyEntries.RAMP_HOME_ENTRY);
          const { orderId, guardiansApproved } = (params as RampSellParams) || {};
          if (!orderId) {
            CommonToast.failError('Transaction failed.');
            return;
          }
          handleRampSell(orderId, guardiansApproved);
        }
      }
    },
    [handleRampSell, navigateTo, params, webViewPageType],
  );

  return (
    <SafeAreaProvider style={GStyles.whiteBackgroundColor}>
      <SafeAreaBox edges={['top', 'right', 'left']} style={[{ backgroundColor: safeAreaColorMap.blue }]}>
        {<CustomHeader themeType={'blue'} titleDom={browserInfo?.title} />}
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
    </SafeAreaProvider>
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
