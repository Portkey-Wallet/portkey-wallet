import { Duplex } from 'stream';
import { DappRequestWrapper } from './Request';
export default abstract class DappInteractionStream extends Duplex {
  constructor() {
    super();
  }

  createSubStream = (name: String) => {};
  /**
   * this method is abstract, so it must be implemented by the subclass.
   * @example in React Native, you can override this method like this:
   * ```
   * _write=(chunk,encoding,callback)=>{
   *  window.ReactNativeWebView.postMessage(chunk);
   * callback();
   * }
   * ```
   */
  abstract _write(
    chunk: DappRequestWrapper,
    encoding: BufferEncoding,
    callback: (error?: Error | null | undefined) => void,
  ): void;
}

/**
 * Use SubStream to create a new Stream port used for other perpose.
 * For example, you can create a SubStream to deal with RPC connection, and an error won't make the parent stream crash.
 */
export class SubStream extends Duplex {
  constructor(private parentStream: Duplex, public name: string) {
    super();
  }
  _read(_size: number): void {}
  _write(chunk: any, encoding: BufferEncoding, callback: (error?: Error | null | undefined) => void): void {
    this.parentStream?.push({ chunk: Object.assign({}, chunk, { name: this.name }), encoding });
    callback();
  }
}

export interface StreamData {
  name: string;
  chunk: any;
}
