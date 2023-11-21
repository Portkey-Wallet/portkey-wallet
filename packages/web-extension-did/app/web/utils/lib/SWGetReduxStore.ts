import { IDappStoreState } from '@portkey-wallet/store/store-ca/dapp/type';
import { WalletState } from '@portkey-wallet/store/store-ca/wallet/type';
import { getStoreState as getDefaultState } from 'store/utils/getStore';
import { getStoredState } from 'redux-persist';
import { walletPersistConfig, dappPersistConfig, cmsPersistConfig } from 'store/Provider/config';
import { DefaultChainId } from '@portkey-wallet/constants/constants-ca/network';
import { ChainId } from '@portkey/provider-types';

export async function getSWReduxState() {
  return {
    wallet: await getWalletState(),
    dapp: await getDappState(),
    cms: await getCmsState(),
  };
}

export const getWalletState = async () => {
  let wallet = await getStoredState(walletPersistConfig);
  if (!wallet) wallet = getDefaultState().wallet;
  return wallet as WalletState;
};

export const getCurrentChainList = async () => {
  const { chainInfo, currentNetwork } = await getWalletState();
  return chainInfo?.[currentNetwork];
};

export const getCurrentChainInfo = async (chainId: ChainId) => {
  return (await getCurrentChainList())?.find((chain) => chain.chainId === chainId);
};

export const getDappState = async () => {
  let dapp = await getStoredState(dappPersistConfig);
  if (!dapp) dapp = getDefaultState().dapp;
  return dapp as IDappStoreState;
};

export const getCmsState = async () => {
  let cms = await getStoredState(cmsPersistConfig);
  if (!cms) cms = getDefaultState().cms;
  return cms;
};

export const getCurrentNetworkWallet = async () => {
  const wallet = await getWalletState();
  const currentNetwork = wallet.currentNetwork;
  return wallet.walletInfo?.caInfo?.[currentNetwork];
};

export const getCurrentCaHash = async () => {
  const wallet = await getWalletState();
  const { walletInfo, currentNetwork } = wallet || {};
  const caInfo = walletInfo?.caInfo?.[currentNetwork];
  const originChainId = wallet.originChainId || caInfo?.originChainId;
  return caInfo?.[originChainId || DefaultChainId]?.caHash;
};
