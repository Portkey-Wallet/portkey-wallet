import WebView, { WebViewMessageEvent, WebViewProps } from 'react-native-webview';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { SUPPORTED_EC } from '../../constants/webview';
import { WebViewRequestTypes, BridgeActionTypes, RnResponseTypes } from './types/types';
import { injectJavaScript, formatJsCodeInjectedToWebView } from './injectToWebviewJs';
import { handleMessage, handleConnection, serializeResult } from './messages';
import { deserializeMessage, serializeMessage } from '../../utils/bridgeUtils';
import { ec } from 'elliptic';
import AElf from 'aelf-sdk';
import styles from './style/index.style';

let webRef: any;

interface CommonWebViewProps extends WebViewProps {
  width?: number;
  height?: number;
  wallet?: any;
  aelfInstance?: any;
}

const CommonWebView: React.FC<CommonWebViewProps> = props => {
  const {
    width = '100%',
    height = '100%',
    // source = { uri: 'http://192.168.10.160:3002' },
    source = { uri: 'http://192.168.66.186:3001' },
    // source = { uri: 'http://192.168.10.160:3000' },
    aelfInstance = new AElf(new AElf.providers.HttpProvider('http://192.168.66.251:8000')),
  } = props;

  const [, setAelf] = useState(null);
  const [, setCurrentEC] = useState<string>(SUPPORTED_EC[0]);
  const [, setCurrentAppId] = useState<string>('appId');
  const [keyPairs, setKeyPairs] = useState<ec.KeyPair>();
  const [dappKeyPairs, setDappKeyPairs] = useState<ec.KeyPair>();

  useEffect(() => {
    setAelf(aelfInstance);
  }, [aelfInstance]);

  // deal with Webview(dapp) message post
  const handleMessageEvent = async ({ nativeEvent }: WebViewMessageEvent) => {
    const { data } = nativeEvent;
    console.log(data, deserializeMessage(data), 'deserializeMessage');

    const messageObj: WebViewRequestTypes = deserializeMessage(data) as WebViewRequestTypes;
    if (!messageObj) {
      return;
    }
    console.log('data', messageObj);

    const { action, appId } = messageObj as WebViewRequestTypes;

    let result;
    let response;

    if (action === BridgeActionTypes.CONNECT) {
      result = handleConnection(messageObj, keyPairs);
      const { keyPair, dappKeyPair, encryptAlgorithm } = result;

      setCurrentAppId(appId);
      setCurrentEC(encryptAlgorithm);
      setKeyPairs(keyPair);
      setDappKeyPairs(dappKeyPair);

      response = await handleMessage(messageObj, keyPair, dappKeyPair, aelfInstance);
      sendMessageToWebView(serializeMessage(response));
    } else {
      // other fetch
      response = await handleMessage(messageObj, keyPairs as ec.KeyPair, dappKeyPairs as ec.KeyPair, aelfInstance);
      sendMessageToWebView(serializeMessage(serializeResult(response as RnResponseTypes, keyPairs as ec.KeyPair)));
    }
  };

  // when onload , overWrite the postMessage func of Webview(dapp)
  const overWriteFuncOfWebview = () => {
    if (!webRef) {
      throw Error('no WebViewRef');
    }
    webRef.injectJavaScript(injectJavaScript);
  };

  const sendMessageToWebView = (result: any) => {
    if (!webRef) {
      throw Error('no WebViewRef');
    }
    webRef.injectJavaScript(formatJsCodeInjectedToWebView(result));
  };
  console.log(styles.sectionContainer);
  return (
    <View style={styles.sectionContainer}>
      <WebView
        ref={ref => (webRef = ref)}
        source={source}
        onLoad={() => overWriteFuncOfWebview()}
        style={{ height: height, width: width }}
        onMessage={event => handleMessageEvent(event)}
        {...props}
      />
    </View>
  );
};

export default CommonWebView;
