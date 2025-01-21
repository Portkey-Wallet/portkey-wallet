import React, { useCallback, useEffect } from 'react';
import SafeAreaBox from 'components/SafeAreaBox';
import { useTheme } from '@rneui/themed';
import { TextM } from 'components/CommonText';
import { ScrollView } from 'react-native';
import { useCurrentAccount, useWalletListState } from '@portkey-wallet/hooks/hooks-eoa/wallet';
import CommonButton from 'components/CommonButton';
import navigationService from 'utils/navigationService';
import { useCheckSecurityLock } from 'hooks/securityLock';
import { useBackupWalletModal } from '../../Login/hooks/useBackupWalletModal';

const HomeTab: React.FC<any> = ({ _ }) => {
  const { theme } = useTheme();
  const currentAccount = useCurrentAccount();
  const walletList = useWalletListState();
  useEffect(() => {
    console.log('currentAccount', currentAccount);
    console.log('walletList', walletList);
  }, [currentAccount, walletList]);

  const checkSecurityLock = useCheckSecurityLock();
  const checkPin = useCallback(async () => {
    try {
      await checkSecurityLock(() => {
        navigationService.reset('Tab');
        console.log('check success');
      });
    } catch (error) {
      console.log('checkPin error', error);
    }
  }, [checkSecurityLock]);

  const { showBackupWalletModal } = useBackupWalletModal();

  return (
    <SafeAreaBox edges={['top', 'right', 'left']} style={{ backgroundColor: theme.colors.bgBase1 }}>
      <ScrollView>
        <TextM>Home Tab</TextM>
        <TextM>{`Address: ${currentAccount?.address}`}</TextM>
        <CommonButton type="primary" onPress={() => navigationService.push('Home')}>
          Home
        </CommonButton>
        <CommonButton type="primary" onPress={() => navigationService.push('ImportWallet')} style={{ marginTop: 40 }}>
          Import Wallets
        </CommonButton>
        <CommonButton
          type="primary"
          onPress={() => navigationService.push('WalletImportTypeSelect')}
          style={{ marginTop: 40 }}>
          WalletImportTypeSelect
        </CommonButton>
        <CommonButton type="primary" onPress={() => navigationService.push('ConfirmBackup')} style={{ marginTop: 40 }}>
          Confirm Backup
        </CommonButton>
        <CommonButton
          type="primary"
          onPress={() => navigationService.push('ManualBackupSuccess')}
          style={{ marginTop: 40 }}>
          Confirm Backup Success
        </CommonButton>
        <CommonButton type="primary" onPress={() => navigationService.push('ManualBackup')} style={{ marginTop: 40 }}>
          Manual Backup
        </CommonButton>
        <CommonButton type="primary" onPress={() => navigationService.push('Referral')} style={{ marginTop: 40 }}>
          Referral
        </CommonButton>
        <CommonButton type="primary" onPress={checkPin} style={{ marginTop: 40 }}>
          Check Pin
        </CommonButton>
        <CommonButton
          type="primary"
          onPress={() => {
            showBackupWalletModal();
          }}
          style={{ marginTop: 40 }}>
          Backup Modal
        </CommonButton>
      </ScrollView>
    </SafeAreaBox>
  );
};

export default HomeTab;
