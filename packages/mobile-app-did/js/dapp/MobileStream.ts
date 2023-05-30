import { DappInteractionStream } from '@portkey/providers';
import WebView from 'react-native-webview';
export class MobileStream extends DappInteractionStream {
  private _webViewRef: WebView;
  public constructor(webViewRef: WebView) {
    super();
    this._webViewRef = webViewRef;
  }

  public _write(
    chunk: ArrayBuffer,
    _encoding: BufferEncoding,
    _callback: (error?: Error | null | undefined) => void,
  ): void {
    const text = new TextDecoder().decode(chunk);
    if (__DEV__) {
      console.log('MobileStream _write', text);
    }
    this._webViewRef.postMessage(text);
  }
}
