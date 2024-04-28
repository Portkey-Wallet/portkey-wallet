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

// import Environment from '@portkey-wallet/rn-inject';
// 写法1
// let useCommon: () => string;
// if (Environment.isSDK()) {
//   useCommon = useSDK;
// } else {
//   useCommon = useApp;
// }

// 写法2
// function useCommon() {
//   return Environment.isSDK() ? useSDK() : useApp();
// }

//写法3
// function useCommon() {
//   const sdk = useSDK();
//   const app = useApp();
//   return Environment.isSDK() ? sdk : app;
// }
// export { useCommon };

// import { useNavigation as useAppNavigation } from '@react-navigation/native';
// import { useNavigation as useSDKNavigation } from '@portkey-wallet/rn-core/router/hook';

// function useNavigation() {
//   const sdkNavigation = useAppNavigation();
//   const appNavigation = useSDKNavigation();
//   return Environment.isSDK() ? sdkNavigation : appNavigation;
// }
// export { useNavigation };
