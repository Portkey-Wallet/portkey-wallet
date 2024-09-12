import React, { useCallback, useEffect } from 'react';
import PageContainer from 'components/PageContainer';
import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';

import { useDeviceList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useIsSecondaryMailSet } from '@portkey-wallet/hooks/hooks-ca/useSecondaryMail';
import navigationService from 'utils/navigationService';
import MenuItem from '../components/MenuItem';
import { useCurrentDappList } from '@portkey-wallet/hooks/hooks-ca/dapp';
import { pTd } from 'utils/unit';
import { useFocusEffect } from '@react-navigation/native';
import useEffectOnce from 'hooks/useEffectOnce';
import myEvents from 'utils/deviceEvent';

const WalletSecurity: React.FC = () => {
  const { deviceAmount, refresh } = useDeviceList({ isAmountOnly: true, isInit: false });
  const dappList = useCurrentDappList();
  const { showNotSet, secondaryEmail, getSecondaryMail, hideNotSetMark, fetching } = useIsSecondaryMailSet();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );
  useEffectOnce(() => {
    myEvents.updateSecondaryEmail.addListener(data => {
      hideNotSetMark(data?.email || '');
      getSecondaryMail();
    });
  });
  return (
    <PageContainer
      titleDom={'Wallet Security'}
      safeAreaColor={['white', 'gray']}
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
      <MenuItem
        style={pageStyles.menuStyle}
        title="Set up Backup Mailbox"
        suffix={!fetching && showNotSet ? 'Not Set up' : ''}
        onPress={async () => {
          navigationService.navigate('SecondaryMailboxHome', {
            secondaryEmail,
          });
          // if (!secondaryEmail) {
          //   try {
          //     Loading.show();
          //     const res = await getSecondaryMail();
          //     if (!res) {
          //       CommonToast.fail('fetch secondaryEmail failed!');
          //       return;
          //     }
          //     navigationService.navigate('SecondaryMailboxHome', {
          //       secondaryEmail: res,
          //     });
          //   } finally {
          //     Loading.hide();
          //   }
          // } else {
          //   navigationService.navigate('SecondaryMailboxHome', {
          //     secondaryEmail,
          //   });
          // }
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
