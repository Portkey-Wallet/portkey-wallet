import { IDappStoreState } from '@portkey-wallet/store/store-eoa/dapp/type';
import { WalletState } from '@portkey-wallet/store/store-ca/wallet/type';
import { Accounts, ChainIds } from '@portkey/provider-types';
import { TNetworkState } from '@portkey-wallet/store/store-eoa/network/type';
import { TWalletState } from '@portkey-wallet/store/store-eoa/wallet/type';
import { TAccountInfo } from '@portkey-wallet/types/types-eoa/wallet';
import { NetworkType } from '@portkey-wallet/types';

export function handleChainIds(networkInfo: TNetworkState) {
  const { currentNetwork, chainListMap } = networkInfo;
  const curNetworkChainInfo = chainListMap?.[currentNetwork];
  const chainIds = curNetworkChainInfo?.map(item => item.chainId).filter(i => !!i);
  return chainIds as ChainIds;
}

export function handleAccountList(walletInfo: TWalletState) {
  const walletList = walletInfo.walletList;
  const list: TAccountInfo[] = [];
  walletList.forEach(wallet => list.push(...wallet.accountList));
  return list;
}

export function handleCurrentAccount(walletInfo: TWalletState) {
  const accountList = handleAccountList(walletInfo);
  const currentAccountAddress = walletInfo.currentAccountAddress;
  const accountMap: Record<string, TAccountInfo> = {};
  accountList.forEach(item => {
    accountMap[item.address] = item;
  });
  return currentAccountAddress ? accountMap[currentAccountAddress] : undefined;
}

export function handleAccounts(walletInfo: TWalletState, networkInfo: TNetworkState) {
  const curAccount = handleCurrentAccount(walletInfo);
  const curChainIds = handleChainIds(networkInfo);
  const accounts: Accounts = {};
  curChainIds.forEach(chainId => {
    accounts[chainId] = [`ELF_${curAccount?.address}_${chainId}`];
  });
  return accounts;
}

export function handleCurrentWallet(walletInfo: TWalletState) {
  const walletList = walletInfo.walletList;
  const currentAccountAddress = walletInfo.currentAccountAddress;
  return walletList.find(wallet => wallet.accountList.some(account => account.address === currentAccountAddress));
}

export function handleOriginInfo({
  currentNetwork,
  dapp,
  origin,
}: {
  currentNetwork: NetworkType;
  dapp: IDappStoreState;
  origin: string;
}) {
  return dapp.dappMap?.[currentNetwork]?.find(item => item.origin === origin);
}
