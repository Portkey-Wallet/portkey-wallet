import { store as appStore } from '../store-app';
import { store as sdkStore } from '../store-sdk';
import sdkResetStore from '../store-sdk/resetStore';
import Environment from '@portkey-wallet/rn-inject';
let store: any;
let resetStore: any;
if (Environment.isSDK()) {
  store = sdkStore;
  resetStore = sdkResetStore;
} else {
  store = appStore;
}
export { store, resetStore };
