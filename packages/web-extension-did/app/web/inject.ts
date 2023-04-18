import EncryptedStream from './utils/EncryptedStream';
import IdGenerator from './utils/IdGenerator';
import * as PageContentTags from './messages/PageContentTags';
import PortKeyListener from 'utils/instantiate/PortKeyListener';
import PortKeyProvider from 'utils/instantiate/PortKeyProvider';

let stream: EncryptedStream;

export default class Inject {
  aesKey: string;
  listener: PortKeyListener;
  _state: {
    isConnected: boolean;
  };
  constructor() {
    this._state = {
      isConnected: false,
    };
    // Injecting an encrypted stream into the
    // web application.
    this.listener = new PortKeyListener();
    this.aesKey = IdGenerator.text(256);
    this.setupEncryptedStream();
  }

  setupEncryptedStream() {
    stream = new EncryptedStream(PageContentTags.PAGE_PORTKEY, this.aesKey);
    stream.setupEstablishEncryptedCommunication(PageContentTags.CONTENT_PORTKEY).then(() => {
      this.initPortKey();
      this._state.isConnected = true;
    });
    stream.sendPublicKey(PageContentTags.CONTENT_PORTKEY);
  }

  initPortKey() {
    const provider = new PortKeyProvider({ stream });
    const proxyProvider = new Proxy(provider, {
      deleteProperty: () => true,
    });
    setGlobalProvider(proxyProvider);
  }
}

new Inject();

/**
 * Sets the given provider instance as window.Portkey_did and dispatches the
 * 'Portkey_did#initialized' event on window.
 */
export function setGlobalProvider(providerInstance: PortKeyProvider): void {
  console.log('dispatchEvent', 'Portkey_did#initialized');
  (window as Record<string, any>).portkey_did = providerInstance;
  document.dispatchEvent(
    new CustomEvent('Portkey_did#initialized', {
      detail: {
        error: 0,
        message: 'Portkey_did is ready.',
      },
    }),
  );
}
