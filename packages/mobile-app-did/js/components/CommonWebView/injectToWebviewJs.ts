// when init , overwrite the possMessage func of WebView(dapp)
export const injectJavaScript = `
    const tmpFunction = window.postMessage;
    window.originalPostMessage = tmpFunction;
    window.postMessage = function(message){window.ReactNativeWebView.postMessage(message)};
`;

// format jscode injected to WebView that execute immediately
export const formatJsCodeInjectedToWebView = (message: string): string => {
  return String(`window.originalPostMessage('${message}','*')`);
};
