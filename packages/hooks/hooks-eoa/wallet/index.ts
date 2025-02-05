import { useCallback, useMemo, useRef } from 'react';
import { useAppEOASelector } from '../index';
import AElf from 'aelf-sdk';
import { formatWalletInfoV2, getNextBIP44Path } from '@portkey-wallet/utils/wallet';
import { useAppCommonDispatch } from '../../index';
import {
  addAccount as addAccountAction,
  addWallet,
  resetWallet,
  setHideAssetsAction,
} from '@portkey-wallet/store/store-eoa/wallet/actions';
import { TAccountInfo, TWalletInfo } from '@portkey-wallet/types/types-eoa/wallet';
import aes from '@portkey-wallet/utils/aes';
import { useCurrentNetwork, useIsMainnet } from '../network';
import { ChainId } from '@portkey-wallet/types';
import { changeNetworkType } from '@portkey-wallet/store/store-eoa/wallet/slice';
import { useChainList } from '../network/chain';

export const useWalletState = () => useAppEOASelector(state => state.wallet);

export const useWalletListState = () => useAppEOASelector(state => state.wallet.walletList);
export const usePrivateKeyAccountListState = () => useAppEOASelector(state => state.wallet.privateKeyAccountList);
export const useCurrentAccountAddressState = () => useAppEOASelector(state => state.wallet.currentAccountAddress);
export const useResetWallet = () => {
  const dispatch = useAppCommonDispatch();
  return useCallback(() => {
    dispatch(resetWallet());
  }, [dispatch]);
};
export const useAddWallet = () => {
  const walletList = useWalletListState();
  const walletListRef = useRef(walletList);
  walletListRef.current = walletList;
  const dispatch = useAppCommonDispatch();

  return useCallback(
    (pin: string) => {
      if (!pin) {
        return;
      }

      const walletListLength = walletListRef.current.length;
      const walletInfo = AElf.wallet.createNewWallet();

      const wallet = formatWalletInfoV2(walletInfo, pin, `Wallet ${walletListLength + 1}`);
      if (!wallet) return;
      console.log('wallet======', JSON.stringify(wallet));
      dispatch(
        addWallet({
          wallet,
        }),
      );
    },
    [dispatch],
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
  // const a = useAppEOASelector(state => state);
  // console.log('a=====', JSON.stringify(a));
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

export const useCurrentAddressInfos = () => {
  const isMainnet = useIsMainnet();
  const currentAccount = useCurrentAccount();
  const addressInfos = useMemo(() => {
    return [
      {
        address: currentAccount?.address || '',
        // address: '27UsGir6k7UntMtUTmo4fDU3v6mufJjrCCtnmTztXDfkHCcDyq',
        chainId: 'AELF' as ChainId,
        chainName: 'MainChain',
      },
      {
        address: currentAccount?.address || '',
        // address: '27UsGir6k7UntMtUTmo4fDU3v6mufJjrCCtnmTztXDfkHCcDyq',
        chainId: (isMainnet ? 'tDVV' : 'tDVW') as ChainId,
        chainName: 'dAppChain',
      },
    ];
  }, [currentAccount?.address, isMainnet]);
  return addressInfos;
};

export const useIsAccountExist = () => {
  const list = useAccountList();

  return useMemo(() => list.length > 0, [list.length]);
};
export const useAccountByWallet = (wallet: TWalletInfo) => {
  // const pin = usePin();
  const dispatch = useAppCommonDispatch();
  const addAccount = useCallback(
    (pin: string) => {
      const { AESEncryptMnemonic, accountList } = wallet;
      const lastAccount = accountList[accountList.length - 1];
      const mnemonic = aes.decrypt(AESEncryptMnemonic, pin);
      const nextBIP44Path = getNextBIP44Path(lastAccount.BIP44Path);
      const account = AElf.wallet.getWalletByMnemonic(mnemonic, nextBIP44Path);
      const accountAESEncryptPrivateKey = aes.encrypt(account.privateKey, pin);
      if (!account?.publicKey) {
        const publicKey = account.keyPair.getPublic();
        account.publicKey = {
          x: publicKey.x.toString('hex'),
          y: publicKey.y.toString('hex'),
        };
      }

      const accountInfo: TAccountInfo = {
        BIP44Path: nextBIP44Path,
        address: account.address,
        AESEncryptPrivateKey: accountAESEncryptPrivateKey,
        publicKey: account.publicKey,
        name: 'Address ' + accountList.length,
        isHide: false,
      };
      dispatch(
        addAccountAction({
          key: wallet.key,
          account: accountInfo,
        }),
      );
    },
    [dispatch, wallet],
  );
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const removeAccount = useCallback(() => {}, []);
  return {
    addAccount,
    removeAccount,
  };
};

// export const useCurrentWallet = () => {
//   const wallet = useWalletState();
//   const originChainId = useOriginChainId();

//   return useMemo(() => {
//     const { walletInfo, currentNetwork, chainInfo } = wallet;
//     return {
//       ...wallet,
//       walletInfo: getCurrentWalletInfo(walletInfo, currentNetwork, originChainId),
//       chainList: chainInfo?.[currentNetwork],
//     };
//   }, [originChainId, wallet]);
// };
// export const useOriginChainId = () => {
//   // const { originChainId } = useWalletState();
//   // const caInfo = useCurrentCaInfo();
//   // return useMemo(
//   //   () => caInfo?.originChainId || originChainId || DefaultChainId,
//   //   [caInfo?.originChainId, originChainId],
//   // );
//   return 'AELF';
// };

export const useUniqueIdentify = () => {
  const currentAccount = useCurrentAccount();
  const currentNetwork = useCurrentNetwork();
  const identify = useMemo(
    () => `aelf_#${currentAccount?.address}_#${currentNetwork}`,
    [currentAccount?.address, currentNetwork],
  );
  return identify;
};

export const useSetHideAssets = () => {
  const dispatch = useAppCommonDispatch();
  return useCallback(
    (hideAssets: boolean) => {
      dispatch(setHideAssetsAction({ hideAssets }));
    },
    [dispatch],
  );
};
export const useCurrentHideAssetsState = () => {
  const { hideAssets } = useWalletState();
  return hideAssets;
};
export const useCurrentChainList = useChainList;

export const useChainIdList = () => {
  const chainList = useCurrentChainList();
  const isMainnet = useIsMainnet();
  return useMemo(() => {
    return chainList?.map(info => info.chainId) || ['AELF', isMainnet ? 'tDVV' : 'tDVW'];
  }, [chainList, isMainnet]);
};

export const useSwitchNetworkType = () => {
  const dispatch = useAppCommonDispatch();
  const networkType = useCurrentNetwork();
  const switchNetwork = useCallback(() => {
    const switchedNetwork = networkType === 'MAINNET' ? 'TESTNET' : 'MAINNET';
    dispatch(changeNetworkType(switchedNetwork));
  }, [dispatch, networkType]);
  return switchNetwork;
};
