import { useCallback, useMemo, useRef } from 'react';
import { useAppEOASelector } from '../index';
import AElf from 'aelf-sdk';
import { formatWalletInfoV2 } from '@portkey-wallet/utils/wallet';
import { useAppCommonDispatch } from '../../index';
import { addWallet } from '@portkey-wallet/store/store-eoa/wallet/actions';
import { TAccountInfo } from '@portkey-wallet/types/types-eoa/wallet';

export const useWalletState = () => useAppEOASelector(state => state.wallet);

export const useWalletListState = () => useAppEOASelector(state => state.wallet.walletList);
export const usePrivateKeyAccountListState = () => useAppEOASelector(state => state.wallet.privateKeyAccountList);
export const useCurrentAccountAddressState = () => useAppEOASelector(state => state.wallet.currentAccountAddress);

export const useAddWallet = () => {
  const walletList = useWalletListState();
  const walletListRef = useRef(walletList);
  walletListRef.current = walletList;
  const dispatch = useAppCommonDispatch();

  return useCallback(
    (pin: string, mnemonics?: string, privateKey?: string) => {
      if (!pin) {
        return {
          success: false,
          message: 'Pin is required',
        };
      }

      const walletListLength = walletListRef.current.length;
      let walletInfo;
      if (mnemonics) {
        walletInfo = AElf.wallet.getWalletByMnemonic(mnemonics);
      } else if (privateKey) {
        walletInfo = AElf.wallet.getWalletByPrivateKey(privateKey);
      } else {
        walletInfo = AElf.wallet.createNewWallet();
      }

      const wallet = formatWalletInfoV2(walletInfo, pin, `Wallet ${walletListLength + 1}`);
      console.log('after: formatWalletInfoV2: ', wallet, walletList);
      if (!wallet) {
        return {
          success: false,
          message: 'Wallet create failed',
        };
      }

      if (walletList.find(item => item.key === wallet.key)) {
        return {
          success: false,
          message: 'Wallet already exists',
        };
      }

      dispatch(
        addWallet({
          wallet,
        }),
      );
      return {
        success: true,
        message: 'Wallet add success',
      };
    },
    [dispatch, walletList],
  );
};

export const useAccountList = () => {
  const walletList = useWalletListState();
  const privateKeyAccountList = usePrivateKeyAccountListState();

  return useMemo(() => {
    const list: TAccountInfo[] = [];
    walletList.forEach(wallet => list.push(...wallet.accountList));
    list.push(...privateKeyAccountList);

    return list;
  }, [privateKeyAccountList, walletList]);
};

export const useCurrentAccount = () => {
  const list = useAccountList();
  const currentAccountAddress = useCurrentAccountAddressState();

  const accountMap = useMemo(() => {
    const map: Record<string, TAccountInfo> = {};
    list.forEach(item => {
      map[item.address] = item;
    });
    return map;
  }, [list]);

  return useMemo(
    () => (currentAccountAddress ? accountMap[currentAccountAddress] : undefined),
    [accountMap, currentAccountAddress],
  );
};

export const useIsAccountExist = () => {
  const list = useAccountList();

  return useMemo(() => list.length > 0, [list.length]);
};

export const useCurrentWallet = () => {
  const walletList = useWalletListState();
  const currentAccountAddress = useCurrentAccountAddressState();

  return useMemo(() => {
    return walletList.find(wallet => wallet.accountList.some(account => account.address === currentAccountAddress));
  }, [walletList, currentAccountAddress]);
};
