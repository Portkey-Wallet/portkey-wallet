import { StorageModule, portkeyModulesEntity } from 'service/native-modules';

export const GlobalStorage: StorageModule & { set: (key: string, value: any) => void } = Object.assign(
  {},
  portkeyModulesEntity.StorageModule,
  {
    set(key: string, value: any) {
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
          GlobalStorage.setString(key, value);
        }
      }
    },
  },
);

export const TempStorage = {
  wrapKey(key: string) {
    console.log('wrapKey', key, portkeyModulesEntity.NativeWrapperModule.tempStorageIdentifier);
    return `${key}#${portkeyModulesEntity.NativeWrapperModule.tempStorageIdentifier}`;
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
