import { DefaultChainId } from '@portkey-wallet/constants/constants-ca/network';
import { InitialTxFee } from '@portkey-wallet/constants/constants-ca/wallet';
import { getCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { ChainId } from '@portkey/provider-types';
import { store } from 'store/Provider/store';

export const getStoreState = () => {
  return store.getState();
};

export const getWallet = () => getStoreState().wallet;
export const getWalletInfo = () => getWallet()?.walletInfo;

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
