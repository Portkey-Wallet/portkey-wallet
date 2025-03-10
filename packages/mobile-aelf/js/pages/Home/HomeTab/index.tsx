import React, { useCallback, useEffect } from 'react';
import SafeAreaBox from 'components/SafeAreaBox';
import { useTheme } from '@rneui/themed';
import { TextM } from 'components/CommonText';
import { ScrollView } from 'react-native';

import { useCurrentAccount, useCurrentWallet, useWalletListState } from '@portkey-wallet/hooks/hooks-eoa/wallet';
import { useCredentials, usePin } from '../../../hooks/store';

import { useBackupWalletModal } from '../../Login/hooks/useBackupWalletModal';
import * as Clipboard from 'expo-clipboard';
import { useGetContract, useGetTokenContract, useGetViewContract } from 'hooks/contract';
import { useCurrentNetwork } from '@portkey-wallet/hooks/hooks-eoa/network';
import {
  useDAppChain,
  useDAppChainId,
  useGetChainInfo,
  useMainChain,
} from '@portkey-wallet/hooks/hooks-eoa/network/chain';
import CommonButton from 'components/CommonButton';
import navigationService from 'utils/navigationService';
import { useCheckSecurityLock } from 'hooks/securityLock';
import { useAppCommonDispatch } from '@portkey-wallet/hooks';

import { resetWallet } from '@portkey-wallet/store/store-eoa/wallet/actions';
import { resetDiscover } from '@portkey-wallet/store/store-eoa/discover/slice';
import { useAddressSelect } from '../../My/WalletManagement/hooks/useAddressSelect';
import { IToSendHomeParamsType } from '@portkey-wallet/types/types-ca/routeParams';
import { useCrossTransferByEtransfer } from '@portkey-wallet/hooks/hooks-eoa/useWithdrawByETransfer';
import useGetEBridgeConfig from 'hooks/ebridge';
import { EBridge } from '@portkey-wallet/utils/eBridgeEOA';
import { getManagerAccount } from 'utils/redux';
import GoogleTest from '../../../Test/GoogleTest/index.android';
import { SetBiometricsTypeEnum } from '../../Pin/SetBiometrics';

