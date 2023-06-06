import { WalletState } from '@portkey-wallet/store/store-ca/wallet/type';
import { CAInfo } from '@portkey-wallet/types/types-ca/wallet';
import { Accounts, ChainId, ChainIds } from '@portkey/provider-types';
export function handleCurrentCAInfo(wallet: WalletState) {
  const { walletInfo, currentNetwork } = wallet;
  return walletInfo?.caInfo[currentNetwork];
}

export function handleChainIds(wallet: WalletState) {
  const currentCAInfo = handleCurrentCAInfo(wallet);
  const list = Object.entries(currentCAInfo || {})
    .map(([key, value]) => {
      if ((value as CAInfo)?.caAddress) return key;
      return undefined;
    })
    .filter(i => !!i);
  return list as ChainIds;
}

export function handleAccounts(wallet: WalletState) {
  const currentCAInfo = handleCurrentCAInfo(wallet);
  const accounts: Accounts = {};
  Object.entries(currentCAInfo || {}).forEach(([key, value]) => {
    if ((value as CAInfo)?.caAddress) accounts[key as ChainId] = [(value as CAInfo).caAddress];
  });
  return accounts;
}
