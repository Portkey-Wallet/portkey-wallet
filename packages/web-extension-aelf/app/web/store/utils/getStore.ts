import { store } from 'store/Provider/store';

// const walletMap: { [address: string]: AElfWallet } = {};
export const getStoreState = () => {
  return store.getState();
};