const HomeTab: React.FC<any> = ({ _ }) => {
  // const a = useAppEOASelector(state => state);
  const { theme } = useTheme();
  const currentAccount = useCurrentAccount();
  const walletList = useWalletListState();
  const currentWallet = useCurrentWallet();
  const credentials = useCredentials();
  const pin = usePin();

  const { withdraw, withdrawPreview } = useCrossTransferByEtransfer(pin);

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
  const mainChain = useMainChain();
  const getContract = useGetContract();
  const getTokenContract = useGetTokenContract();
  const sendElf = useCallback(async () => {
    if (!dAppChain || !mainChain) {
      return;
    }
    try {
      console.log('send ELF');
      // const contract = await getTokenContract(dAppChain.chainId);
      const contract = await getContract(mainChain.chainId, mainChain.defaultToken.address);

      const fee = await contract.calculateTransactionFee('Transfer', {
        to: 'bPVEs5WFMMwiqPnaXiJpTmoR9xYVqBK2QDLZdA3HChqNebFQz',
        symbol: 'ELF',
        amount: '10000000',
        memo: '',
      });

      console.log('fee====', fee);

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
  }, [currentAccount?.address, dAppChain, getContract, mainChain]);

  // const getTokenViewContract = useGetTokenViewContract();
  const getViewContract = useGetViewContract();

  const dAppChainId = useDAppChainId();
  const getChainInfo = useGetChainInfo();
  const getELFBalance = useCallback(async () => {
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
      console.log('result tDVW', result);

      const _chainInfo = getChainInfo('AELF');
      const _viewContract = await getViewContract({
        chainId: 'AELF',
        contractAddress: _chainInfo?.defaultToken.address || '',
      });
      const _result = await _viewContract.callViewMethod('GetBalance', {
        symbol: 'ELF',
        owner: currentAccount?.address || '',
      });
      console.log('result AELF', _result);
    } catch (error) {
      console.log('getBalance error', error);
    }
  }, [currentAccount?.address, dAppChainId, getChainInfo, getViewContract]);

  const getUSDTBalance = useCallback(async () => {
    try {
      // const viewContract = await getTokenViewContract('tDVW');

      const chainInfo = getChainInfo(dAppChainId);
      const viewContract = await getViewContract({
        chainId: 'tDVW',
        contractAddress: chainInfo?.defaultToken.address || '',
      });
      const result = await viewContract.callViewMethod('GetBalance', {
        symbol: 'USDT',
        owner: currentAccount?.address || '',
      });
      console.log('result tDVW', result);

      const _chainInfo = getChainInfo('AELF');
      const _viewContract = await getViewContract({
        chainId: 'AELF',
        contractAddress: _chainInfo?.defaultToken.address || '',
      });
      const _result = await _viewContract.callViewMethod('GetBalance', {
        symbol: 'USDT',
        owner: currentAccount?.address || '',
      });
      console.log('result AELF', _result);
    } catch (error) {
      console.log('getBalance error', error);
    }
  }, [currentAccount?.address, dAppChainId, getChainInfo, getViewContract]);

  const resetWalletClick = useCallback(async () => {
    try {
      dispatch(resetWallet());
      navigationService.reset('Referral');
    } catch (error) {
      console.log('checkPin error', error);
    }
  }, [dispatch]);
  useEffect(() => {
    if (walletList.length < 1) {
      navigationService.reset('Referral');
    }
  }, [walletList.length]);
  const clearDiscover = useCallback(() => {
    dispatch(resetDiscover(currentNetwork));
  }, [currentNetwork, dispatch]);

  const { showAddressSelectModal } = useAddressSelect();

  const { getAELFChainInfoConfig, getEVMChainInfoConfig, getTokenConfig } = useGetEBridgeConfig();

  return (
    <SafeAreaBox edges={['top', 'right', 'left']} style={{ backgroundColor: theme.colors.bgBase1 }}>
      <ScrollView>
        <TextM>Home Tab</TextM>
        <TextM>{`Address: ${currentAccount?.address}`}</TextM>
        <TextM>{`Network: ${currentNetwork}`}</TextM>

        <GoogleTest />
        <CommonButton
          titleStyle={{
            color: 'red',
          }}
          type="primary"
          onPress={() =>
            navigationService.push('SecurityLock', {
              isCheck: true,
              checkCallback: () => {
                navigationService.reset('Tab');
              },
              isBackAllow: true,
            })
          }>
          SecurityLock
        </CommonButton>
        <CommonButton type="primary" onPress={() => Clipboard.setStringAsync(currentAccount?.address || '')}>
          Copy Address
        </CommonButton>
        <CommonButton type="primary" onPress={clearDiscover}>
          clear discover
        </CommonButton>
        <CommonButton
          type="primary"
          onPress={() => {
            navigationService.push('SetBiometrics', {
              type: SetBiometricsTypeEnum.create,
            });
          }}>
          SetBiometrics
        </CommonButton>

        <CommonButton
          type="primary"
          onPress={() => navigationService.push('SwitchNetworks')}
          containerStyle={{ marginTop: 20 }}>
          Switch NetworkType (current: {currentNetwork})
        </CommonButton>
        <CommonButton
          type="primary"
          onPress={() => navigationService.push('AboutUs')}
          containerStyle={{ marginTop: 20 }}>
          About
        </CommonButton>
        <CommonButton type="primary" onPress={() => navigationService.push('DappList')} style={{ marginTop: 20 }}>
          Connected Dapps
        </CommonButton>
        <CommonButton type="primary" onPress={() => navigationService.push('Security')} style={{ marginTop: 20 }}>
          Security
        </CommonButton>

        <CommonButton type="primary" onPress={() => navigationService.push('Home')} style={{ marginTop: 20 }}>
          Home
        </CommonButton>
        <CommonButton
          type="primary"
          onPress={() => navigationService.push('WalletManagement')}
          style={{ marginTop: 20 }}>
          Wallet Management
        </CommonButton>
        <CommonButton type="primary" onPress={showAddressSelectModal} style={{ marginTop: 20 }}>
          Wallet Management - Address Select Modal
        </CommonButton>
        <CommonButton type="primary" onPress={() => navigationService.push('ImportWallet')} style={{ marginTop: 10 }}>
          Import Wallets
        </CommonButton>
        <CommonButton
          type="primary"
          onPress={() => navigationService.push('WalletImportTypeSelect')}
          style={{ marginTop: 10 }}>
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
          style={{ marginTop: 10 }}>
          Confirm Backup
        </CommonButton>
        <CommonButton
          type="primary"
          onPress={() => navigationService.push('ManualBackupSuccess')}
          style={{ marginTop: 10 }}>
          Confirm Backup Success
        </CommonButton>
        <CommonButton
          type="primary"
          onPress={() =>
            navigationService.push('ManualBackup', {
              pin: credentials?.pin,
            })
          }
          style={{ marginTop: 10 }}>
          Manual Backup
        </CommonButton>
        <CommonButton type="primary" onPress={() => navigationService.push('CloudBackup')} style={{ marginTop: 10 }}>
          CloudBackup
        </CommonButton>
        <CommonButton type="primary" onPress={() => navigationService.push('CloudBackupDev')} style={{ marginTop: 10 }}>
          CloudBackupDev
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
          containerStyle={{ marginTop: 20 }}>
          Backup Modal
        </CommonButton>
        <CommonButton
          type="primary"
          onPress={() => {
            dispatch(resetWallet());
          }}>
          Reset wallet
        </CommonButton>
        <CommonButton type="primary" onPress={getELFBalance} style={{ marginTop: 20 }}>
          ELF Balance tDVW & AELF
        </CommonButton>
        <CommonButton type="primary" onPress={getUSDTBalance} style={{ marginTop: 20 }}>
          USDT Balance tDVW & AELF
        </CommonButton>
        <CommonButton type="primary" onPress={sendElf} style={{ marginTop: 20 }}>
          Send ELF
        </CommonButton>
        <CommonButton type="primary" onPress={resetWalletClick} style={{ marginTop: 20 }}>
          Reset Wallet
        </CommonButton>

        <CommonButton type="primary" onPress={() => navigationService.push('SwapHome')} style={{ marginTop: 20 }}>
          Swap
        </CommonButton>

        <CommonButton type="primary" onPress={() => navigationService.push('ContactsHome')} style={{ marginTop: 20 }}>
          Contact
        </CommonButton>
        <CommonButton
          type="primary"
          onPress={() =>
            navigationService.push('SendHome', {
              sendType: 'token',
              assetInfo: {
                address: 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
                balance: 100000000,
                balanceInUsd: '10.000000',
                chainId: 'AELF',
                decimals: 8,
                imageUrl: 'https://portkey-did.s3.ap-northeast-1.amazonaws.com/img/aelf/Coin-ELF.png',
                symbol: 'ELF',
                tokenContractAddress: 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
              },
              toInfo: {
                name: '',
                address: '',
              },
            } as unknown as IToSendHomeParamsType)
          }
          style={{ marginTop: 20 }}>
          Send Preview
        </CommonButton>

        <CommonButton
          type="primary"
          onPress={async () => {
            const result = await withdrawPreview({
              symbol: 'ELF',
              address: '2qK5vRzepa8H7iYCBtDFZ9NGsJ45jBuJSgch5qM9oqiBBzcUe3',
              chainId: 'AELF',
              amount: '1',
              network: 'tDVW',
              currentAccountAddress: '',
            });
            console.log('===result', result);
          }}
          style={{ marginTop: 20 }}>
          WithDraw Preview
        </CommonButton>

        <CommonButton
          type="primary"
          onPress={async () => {
            const tokenContract = await getTokenContract('AELF');

            const result = await withdraw({
              tokenContract,
              toAddress: '2qK5vRzepa8H7iYCBtDFZ9NGsJ45jBuJSgch5qM9oqiBBzcUe3',
              chainId: 'AELF',
              amount: '1',
              network: 'tDVW',
              tokenInfo: {
                symbol: 'ELF',
                decimals: 8,
                address: 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
              },
              isCheckSymbol: false,
            });

            console.log('===result', result);
          }}
          style={{ marginTop: 20 }}>
          WithDraw
        </CommonButton>

        <CommonButton
          type="primary"
          onPress={async () => {
            const fromChainInfo = getAELFChainInfoConfig('AELF');
            const toChainInfo = getEVMChainInfoConfig('SETH');
            const tokenEBridgeInfo = getTokenConfig('USDT');

            const wallet = await getManagerAccount(pin || '');

            const bridge = new EBridge({
              fromChainInfo,
              toChainInfo,
              tokenInfo: tokenEBridgeInfo,
              wallet,
            });

            const fee = await bridge.getELFFee();
            console.log('elf fee', fee);

            const limit = bridge.getLimit();
            console.log('fee,limit', fee, limit);

            const tokenContract = await getTokenContract('AELF');

            const createReceiptResult = await bridge.createReceipt({
              tokenContract,
              account: currentAccount?.address || '',
              targetAddress: '0xB464a49eF0b1096f6ed3BA88E5890E5E0aF7E6fc',
              amount: '0.01',
              owner: currentAccount?.address || '',
            });
            console.log(createReceiptResult, 'createReceiptResult===EBridge');
          }}
          style={{ marginTop: 20 }}>
          EBridge
        </CommonButton>
      </ScrollView>
    </SafeAreaBox>
  );
};

export default HomeTab;
