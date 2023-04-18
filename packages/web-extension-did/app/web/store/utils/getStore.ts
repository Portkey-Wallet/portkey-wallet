import { store } from 'store/Provider/store';

export const getStoreState = () => {
  return store.getState();
};
