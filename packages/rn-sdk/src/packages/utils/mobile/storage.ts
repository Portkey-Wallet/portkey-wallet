import { IStorage } from 'packages/types/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class BaseAsyncStorage implements IStorage {
  public async getItem(key: string) {
    return AsyncStorage.getItem(key);
  }
  public async setItem(key: string, value: string) {
    return AsyncStorage.setItem(key, value);
  }
  public async removeItem(key: string) {
    return AsyncStorage.removeItem(key);
  }
}

export const baseStore = new BaseAsyncStorage();
