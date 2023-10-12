import { MMKV } from 'react-native-mmkv';
import { portkeyModulesEntity } from 'service/native-modules';

export const GlobalStorage = new MMKV({
  id: 'portkey-sdk',
});

export const TempStorage = {
  wrapKey(key: string) {
    return `${key}#${portkeyModulesEntity.NativeWrapperModule.tempStorageIdentifier}`;
  },
  set(key: string, value: any) {
    return GlobalStorage.set(this.wrapKey(key), value);
  },
  getString(key: string) {
    return GlobalStorage.getString(this.wrapKey(key));
  },
  getBool(key: string) {
    return GlobalStorage.getBoolean(this.wrapKey(key));
  },
  getNumber(key: string) {
    return GlobalStorage.getNumber(this.wrapKey(key));
  },
};
