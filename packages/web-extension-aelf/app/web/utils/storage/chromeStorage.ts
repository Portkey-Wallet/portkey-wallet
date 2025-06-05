import { apis } from 'utils/BrowserApis';
import storage, { StorageKeyType } from './storage';

function rejectError(reject: (reason?: any) => void) {
  const { lastError } = apis.runtime;
  if (lastError) return reject(lastError.message);
}

function getAllStorageSyncData() {
  return new Promise((resolve, reject) => {
    apis.storage.sync.get(null, (items) => {
      rejectError(reject);
      resolve(items);
    });
  });
}

function getAllStorageLocalData(): Promise<any> {
  return new Promise((resolve, reject) => {
    apis.storage.local.get(null, (items) => {
      rejectError(reject);
      resolve(items);
    });
  });
}

function getLocalStorage<T = any>(str: StorageKeyType): Promise<T> {
  return new Promise((resolve, reject) => {
    const key = storage[str] ? storage[str] : str;
    apis.storage.local.get([key], (result) => {
      rejectError(reject);
      resolve(result?.[key]);
    });
  });
}

function setLocalStorage(_data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    if (!_data || typeof _data !== 'object') throw Error('typeError');
    let storageData = {};
    for (const _key in _data) {
      const key = _key as StorageKeyType;
      if (storage[key]) {
        storageData = { ...storageData, [storage[key]]: _data[key] };
        continue;
      }
      storageData = { ...storageData, [key]: _data[key] };
    }
    apis.storage.local.set(storageData, () => {
      rejectError(reject);
      resolve(true);
    });
  });
}

function removeLocalStorage(key: string | string[]) {
  return new Promise((resolve, reject) => {
    apis.storage.local.remove(key, () => {
      rejectError(reject);
      resolve(true);
    });
  });
}

function clearLocalStorage() {
  return new Promise((resolve, reject) => {
    apis.storage.local.clear(() => {
      rejectError(reject);
      resolve(true);
    });
  });
}

export {
  getAllStorageLocalData,
  getAllStorageSyncData,
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
  clearLocalStorage,
};
