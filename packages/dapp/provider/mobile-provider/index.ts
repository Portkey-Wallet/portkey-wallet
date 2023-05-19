import BaseChain from '../../chain/BaseChain';
import { MobileProvider, MobileWebStream } from './MobileProvider';
import { window } from '../../model/base/Window';

/**
 * @warn DO NOT EXPORT ANYTHING FROM THIS FILE
 * @warn THIS WILL MAKE init() EXECTUED UNEXCEPTEDLY
 */
const init = () => {
  if (window) {
    window.portkey = new MobileProvider({
      stream: new MobileWebStream(),
      chainFactory: ({ provider }) => {
        return new BaseChain({ provider });
      },
    });
  }
};

init();
