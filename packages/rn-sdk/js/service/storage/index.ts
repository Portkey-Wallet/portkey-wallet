import { StorageModule, PortkeyModulesEntity } from 'service/native-modules';

export const GlobalStorage: StorageModule & {
  set: (key: string, value: string | number | boolean | null | undefined) => void;
} = Object.assign({}, PortkeyModulesEntity.StorageModule, {
  set(key: string, value: string | number | boolean | null | undefined) {
    switch (typeof value) {
      case 'boolean': {
        GlobalStorage.setBoolean(key, value);
        break;
      }
      case 'number': {
        GlobalStorage.setNumber(key, value);
        break;
      }
      case 'string':
      default: {
        GlobalStorage.setString(key, value ?? null);
      }
    }
  },
});

export const TempStorage = {
  wrapKey(key: string) {
    return `${key}#${PortkeyModulesEntity.NativeWrapperModule.tempStorageIdentifier}`;
  },
  set(key: string, value: any) {
    GlobalStorage.set(this.wrapKey(key), value);
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
