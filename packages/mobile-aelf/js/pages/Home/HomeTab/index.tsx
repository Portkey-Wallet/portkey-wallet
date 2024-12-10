import React, { useEffect } from 'react';
import SafeAreaBox from 'components/SafeAreaBox';
import { useTheme } from '@rneui/themed';
import { TextM } from 'components/CommonText';
import { useCurrentAccount, useWalletListState } from '@portkey-wallet/hooks/hooks-eoa/wallet';
import CommonButton from 'components/CommonButton';
import navigationService from 'utils/navigationService';

const HomeTab: React.FC<any> = ({ _ }) => {
  const { theme } = useTheme();
  const currentAccount = useCurrentAccount();
  const walletList = useWalletListState();
  useEffect(() => {
    console.log('currentAccount', currentAccount);
    console.log('walletList', walletList);
  }, [currentAccount, walletList]);

  return (
    <SafeAreaBox edges={['top', 'right', 'left']} style={{ backgroundColor: theme.colors.bgBase1 }}>
      <TextM>Home Tab</TextM>
      <TextM>{`Address: ${currentAccount?.address}`}</TextM>
      <CommonButton type="primary" onPress={() => navigationService.push('Home')}>
        Home
      </CommonButton>
      <CommonButton type="primary" onPress={() => navigationService.push('ImportWallet')} style={{ marginTop: 40 }}>
        Import Wallet
      </CommonButton>
      <CommonButton type="primary" onPress={() => navigationService.push('ConfirmBackup')} style={{ marginTop: 40 }}>
        Confirm Backup
      </CommonButton>
    </SafeAreaBox>
  );
};

export default HomeTab;
