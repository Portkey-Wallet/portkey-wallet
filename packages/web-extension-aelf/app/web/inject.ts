import { InitializeProvider, InpagePostStream } from '@portkey/extension-provider';
import { shouldInjectProvider } from '@portkey/provider-utils';
const INPAGE_TARGET = 'portkey-inpage';

export default class Inject {
  constructor() {
    this.initPortKey();
  }

  initPortKey() {
    if (shouldInjectProvider()) {
      const portkeyStream = new InpagePostStream({
        name: INPAGE_TARGET,
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
