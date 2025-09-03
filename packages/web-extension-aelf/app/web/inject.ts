import { InitializeProvider, InpagePostStream } from '@portkey/extension-provider';
import { shouldInjectProvider } from '@portkey/provider-utils';
const INPAGE_TARGET = 'fairy-vault-inpage';

export default class Inject {
  constructor() {
    this.initPortKey();
  }

  initPortKey() {
    if (shouldInjectProvider()) {
      const portkeyStream = new InpagePostStream({
        name: INPAGE_TARGET,
        listenerEventName: 'fairy-vault-message-from-content-v2',
        dispatchEventName: 'fairy-vault-message-from-inpage-v2',
      });
      new InitializeProvider({
        connectionStream: portkeyStream,
        options: {
          initKey: 'FairyVault',
          initMessage: 'FairyVault is ready.',
        },
      });
    }
  }
}

new Inject();
