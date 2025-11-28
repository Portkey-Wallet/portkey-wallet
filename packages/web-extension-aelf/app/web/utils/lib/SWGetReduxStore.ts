import { IDappStoreState } from '@portkey-wallet/store/store-ca/dapp/type';
import { TWalletState } from '@portkey-wallet/store/store-eoa/wallet/type';
import { getStoreState as getDefaultState } from 'store/utils/getStore';
import { getStoredState } from 'redux-persist';
import {
  walletPersistConfig,
  dappPersistConfig,
  cmsPersistConfig,
  loginPersistConfig,
  networkPersistConfig,
} from 'store/Provider/config';
import { LoginState } from 'store/reducers/loginCache/type';
import { TAccountInfo } from '@portkey-wallet/types/types-eoa/wallet';
import { TNetworkState } from '@portkey-wallet/store/store-eoa/network/type';
import { ChainId } from '@portkey-wallet/types';

export async function getSWReduxState() {
  return {
    wallet: await getWalletState(),
    dapp: await getDappState(),
    cms: await getCmsState(),
    // updated when dev EOA
    network: await getNetwork(),
  };
}

// new for eoa
export const getWalletsInfo = async () => {
  let wallet = await getStoredState(walletPersistConfig);
  if (!wallet) wallet = getDefaultState().wallet;
  return wallet as TWalletState;
};
const getAccountList = async () => {
  const wallet = ((await getStoredState(walletPersistConfig)) || getDefaultState().wallet) as TWalletState;
  const walletList = wallet.walletList || [];
  const privateKeyAccountList = wallet.privateKeyAccountList || [];

  const accountList: TAccountInfo[] = [];
  walletList.forEach((wallet) => accountList.push(...wallet.accountList));
  accountList.push(...privateKeyAccountList);

  return accountList;
};
export const getCurrentAccount = async () => {
  const wallet = ((await getStoredState(walletPersistConfig)) || getDefaultState().wallet) as TWalletState;
  const currentAccountAddress = wallet.currentAccountAddress;
  const accountList = await getAccountList();
  const map: Record<string, TAccountInfo> = {};
  accountList.forEach((item: TAccountInfo) => {
    map[item.address] = item;
  });

  return currentAccountAddress ? map[currentAccountAddress] : undefined;
};
export const getNetwork = async () => {
  const network = await getStoredState(networkPersistConfig);
  console.log('network: ', network);
  return (network || getDefaultState().network) as TNetworkState;
};
// new for ca end

export const getWalletState = async () => {
  let wallet = await getStoredState(walletPersistConfig);
  if (!wallet) wallet = getDefaultState().wallet;
  return wallet as TWalletState;
};

export const getCurrentChainList = async () => {
  const { chainListMap, currentNetwork } = await getNetwork();
  return chainListMap?.[currentNetwork];
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

export const getLoginCache = async () => {
  let loginCache = await getStoredState(loginPersistConfig);
  if (!loginCache) loginCache = getDefaultState().loginCache;
  return loginCache as LoginState;
};

export const getLoginAccount = async () => {
  const loginCache = await getLoginCache();
  return loginCache.loginAccount;
};
