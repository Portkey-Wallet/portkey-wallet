import React, { memo } from 'react';
import { View } from 'react-native';
import SwitchNetwork from '@portkey-wallet/rn-biz-components/biz-components/Login/components/SwitchNetwork';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from '@portkey-wallet/rn-base/store-sdk';
import CommonToast from '@portkey-wallet/rn-components/components/CommonToast';
import { ScreenHeight } from '@rneui/base';
import { changeNetworkType } from '@portkey-wallet/store/store-ca/wallet/actions';
// import { useCommon } from '.';
export const NETWORK_INIT_KEY = 'network_init_key';
function EndPointChange() {
  // const result = useCommon();
  // console.log('useCommon result is', result);
  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: ScreenHeight / 2 }}>
      <SwitchNetwork
        onPress={network => {
          console.log('store.getState().wallet.userInfo', store.getState().wallet.userInfo);
          if (store.getState().wallet.userInfo?.MAINNET) {
            CommonToast.fail('please exit wallet first');
            return;
          }
          store.dispatch(changeNetworkType(network.networkType));
          CommonToast.success('network switch successful, please restart app');
        }}
      />
    </View>
  );
}
export default memo(EndPointChange, () => true);
