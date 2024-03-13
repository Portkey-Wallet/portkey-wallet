import { StorageModule, PortkeyModulesEntity } from 'service/native-modules';

export const GlobalStorage: StorageModule & {
  set: (key: string, value: string | number | boolean | null | undefined, allowSharpSymbol?: boolean) => void;
  remove: (key: string) => void;
} = Object.assign({}, PortkeyModulesEntity.StorageModule, {
  set(key: string, value: string | number | boolean | null | undefined, allowSharpSymbol = false) {
    !allowSharpSymbol && verifyStorageKey(key);
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
  remove(key: string) {
    GlobalStorage.setString(key, null);
  },
});

const verifyStorageKey = (key: string) => {
  if (key.includes('#')) {
    throw new Error('Internal Storage key should not contain sharp symbol since it will be erased');
  }
};

export const TempStorage = {
  wrapKey(key: string) {
    return `${key}#${PortkeyModulesEntity.NativeWrapperModule.tempStorageIdentifier}`;
  },
  remove(key: string) {
    GlobalStorage.remove(this.wrapKey(key));
  },
  set(key: string, value: any) {
    GlobalStorage.set(this.wrapKey(key), value, true);
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
