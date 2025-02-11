import { store } from 'store';
import aes from '@portkey-wallet/utils/aes';
import AElf from 'aelf-sdk';
import { AElfWallet } from '@portkey-wallet/types/aelf';
import { ChainId } from '@portkey-wallet/types';
import { InitialTxFee } from '@portkey-wallet/constants/constants-ca/wallet';
import { getContractBasic } from '@portkey-wallet/contracts/utils';
import { getWallet as getDefaultWallet, isEqAddress } from '@portkey-wallet/utils/aelf';
import { TAccountInfo } from '@portkey-wallet/types/types-eoa/wallet';

const walletMap: { [address: string]: AElfWallet } = {};
export const getState = () => store.getState();

export const getDispatch = () => store.dispatch;

export const getWallet = () => getState().wallet;
export const getNetwork = () => getState().network;
export const getUser = () => getState().user;
export const getPin = () => getUser().credentials?.pin;

export const getWalletInfo = () => {
  const wallet = getWallet();
  const walletList = wallet.walletList;
  const accountList: TAccountInfo[] = [];
  walletList.forEach(w => accountList.push(...w.accountList));
  const currentAccountAddress = wallet.currentAccountAddress;
  const accountMap: Record<string, TAccountInfo> = {};
  accountList.forEach(item => {
    accountMap[item.address] = item;
  });
  return currentAccountAddress ? accountMap[currentAccountAddress] : undefined;
};

export const getWalletAddress = () => {
  return getWalletInfo()?.address;
};

export const getWalletPrivateKey = (password: string) => {
  const { AESEncryptPrivateKey } = getWalletInfo() || {};
  if (!AESEncryptPrivateKey) {
    return;
  }
  return aes.decrypt(AESEncryptPrivateKey, password) || '';
};

export const getWalletMnemonic = (password: string) => {
  const { AESEncryptMnemonic } = getWalletInfo() || {};
  if (!AESEncryptMnemonic) {
    return;
  }
  return aes.decrypt(AESEncryptMnemonic, password) || '';
};

export const checkPin = (pin: string) => {
  // const { walletList, privateKeyAccountList } = getWallet();
  const { walletList } = getWallet();
  // console.log('checkPin: ', walletList, privateKeyAccountList);
  let AESEncryptContent = walletList[0]?.accountList[0].AESEncryptPrivateKey;
  if (!AESEncryptContent) {
    AESEncryptContent = walletList[0]?.AESEncryptMnemonic;
  }

  return !!aes.decrypt(AESEncryptContent, pin);
};

export const getManagerAccount = (password: string): AElfWallet | undefined => {
  const walletInfo = getWalletInfo();
  if (!walletInfo) {
    return;
  }

  // get privateKey
  const privateKey = aes.decrypt(walletInfo.AESEncryptPrivateKey, password);
  if (!privateKey) {
    return;
  }

  if (!walletMap[walletInfo.address]) {
    walletMap[walletInfo.address] = AElf.wallet.getWalletByPrivateKey(privateKey);
  }
  return walletMap[walletInfo.address];
};

export const getTxFee = () => getState().txFee;

export const getCurrentTxFee = () => {
  return getTxFee()?.[getWallet()?.currentNetwork];
};

export const getCurrentTxFeeByChainId = (chainId: ChainId) => {
  return getCurrentTxFee()?.[chainId] || InitialTxFee;
};

export const getCurrentChainInfoByChainId = (chainId: ChainId) => {
  const { currentNetwork, chainInfo } = getWallet();
  return chainInfo?.[currentNetwork]?.find(i => i.chainId === chainId);
};

export const getViewTokenContractByChainId = (chainId: ChainId) => {
  const chainInfo = getCurrentChainInfoByChainId(chainId);

  return getContractBasic({
    contractAddress: chainInfo?.defaultToken.address || '',
    rpcUrl: chainInfo?.endPoint,
    account: getDefaultWallet(),
  });
};

export const getCurrentChainList = () => {
  const { chainListMap, currentNetwork } = getNetwork();
  return chainListMap?.[currentNetwork];
};

export const getCurrentChainInfo = (chainId: ChainId) => {
  return getCurrentChainList()?.find(chain => chain.chainId === chainId);
};

export const isMyPayTransactionFee = (address: string, chainId?: ChainId) => {
  // manager transaction fee hide
  // const { walletInfo } = getWallet();
  // if (isEqAddress(walletInfo?.address, address)) return true;
  const caInfo = getCurrentCaInfo();

  if (chainId) {
    const currentCaInfo = caInfo?.[chainId];
    if (!currentCaInfo) {
      return false;
    }
    return currentCaInfo.caAddress && isEqAddress(currentCaInfo.caAddress, address);
  }

  const addressList = Object.values(caInfo || {})
    .map((item: any) => item?.caAddress)
    .filter(i => !!i);

  return addressList.some(i => isEqAddress(i, address));
};
