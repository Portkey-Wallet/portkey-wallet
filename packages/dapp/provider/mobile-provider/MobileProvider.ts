import { DappRequestWrapper } from '../../model/base/Request';
import DappInteractionStream from '../../model/base/DappStream';
import { window } from '../../model/base/Window';
import Web3Provider from '../../operator/Web3Provider';

export class MobileProvider extends Web3Provider {}

export class MobileWebStream extends DappInteractionStream {
  constructor() {
    super();
  }

  /**
   * @override ```DappInteractionStream._write()```
   */
  _write(
    chunk: DappRequestWrapper,
    encoding: BufferEncoding,
    callback: (error?: Error | null | undefined) => void,
  ): void {
    window.ReactNativeWebView.postMessage(chunk);
    callback();
  }
}
