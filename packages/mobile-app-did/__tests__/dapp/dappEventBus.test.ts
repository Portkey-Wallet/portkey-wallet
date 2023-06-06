import { IResponseType, NotificationEvents } from '@portkey/provider-types';
import { DappInteractionStream } from '@portkey/providers';
import DappEventBus from 'dapp/dappEventBus';
import { DappMobileManager } from 'dapp/dappManager';
import DappMobileOperator from 'dapp/dappMobileOperator';
import { DappOverlay } from 'dapp/dappOverlay';
import { store } from 'store';
class TestOperatorStream extends DappInteractionStream {
  private messageCallback;
  constructor(callback: (message: IResponseType) => void) {
    super();
    this.messageCallback = callback;
  }

  public _write = (
    chunk: ArrayBuffer,
    _encoding: BufferEncoding,
    _callback: (error?: Error | null | undefined) => void,
  ) => {
    this.messageCallback(JSON.parse(chunk.toString()));
  };
}

describe('DappEventBus', () => {
  test('work well', done => {
    const callback = (response: IResponseType) => {
      expect(response.eventName).toBe(NotificationEvents.CONNECTED);
      done();
    };
    const operator = new DappMobileOperator({
      stream: new TestOperatorStream(callback),
      origin: 'test',
      dappOverlay: new DappOverlay(),
      dappManager: new DappMobileManager({ store: store as any }),
    });
    console.log(`operator.origin: ${operator.dapp.origin}`);
    DappEventBus.dispatchEvent({ eventName: NotificationEvents.CONNECTED });
  });
  test('unregister successfully', done => {
    const callback = () => {
      done('should not be called');
    };
    const operator = new DappMobileOperator({
      stream: new TestOperatorStream(callback),
      origin: 'test',
      dappOverlay: new DappOverlay(),
      dappManager: new DappMobileManager({ store: store as any }),
    });
    console.log(`operator.origin: ${operator.dapp.origin}`);
    operator.onDestroy();
    DappEventBus.dispatchEvent({ eventName: NotificationEvents.CONNECTED });
  });
});
