import React, { useCallback, useMemo, useState } from 'react';
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
import { MobileStream } from 'dapp/MobileStream';
import DappMobileOperator from 'dapp/dappMobileOperator';
import useHooksWillUnmount from 'hooks/useHooksWillUnmount';

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
  } = useRouterParams<{
    url: string;
    title?: string;
    webViewPageType?: WebViewPageType;
    injectedJavaScript?: string;
  }>();

  const dispatch = useAppCommonDispatch();
  const [webViewRef, setWebViewRef] = useState<WebView | null>(null);
  const stream: MobileStream | null = useMemo(() => (webViewRef ? new MobileStream(webViewRef) : null), [webViewRef]);
  const operator: DappMobileOperator | null = useMemo(() => (stream ? new DappMobileOperator(stream) : null), [stream]);
  const [entryScriptWeb3, setEntryScriptWeb3] = useState<string>();
  useHooksWillUnmount(() => operator?.onDestroy());

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
        ref={ref => ref && setWebViewRef(ref)}
        style={pageStyles.webView}
        source={{ uri: 'http://localhost:3000/' }}
        onNavigationStateChange={handleNavigationStateChange}
        injectedJavaScriptBeforeContentLoaded={entryScriptWeb3}
        onMessage={({ nativeEvent }) => {
          const data = JSON.parse(nativeEvent.data) as any;
          console.log(data, '=====data');
          operator && operator.handleRequestMessage(data);
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
