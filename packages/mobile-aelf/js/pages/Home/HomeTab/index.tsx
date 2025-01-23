import React, { useCallback, useEffect } from 'react';
import SafeAreaBox from 'components/SafeAreaBox';
import { useTheme } from '@rneui/themed';
import { TextM } from 'components/CommonText';
import { ScrollView } from 'react-native';
import { useCurrentAccount, useCurrentWallet, useWalletListState } from '@portkey-wallet/hooks/hooks-eoa/wallet';
import CommonButton from 'components/CommonButton';
import navigationService from 'utils/navigationService';
import { useCheckSecurityLock } from 'hooks/securityLock';
import { useBackupWalletModal } from '../../Login/hooks/useBackupWalletModal';
import { useCredentials } from '../../../hooks/store';

const HomeTab: React.FC<any> = ({ _ }) => {
  const { theme } = useTheme();
  const currentAccount = useCurrentAccount();
  const walletList = useWalletListState();
  const currentWallet = useCurrentWallet();
  const credentials = useCredentials();

  useEffect(() => {
    console.log('currentAccount', currentAccount);
    console.log('walletList', walletList);
    console.log('currentWallet', currentWallet);
  }, [currentAccount, walletList, currentWallet]);

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
        <CommonButton
          type="primary"
          onPress={() =>
            navigationService.push('ConfirmBackup', {
              mnemonics: [
                'seed',
                'sock',
                'milk',
                'update',
                'focus',
                'rotate',
                'barely',
                'fade',
                'car',
                'face',
                'mechanic',
                'mercy',
              ],
            })
          }
          style={{ marginTop: 40 }}>
          Confirm Backup
        </CommonButton>
        <CommonButton
          type="primary"
          onPress={() => navigationService.push('ManualBackupSuccess')}
          style={{ marginTop: 40 }}>
          Confirm Backup Success
        </CommonButton>
        <CommonButton
          type="primary"
          onPress={() =>
            navigationService.push('ManualBackup', {
              pin: credentials?.pin,
            })
          }
          style={{ marginTop: 40 }}>
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
