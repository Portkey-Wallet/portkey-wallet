import React, { useCallback } from 'react';
import PageContainer from 'components/PageContainer';
import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';

import { useDeviceList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import navigationService from 'utils/navigationService';
import MenuItem from '../components/MenuItem';
import { useCurrentDappList } from '@portkey-wallet/hooks/hooks-ca/dapp';
import { pTd } from 'utils/unit';
import { useFocusEffect } from '@react-navigation/native';

const WalletSecurity: React.FC = () => {
  const { deviceAmount, refresh } = useDeviceList({ isAmountOnly: true, isInit: false });
  const dappList = useCurrentDappList();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  return (
    <PageContainer
      titleDom={'Wallet Security'}
      safeAreaColor={['blue', 'gray']}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <MenuItem
        style={pageStyles.menuStyle}
        title="Login Devices"
        suffix={deviceAmount}
        onPress={() => {
          navigationService.navigate('DeviceList');
        }}
      />
      <MenuItem
        style={pageStyles.menuStyle}
        title="Connected Sites"
        suffix={dappList?.length ?? 0}
        onPress={() => {
          navigationService.navigate('DappList');
        }}
      />
      <MenuItem
        style={pageStyles.menuStyle}
        title="Payment Security"
        onPress={() => {
          navigationService.navigate('PaymentSecurityList');
        }}
      />
      <MenuItem
        style={pageStyles.menuStyle}
        title="Token Allowance"
        onPress={() => {
          navigationService.navigate('TokenAllowanceHome');
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
  menuStyle: {
    marginBottom: pTd(24),
  },
});

export default WalletSecurity;
