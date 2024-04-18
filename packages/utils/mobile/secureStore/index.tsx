import * as SecureStore from 'expo-secure-store';
import aes from '@portkey-wallet/utils/aes';
const privates = new WeakMap();
const secureOptions = {
  requireAuthentication: true,
  authenticationPrompt: 'Authenticate to Verify Your Identity',
};
export const SecureKeys = ['Password', 'Pin'] as const;
let instance: SecureKeyChain | undefined;

class SecureKeyChain {
  static instance: SecureKeyChain;
  isAuthenticating: boolean | undefined;

  constructor(code: string) {
    if (!SecureKeyChain.instance) {
      privates.set(this, { code });
      SecureKeyChain.instance = this;
    }
    return SecureKeyChain.instance;
  }

  encryptStr(str: string): string {
    return aes.encrypt(str, privates.get(this).code);
  }

  decryptStr(str: string): string | false {
    return aes.decrypt(str, privates.get(this).code);
  }
}
export default {
  init(salt: string) {
    instance = new SecureKeyChain(salt);
    Object.freeze(instance);
    return instance;
  },
  encryptStr(str: string) {
    return instance?.encryptStr(str);
  },
  decryptStr(str: string) {
    return instance?.decryptStr(str);
  },
  getInstance() {
    return instance;
  },
  async getItemAsync(key: typeof SecureKeys[number]) {
    console.log('instance', instance);
    if (instance) {
      console.log('instance.isAuthenticating', instance.isAuthenticating);
      instance.isAuthenticating = true;
      const item = await SecureStore.getItemAsync(key, secureOptions);
      console.log('instance.isAuthenticating item', item, 'key', key);
      if (item) {
        return instance.decryptStr(item);
      }
      instance.isAuthenticating = false;
    }
    return null;
  },
  async setItemAsync(key: typeof SecureKeys[number], value: string) {
    if (instance) {
      // https://github.com/alephium/mobile-wallet/issues/33
      // fix Could not decrypt the item in SecureStore
      await SecureStore.setItemAsync('test', 'test');
      await SecureStore.deleteItemAsync(key);
      await SecureStore.setItemAsync(key, instance.encryptStr(value), secureOptions);
      return true;
    }
    return null;
  },
};
