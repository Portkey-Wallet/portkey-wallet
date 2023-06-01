import { InitializeProvider } from '@portkey/extension-provider';
import { shouldInjectProvider } from '@portkey/provider-utils';
import { PortkeyPostStream } from '@portkey/providers';
const INPAGE_TARGET = 'portkey-inpage';

export default class Inject {
  constructor() {
    this.initPortKey();
  }

  initPortKey() {
    if (shouldInjectProvider()) {
      const portkeyStream = new PortkeyPostStream({ name: INPAGE_TARGET, postWindow: window });
      new InitializeProvider({
        connectionStream: portkeyStream,
      });
    }
  }
}

new Inject();
