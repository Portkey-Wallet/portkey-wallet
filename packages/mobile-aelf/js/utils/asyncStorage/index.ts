import AsyncStorage from '@react-native-async-storage/async-storage';
import { ILocalStorage } from './type';

export type TStorageKey = keyof ILocalStorage;
export type TStoreData = string | TStoreObjectData;
export type TStoreObjectData = {
  [key: string]: any;
};

export const storeStorageData = async (storage_Key: TStorageKey, value: TStoreData) => {
  if (typeof value === 'string') {
    return storeStringData(storage_Key, value);
  }
  return storeObjectData(storage_Key, value);
};

const storeObjectData = async (storage_Key: TStorageKey, value: TStoreObjectData) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(storage_Key, jsonValue);
    return true;
  } catch (e) {
    // TODO: Upload error log to firebase or your own log server.
    // saving error
  }
};
const storeStringData = async (storage_Key: TStorageKey, value: string) => {
  try {
    await AsyncStorage.setItem(storage_Key, value);
    return true;
  } catch (e) {
    // TODO: Upload error log to firebase or your own log server.
    // saving error
  }
};

export const getStorageData = async (storage_Key: TStorageKey) => {
  try {
    const value = await AsyncStorage.getItem(storage_Key);
    if (value !== null) {
      // value previously stored
      return value;
    }
  } catch (e) {
    // TODO: Upload error log to firebase or your own log server.
    // error reading value
  }
};
