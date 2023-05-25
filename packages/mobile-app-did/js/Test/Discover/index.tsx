import React, { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import WebView from 'react-native-webview';
import CustomHeader from 'components/CustomHeader';
import SafeAreaBox from 'components/SafeAreaBox';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { pTd } from 'utils/unit';
import { useAppCommonDispatch } from '@portkey-wallet/hooks';
import { upDateRecordsItem } from '@portkey-wallet/store/store-ca/discover/slice';
import navigationService from 'utils/navigationService';
import { ACH_REDIRECT_URL } from 'constants/common';
import useEffectOnce from 'hooks/useEffectOnce';
import EntryScriptWeb3 from 'utils/EntryScriptWeb3';

const safeAreaColorMap = {
  white: defaultColors.bg1,
  blue: defaultColors.bg5,
  gray: defaultColors.bg4,
  transparent: 'transparent',
};

export type SafeAreaColorMapKeyUnit = keyof typeof safeAreaColorMap;

type WebViewPageType = 'default' | 'discover' | 'ach';
EntryScriptWeb3.init();
const Discover: React.FC = () => {
  const {
    title = '',
    url,
    webViewPageType = 'default',
    injectedJavaScript,
  } = useRouterParams<{
    url: string;
    title?: string;
    webViewPageType?: WebViewPageType;
    injectedJavaScript?: string;
  }>();

  const dispatch = useAppCommonDispatch();
  const webViewRef = React.useRef<WebView>(null);
  const [entryScriptWeb3, setEntryScriptWeb3] = useState<string>();

  useEffectOnce(() => {
    const getEntryScriptWeb3 = async () => {
      const script = await EntryScriptWeb3.get();
      setEntryScriptWeb3(script);
    };

    getEntryScriptWeb3();
  });
  const handleNavigationStateChange = useCallback(
    (navState: any) => {
      if (webViewPageType === 'default') return;
      if (webViewPageType === 'ach') {
        if (navState.url.startsWith(ACH_REDIRECT_URL)) {
          navigationService.navigate('Tab');
        }
        return;
      }
      dispatch(upDateRecordsItem({ url, title: title ? title : navState.title }));
    },
    [dispatch, title, url, webViewPageType],
  );
  return (
    <SafeAreaBox edges={['top', 'right', 'left']} style={[{ backgroundColor: safeAreaColorMap.blue }]}>
      <CustomHeader titleDom="Discover" leftCallback={navigationService.goBack} />
      <WebView
        ref={webViewRef}
        style={pageStyles.webView}
        source={{ uri: 'http://localhost:3000/' }}
        onNavigationStateChange={handleNavigationStateChange}
        injectedJavaScriptBeforeContentLoaded={entryScriptWeb3}
        onMessage={({ nativeEvent }) => {
          const data = JSON.parse(nativeEvent.data) as any;
          console.log(data, '=====data');

          const { eventName } = data || {};
          webViewRef.current?.postMessage(
            JSON.stringify({
              eventName,
              info: {
                code: 0,
                data: {
                  balance: 100,
                },
                msg: 'balance',
              },
            }),
          );
        }}
      />
    </SafeAreaBox>
  );
};

export default Discover;

export const pageStyles = StyleSheet.create({
  pageWrap: {
    paddingLeft: 0,
    paddingRight: 0,
    backgroundColor: defaultColors.bg1,
  },
  svgWrap: {
    marginRight: pTd(16),
  },
  webViewContainer: {
    flex: 1,
    backgroundColor: 'red',
  },
  webView: {
    width: '100%',
    flex: 1,
  },
  noResult: {},
});
