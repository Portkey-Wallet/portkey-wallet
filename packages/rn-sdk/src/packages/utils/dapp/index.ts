import { IDappStoreState } from 'packages/store/store-ca/dapp/type';
import { WalletState } from 'packages/store/store-ca/wallet/type';
import { CAInfo } from 'packages/types/types-ca/wallet';
import { Accounts, ChainId, ChainIds } from '@portkey/provider-types';
import { addressFormat } from '../index';
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
    const chainId = key as ChainId;
    const caInfo = value as CAInfo;
    if (caInfo?.caAddress) accounts[chainId] = [addressFormat(caInfo.caAddress, chainId)];
  });
  return accounts;
}

export function handleOriginInfo({
  wallet,
  dapp,
  origin,
}: {
  wallet: WalletState;
  dapp: IDappStoreState;
  origin: string;
}) {
  return dapp.dappMap?.[wallet.currentNetwork]?.find(item => item.origin === origin);
}
