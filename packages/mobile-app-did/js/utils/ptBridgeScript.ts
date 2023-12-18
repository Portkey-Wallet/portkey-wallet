import RNFS from 'react-native-fs';
import { isIOS } from '@portkey-wallet/utils/mobile/device';

const fileName = 'ptBridge';

const PTBridgeScript = {
  entryScriptWeb3: '',
  // Cache ptBridge so that it is immediately available
  async init() {
    this.entryScriptWeb3 = isIOS
      ? await RNFS.readFile(`${RNFS.MainBundlePath}/${fileName}.js`, 'utf8')
      : await RNFS.readFileAssets(`${fileName}.js`);
    return this.entryScriptWeb3;
  },
  async get() {
    // Return from cache
    if (this.entryScriptWeb3) return this.entryScriptWeb3;

    // If for some reason it is not available, get it again
    return this.init();
  },
};

export default PTBridgeScript;
