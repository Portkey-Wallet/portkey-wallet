import { store } from 'store';
import aes from '@portkey-wallet/utils/aes';
import AElf from 'aelf-sdk';
import { AElfWallet } from '@portkey-wallet/types/aelf';
import { DefaultChainId } from '@portkey-wallet/constants/constants-ca/network';
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
  const wallet = getWallet();
  const { walletInfo, currentNetwork } = wallet || {};
  const caInfo = walletInfo?.caInfo?.[currentNetwork];
  const originChainId = wallet.originChainId || caInfo?.originChainId;
  return caInfo?.[originChainId || DefaultChainId]?.caHash === caHash;
};
