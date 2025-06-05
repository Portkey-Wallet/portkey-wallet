import { getLocalStorage, removeLocalStorage, setLocalStorage } from 'utils/storage/chromeStorage';
import { localStorage } from 'redux-persist-webextension-storage';

export const chromeStorage = {
  getItem: getLocalStorage,
  setItem: (key: string, item: string): Promise<void> => {
    return setLocalStorage({
      [key]: item,
    });
  },
  removeItem: removeLocalStorage,
};

export const encryptedStorage: typeof localStorage = {
  removeItem: localStorage.removeItem,
  getItem: localStorage.getItem,
  setItem: localStorage.setItem,
};
