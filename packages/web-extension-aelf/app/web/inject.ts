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
      });
    }
  }
}

new Inject();
