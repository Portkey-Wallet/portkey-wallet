import { useCallback, useEffect, useState } from 'react';
import CommonToast from 'components/CommonToast';
import { MAX_ACCOUNT_NUMBER } from '@portkey-wallet/store/store-eoa/wallet/config';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { TWalletInfo } from '@portkey-wallet/types/types-eoa/wallet';
import { useAccountByWallet } from '@portkey-wallet/hooks/hooks-eoa/wallet';
import navigationService from 'utils/navigationService';
import { useCheckSecurityLock } from 'hooks/securityLock';
import { useCredentials } from 'hooks/store';

export const useEmptyAddress = () => {
  return {
    addAddressDisabled: false,
    accountAdding: false,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    addNewAddress: () => {},
  };
};

export const useAddAddress = ({ walletInfo }: { walletInfo?: TWalletInfo }) => {
  const [accountAdding, setAccountAdding] = useState(false);
  const [accountAdded, setAccountAdded] = useState(false);
  const { addAccount } = useAccountByWallet(walletInfo);
  const [addAddressDisabled, setAddAddressDisabled] = useState(false);
  // const [failedToastShowed, setFailedToastShowed] = useState(false);
  const checkSecurityLock = useCheckSecurityLock();
  const credentials = useCredentials();
  const { action, routerPin, routerWallet } = useRouterParams<{
    action: string;
    routerPin: string;
    routerWallet: TWalletInfo;
  }>();

  useEffect(() => {
    if (!walletInfo) {
      return;
    }
    walletInfo.accountList.length >= MAX_ACCOUNT_NUMBER && setAddAddressDisabled(true);
  }, [walletInfo]);

  useEffect(() => {
    if (action !== 'ADD_ACCOUNT' || accountAdding || accountAdded) {
      return;
    }
    const walletMatched = routerWallet && routerWallet.key === walletInfo?.key;
    if (!walletMatched) {
      return;
    }
    console.log('ADD_ACCOUNT: ', walletMatched, accountAdding);
    setAccountAdding(true);
    setTimeout(() => {
      addAccount(routerPin);
      setAccountAdding(false);
      setAccountAdded(true);
    }, 100);
  }, [accountAdded, accountAdding, action, addAccount, routerPin, routerWallet, walletInfo]);

  // useEffect(() => {
  //   if (!walletInfo || failedToastShowed) {
  //     return;
  //   }
  //   if (accountAdded && walletInfo.accountList.length >= MAX_ACCOUNT_NUMBER) {
  //     setFailedToastShowed(true);
  //     CommonToast.fail(`Add up to ${MAX_ACCOUNT_NUMBER} addresses per wallet`);
  //   }
  // }, [accountAdded, walletInfo]);

  const addNewAddress = useCallback(async () => {
    if (addAddressDisabled) {
      CommonToast.fail(`Add up to ${MAX_ACCOUNT_NUMBER} addresses per wallet`);
      return;
    }
    await checkSecurityLock(() => {
      console.log('securePassword: ', credentials);
      if (!credentials?.pin) {
        // almost impossible
        CommonToast.fail('Failed to be added');
        return;
      }
      navigationService.pop(1);
      navigationService.push('WalletManagement', {
        routerWallet: walletInfo,
        routerPin: credentials.pin,
        action: 'ADD_ACCOUNT',
      });
    }, true);
  }, [addAddressDisabled, checkSecurityLock, credentials, walletInfo]);

  return {
    accountAdding,
    accountAdded,
    // setAccountAdded,
    // setAccountAdding,
    addAddressDisabled,
    addNewAddress,
  };
};
