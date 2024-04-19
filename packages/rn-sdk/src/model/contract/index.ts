import { DefaultChainId } from '@portkey-wallet/constants/constants-ca/network-mainnet-v2';
import { getCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { store } from '@portkey-wallet/rn-base/store';
import { ChainId } from '@portkey-wallet/types';
import aes from '@portkey-wallet/utils/aes';
import AElf from 'aelf-sdk';
import { ChainItemType } from '@portkey/provider-types';
import { getContractBasic } from '@portkey-wallet/contracts/utils';
// const DefaultChainId = 'AELF';

export function getWallet() {
  return store.getState().wallet;
}
export function getOriginChainId() {
  const { originChainId } = getWallet();
  const caInfo = getCurrentCaInfo();
  return caInfo?.originChainId || originChainId || DefaultChainId;
}

export const getCurrentCaInfo = () => {
  const { walletInfo, currentNetwork } = getWallet();
  return walletInfo?.caInfo?.[currentNetwork];
};

export function getCurrentWallet() {
  const wallet = getWallet();
  const originChainId = getOriginChainId();
  const { walletInfo, currentNetwork, chainInfo } = wallet;
  return {
    ...wallet,
    walletInfo: getCurrentWalletInfo(walletInfo, currentNetwork, originChainId),
    chainList: chainInfo?.[currentNetwork],
  };
}
export const getCurrentWalletItem = () => {
  const { currentNetwork, walletInfo } = getWallet();
  const originChainId = getOriginChainId();

  return getCurrentWalletInfo(walletInfo, currentNetwork, originChainId);
};
export function getCurrentChain(_chainId?: ChainId) {
  const originChainId = getOriginChainId();
  const chainId = _chainId || originChainId;
  const currentChainList = getCurrentChainList();
  return currentChainList?.find((chain: ChainItemType) => chain.chainId === chainId);
}
export function getCurrentChainList() {
  const { currentNetwork, chainInfo } = getCurrentWallet();
  return chainInfo?.[currentNetwork];
}

export async function getCurrentCAContract() {
  const { credentials } = store.getState().user;
  if (!credentials) throw 'wallet is not unlocked';
  const { pin } = credentials;
  const originChainId = getOriginChainId();
  const chainInfo = getCurrentChain(originChainId);
  const { AESEncryptPrivateKey } = getCurrentWalletItem();
  const privateKey = aes.decrypt(AESEncryptPrivateKey, pin);
  const wallet = AElf.wallet.getWalletByPrivateKey(privateKey);
  const contract = await getContractBasic({
    contractAddress: chainInfo.caContractAddress,
    rpcUrl: chainInfo.endPoint,
    account: wallet,
  });
  return contract;
}
