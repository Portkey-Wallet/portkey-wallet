import { DefaultChainId } from '@portkey-wallet/constants/constants-ca/network';
import { InitialTxFee } from '@portkey-wallet/constants/constants-ca/wallet';
import { getCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { AElfWallet } from '@portkey-wallet/types/aelf';
import aes from '@portkey-wallet/utils/aes';
import { ChainId } from '@portkey/provider-types';
import { store } from 'store/Provider/store';
import AElf from 'aelf-sdk';
import { TAccountInfo } from '@portkey-wallet/types/types-eoa/wallet';

const walletMap: { [address: string]: AElfWallet } = {};
export const getStoreState = () => {
  return store.getState();
};

export const getWallet = () => getStoreState().wallet;
export const getCurrentAccountAddress = () => getWallet()?.currentAccountAddress;

export const getAccountList = () => {
  const walletList = getWallet().walletList;
  const privateKeyAccountList = getWallet().privateKeyAccountList;
  const list: TAccountInfo[] = [];
  walletList.forEach((wallet) => list.push(...wallet.accountList));
  list.push(...privateKeyAccountList);
  return list;
};

export const getCurrentAccount = () => {
  const list = getAccountList();
  const currentAccountAddress = getCurrentAccountAddress();
  return list.find((i) => i.address === currentAccountAddress);
};

export const getWalletInfo = () => getWallet()?.walletInfo;
export const getUser = () => getStoreState().userInfo;
export const getPin = () => getUser().passwordSeed;

export const getCurrentCaInfo = () => {
  const wallet = getWallet();
  const { walletInfo, currentNetwork } = wallet || {};
  return walletInfo?.caInfo?.[currentNetwork];
};
export const getOriginChainId = () => {
  const wallet = getWallet();
  const caInfo = getCurrentCaInfo();

  return wallet.originChainId || caInfo?.originChainId || DefaultChainId;
};

export const getCurrentOriginCaInfo = () => {
  const caInfo = getCurrentCaInfo();
  const originChainId = getOriginChainId();
  return caInfo?.[originChainId || DefaultChainId];
};

export const getCurrentWallet = () => {
  const wallet = getWallet();
  const { walletInfo, currentNetwork } = wallet || {};
  const originChainId = getOriginChainId();
  return getCurrentWalletInfo(walletInfo, currentNetwork, originChainId);
};

export const getChainInfo = (chainId: ChainId) => {
  const wallet = getWallet();
  const { chainInfo, currentNetwork } = wallet || {};
  return chainInfo?.[currentNetwork]?.filter((chain) => chain.chainId === chainId)[0];
};

export const isCurrentCaHash = (caHash: string) => getCurrentOriginCaInfo()?.caHash === caHash;

export const getTxFee = (chainId: ChainId) => {
  const currentNetwork = getStoreState().wallet.currentNetwork;
  const targetTxFee = getStoreState().txFee?.[currentNetwork]?.[chainId];
  return targetTxFee ?? InitialTxFee;
};

export const getManagerAccount = (password: string): AElfWallet | undefined => {
  const walletInfo = getWalletInfo();
  if (!walletInfo) return;

  // get privateKey
  const privateKey = aes.decrypt(walletInfo.AESEncryptPrivateKey, password);
  if (!privateKey) return;

  if (!walletMap[walletInfo.address]) walletMap[walletInfo.address] = AElf.wallet.getWalletByPrivateKey(privateKey);
  return walletMap[walletInfo.address];
};
