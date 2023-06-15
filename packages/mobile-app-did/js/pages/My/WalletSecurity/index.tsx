import React from 'react';
import PageContainer from 'components/PageContainer';
import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';

import { useDeviceList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import navigationService from 'utils/navigationService';
import MenuItem from '../components/MenuItem';
import { useCurrentDappList } from '@portkey-wallet/hooks/hooks-ca/dapp';

const WalletSecurity: React.FC = () => {
  const { deviceAmount } = useDeviceList();
  const dappList = useCurrentDappList();

  return (
    <PageContainer
      titleDom={'Wallet Security'}
      safeAreaColor={['blue', 'gray']}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <MenuItem
        title="Login Devices"
        suffix={deviceAmount}
        onPress={() => {
          navigationService.navigate('DeviceList');
        }}
      />
      <MenuItem
        title="Connected Sites"
        suffix={dappList?.length ?? 0}
        onPress={() => {
          navigationService.navigate('ConnectedSites');
        }}
      />
    </PageContainer>
  );
};

const pageStyles = StyleSheet.create({
  pageWrap: {
    flex: 1,
    backgroundColor: defaultColors.bg4,
    ...GStyles.paddingArg(24, 20, 18),
  },
});

export default WalletSecurity;
