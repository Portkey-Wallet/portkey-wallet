import RNFS from 'react-native-fs';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
// import * as FileSystem from 'expo-file-system';

const fileName = 'InpageBridgeWeb3';

const EntryScriptWeb3 = {
  entryScriptWeb3: '',
  // Cache InpageBridgeWeb3 so that it is immediately available
  async init() {
    // const path = isIOS ? `${FileSystem.bundleDirectory}${fileName}.js` : `${FileSystem.bundledAssets}${fileName}.js`;
    // this.entryScriptWeb3 = await FileSystem.readAsStringAsync(path, { encoding: 'utf8' });

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

export default EntryScriptWeb3;
