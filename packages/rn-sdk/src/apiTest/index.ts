import AsyncStorage from '@react-native-async-storage/async-storage';
import { changeNetworkType } from '@portkey-wallet/store/store-ca/wallet/actions';
import { store } from '@portkey-wallet/rn-base/store-sdk';
import { NetworkType } from '@portkey-wallet/types';
export enum PortkeyTestEntries {
  TEST = 'test',
  TEST_COMP = 'test_comp',
  ENDPOINT_CHANGE_ENTRY = 'endpoint_change_entry',
}
export async function loadCurrentNetwork() {
  const currentNetwork = await AsyncStorage.getItem('network_init_key');
  if (currentNetwork) {
    store.dispatch(changeNetworkType(currentNetwork as NetworkType));
  }
}
