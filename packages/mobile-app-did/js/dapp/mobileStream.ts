import { DappInteractionStream } from '@portkey/providers';
import type WebView from 'react-native-webview';
export class MobileStream extends DappInteractionStream {
  private _webViewRef?: WebView;
  public constructor(webViewRef: WebView) {
    super();
    this._webViewRef = webViewRef;
  }

  public _write(chunk: any, _encoding: BufferEncoding, callback: (error?: Error | null | undefined) => void): void {
    const text = chunk.toString();
    if (__DEV__) {
      console.log('MobileStream _write', text);
    }
    this._webViewRef?.postMessage(text);
    callback();
  }
}
