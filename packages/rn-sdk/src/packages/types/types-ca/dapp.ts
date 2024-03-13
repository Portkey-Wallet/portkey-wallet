import { CACommonState } from './store';
import { Accounts, ChainIds, ChainsInfo, WalletName } from '@portkey/provider-types';
import { DappStoreItem } from 'packages/store/store-ca/dapp/type';
import { ChainId, NetworkType } from '../index';
import { ChainItemType } from 'packages/store/store-ca/wallet/type';
import { CAInfo } from './wallet';
import { SessionInfo } from '../session';
export interface IDappManager<T = CACommonState> {
  getState(): Promise<T>;
  isLogged(): Promise<boolean>;
  originIsAuthorized(origin: string): Promise<boolean>;
  isActive(origin: string): Promise<boolean>;
  accounts(origin: string): Promise<Accounts>;
  chainId(): Promise<ChainIds>;
  chainIds(): Promise<ChainIds>;
  chainsInfo(): Promise<ChainsInfo>;
  getChainInfo(chainId: ChainId): Promise<ChainItemType | undefined>;
  addDapp(dapp: DappStoreItem): Promise<void>;
  updateDapp(dapp: DappStoreItem): Promise<void>;
  isLocked(): Promise<boolean>;
  getRpcUrl(chainId: ChainId): Promise<string | undefined>;
  getCaInfo(chainId: ChainId): Promise<CAInfo | undefined>;
  networkType(): Promise<NetworkType>;
  walletName(): Promise<WalletName>;
  getSessionInfo(origin: string): Promise<SessionInfo | undefined>;
  getRememberMeBlackList(): Promise<string[] | undefined>;
}
export interface IDappManagerStore<T = CACommonState> {
  getState(): Promise<T>;
  dispatch: any;
}

export type DappManagerOptions<T = IDappManagerStore> = {
  store: T;
};
