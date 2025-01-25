import React, { useCallback, useEffect } from 'react';
import SafeAreaBox from 'components/SafeAreaBox';
import { useTheme } from '@rneui/themed';
import { TextM } from 'components/CommonText';
import { ScrollView } from 'react-native';

import { useCurrentAccount, useCurrentWallet, useWalletListState } from '@portkey-wallet/hooks/hooks-eoa/wallet';
import { useCredentials } from '../../../hooks/store';

import { useBackupWalletModal } from '../../Login/hooks/useBackupWalletModal';
import * as Clipboard from 'expo-clipboard';
import { useGetContract, useGetViewContract } from 'hooks/contract';
import { useCurrentNetwork, useSwitchNetwork } from '@portkey-wallet/hooks/hooks-eoa/network';
import { useDAppChain, useDAppChainId, useGetChainInfo } from '@portkey-wallet/hooks/hooks-eoa/network/chain';
import CommonButton from 'components/CommonButton';
import navigationService from 'utils/navigationService';
import { useCheckSecurityLock } from 'hooks/securityLock';
import { useAppCommonDispatch, useAppEOASelector } from '@portkey-wallet/hooks';

import { resetWallet } from '@portkey-wallet/store/store-eoa/wallet/actions';

const HomeTab: React.FC<any> = ({ _ }) => {
  const a = useAppEOASelector(state => state);
  console.log('a=========', JSON.stringify(a));
  const { theme } = useTheme();
  const currentAccount = useCurrentAccount();
  const walletList = useWalletListState();
  const currentWallet = useCurrentWallet();
  const credentials = useCredentials();

  const dispatch = useAppCommonDispatch();
  const currentNetwork = useCurrentNetwork();
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
  // const dispatch = useAppCommonDispatch();

  const dAppChain = useDAppChain();
  const getContract = useGetContract();
  // const getTokenContract = useGetTokenContract();
  const sendElf = useCallback(async () => {
    if (!dAppChain) {
      return;
    }
    try {
      console.log('send ELF');
      // const contract = await getTokenContract(dAppChain.chainId);
      const contract = await getContract(dAppChain.chainId, dAppChain.defaultToken.address);
      const result = await contract.callSendMethod('Transfer', currentAccount?.address || '', {
        to: 'ELF_bPVEs5WFMMwiqPnaXiJpTmoR9xYVqBK2QDLZdA3HChqNebFQz_tDVW',
        symbol: 'ELF',
        amount: '10000000',
        memo: '',
      });
      console.log('result', result);
    } catch (error) {
      console.log('sendElf error', error);
    }
  }, [currentAccount?.address, dAppChain, getContract]);

  // const getTokenViewContract = useGetTokenViewContract();
  const getViewContract = useGetViewContract();

  const dAppChainId = useDAppChainId();
  const getChainInfo = useGetChainInfo();
  const getBalance = useCallback(async () => {
    try {
      // const viewContract = await getTokenViewContract('tDVW');

      const chainInfo = getChainInfo(dAppChainId);
      const viewContract = await getViewContract({
        chainId: 'tDVW',
        contractAddress: chainInfo?.defaultToken.address || '',
      });
      const result = await viewContract.callViewMethod('GetBalance', {
        symbol: 'ELF',
        owner: currentAccount?.address || '',
      });
      console.log('result', result);
    } catch (error) {
      console.log('getBalance error', error);
    }
  }, [currentAccount?.address, dAppChainId, getChainInfo, getViewContract]);

  const switchNetwork = useSwitchNetwork();
  const resetWalletClick = useCallback(async () => {
    try {
      dispatch(resetWallet());
      navigationService.reset('Referral');
    } catch (error) {
      console.log('checkPin error', error);
    }
  }, [dispatch]);
  const switchNetworkClick = useCallback(async () => {
    try {
      switchNetwork();
      // navigationService.reset('Referral');
    } catch (error) {
      console.log('checkPin error', error);
    }
  }, [switchNetwork]);
  useEffect(() => {
    if (walletList.length < 1) {
      navigationService.reset('Referral');
    }
  }, [walletList.length]);
  return (
    <SafeAreaBox edges={['top', 'right', 'left']} style={{ backgroundColor: theme.colors.bgBase1 }}>
      <ScrollView>
        <TextM>Home Tab</TextM>
        <TextM>{`Address: ${currentAccount?.address}`}</TextM>
        <TextM>{`Network: ${currentNetwork}`}</TextM>

        <CommonButton type="primary" onPress={() => Clipboard.setStringAsync(currentAccount?.address || '')}>
          Copy Address
        </CommonButton>

        <CommonButton type="primary" onPress={switchNetwork} style={{ marginTop: 20 }}>
          Switch Network
        </CommonButton>

        <CommonButton type="primary" onPress={() => navigationService.push('Home')} style={{ marginTop: 20 }}>
          Home
        </CommonButton>
        <CommonButton type="primary" onPress={() => navigationService.push('ImportWallet')} style={{ marginTop: 20 }}>
          Import Wallets
        </CommonButton>
        <CommonButton
          type="primary"
          onPress={() => navigationService.push('WalletImportTypeSelect')}
          style={{ marginTop: 20 }}>
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
          style={{ marginTop: 20 }}>
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
        <CommonButton type="primary" onPress={() => navigationService.push('Referral')} style={{ marginTop: 20 }}>
          Referral
        </CommonButton>
        <CommonButton type="primary" onPress={checkPin} style={{ marginTop: 20 }}>
          Check Pin
        </CommonButton>
        <CommonButton
          type="primary"
          onPress={() => {
            showBackupWalletModal();
          }}
          style={{ marginTop: 20 }}>
          Backup Modal
        </CommonButton>
        <CommonButton
          type="primary"
          onPress={() => {
            dispatch(resetWallet());
          }}>
          Reset wallet
        </CommonButton>
        <CommonButton type="primary" onPress={getBalance} style={{ marginTop: 20 }}>
          ELF Balance tDVW
        </CommonButton>
        <CommonButton type="primary" onPress={sendElf} style={{ marginTop: 20 }}>
          Send ELF
        </CommonButton>
        <CommonButton type="primary" onPress={resetWalletClick} style={{ marginTop: 20 }}>
          Reset Wallet
        </CommonButton>
        <CommonButton type="primary" onPress={switchNetworkClick} style={{ marginTop: 20 }}>
          Switch NetworkType (current: {currentNetwork})
        </CommonButton>

        <CommonButton type="primary" onPress={() => navigationService.push('SwapHome')} style={{ marginTop: 20 }}>
          Swap
        </CommonButton>
      </ScrollView>
    </SafeAreaBox>
  );
};

export default HomeTab;
