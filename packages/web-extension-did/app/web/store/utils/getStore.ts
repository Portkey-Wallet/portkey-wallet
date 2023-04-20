import { DefaultChainId } from '@portkey-wallet/constants/constants-ca/network';
import { store } from 'store/Provider/store';

export const getStoreState = () => {
  return store.getState();
};

export const getWallet = () => getStoreState().wallet;

export const getWalletInfo = () => getWallet()?.walletInfo;

export const isCurrentCaHash = (caHash: string) => {
  const wallet = getWallet();
  const { walletInfo, currentNetwork } = wallet || {};
  const caInfo: any = walletInfo?.caInfo?.[currentNetwork];
  const originChainId = wallet.originChainId || caInfo?.originChainId;
  return caInfo?.[originChainId || DefaultChainId]?.caHash === caHash;
};
