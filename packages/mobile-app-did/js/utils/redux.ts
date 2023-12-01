import { store } from 'store';
import aes from '@portkey-wallet/utils/aes';
import AElf from 'aelf-sdk';
import { AElfWallet } from '@portkey-wallet/types/aelf';
import { DefaultChainId } from '@portkey-wallet/constants/constants-ca/network';
import { ChainId } from '@portkey-wallet/types';
import { InitialTxFee } from '@portkey-wallet/constants/constants-ca/wallet';
const walletMap: { [address: string]: AElfWallet } = {};
export const getState = () => store.getState();

export const getDispatch = () => store.dispatch;

export const getWallet = () => getState().wallet;
export const getUser = () => getState().user;
export const getPin = () => getUser().credentials?.pin;

export const getWalletInfo = () => getWallet()?.walletInfo;

export const getWalletAddress = () => {
  return getWalletInfo()?.address;
};

export const getWalletPrivateKey = (password: string) => {
  const { AESEncryptPrivateKey } = getWalletInfo() || {};
  if (!AESEncryptPrivateKey) return;
  return aes.decrypt(AESEncryptPrivateKey, password) || '';
};

export const getWalletMnemonic = (password: string) => {
  const { AESEncryptMnemonic } = getWalletInfo() || {};
  if (!AESEncryptMnemonic) return;
  return aes.decrypt(AESEncryptMnemonic, password) || '';
};

export const checkPin = (pin: string) => {
  const { AESEncryptPrivateKey } = getWalletInfo() || {};
  if (!AESEncryptPrivateKey) return false;
  return !!aes.decrypt(AESEncryptPrivateKey, pin);
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

export const isCurrentCaHash = (caHash: string) => {
  return getCurrentCaHash() === caHash;
};

export const getCurrentCaInfo = (chainId?: ChainId) => {
  const wallet = getWallet();
  const { walletInfo, currentNetwork } = wallet || {};
  const caInfo = walletInfo?.caInfo?.[currentNetwork];
  const originChainId = wallet.originChainId || caInfo?.originChainId;
  if (chainId) return caInfo?.[chainId];
  return caInfo?.[originChainId || DefaultChainId];
};

export const getCurrentCaHash = () => {
  return getCurrentCaInfo()?.caHash;
};

export const getTxFee = () => getState().txFee;

export const getCurrentTxFee = () => {
  return getTxFee()?.[getWallet()?.currentNetwork];
};

export const getCurrentTxFeeByChainId = (chainId: ChainId) => {
  return getCurrentTxFee()?.[chainId] || InitialTxFee;
};

export const getCurrentChainInfo = () => {
  const { currentNetwork, chainInfo } = getWallet();
  return chainInfo?.[currentNetwork];
};

export const getCurrentChainInfoByChainId = (chainId: ChainId) => {
  const { currentNetwork, chainInfo } = getWallet();
  return chainInfo?.[currentNetwork]?.find(i => i.chainId === chainId);
};
