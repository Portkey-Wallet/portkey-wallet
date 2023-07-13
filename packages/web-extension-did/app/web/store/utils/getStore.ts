import { DefaultChainId } from '@portkey-wallet/constants/constants-ca/network';
import { InitialTxFee } from '@portkey-wallet/constants/constants-ca/wallet';
import { TxFeeItem } from '@portkey-wallet/store/store-ca/txFee/type';
import { ChainId } from '@portkey/provider-types';
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

export const getTxFee = (chainId: ChainId) => {
  const currentNetwork = getStoreState().wallet.currentNetwork;
  const targetTxFee = getStoreState().txFee[currentNetwork]?.filter((txf: TxFeeItem) => txf.chainId === chainId);
  return targetTxFee?.[0].transactionFee ?? InitialTxFee;
};
