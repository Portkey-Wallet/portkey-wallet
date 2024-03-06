import { CACommonState } from './store';
import { Accounts, ChainIds, ChainsInfo, WalletName } from '@portkey/provider-types';
import { DappStoreItem } from '@portkey-wallet/store/store-ca/dapp/type';
import { ChainId, NetworkType } from '../index';
import { ChainItemType } from '@portkey-wallet/store/store-ca/wallet/type';
import { CAInfo } from './wallet';
import { SessionInfo } from '../session';
import { Address } from '../wallet';
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
  caHash(): Promise<string>;
  walletName(): Promise<WalletName>;
  currentManagerAddress(): Promise<Address | undefined>;
  getSessionInfo(origin: string): Promise<SessionInfo | undefined>;
  getRememberMeBlackList(): Promise<string[] | undefined>;
  getOriginChainId(): Promise<ChainId>;
  updateManagerSyncState(chainId: ChainId): Promise<void>;
}
export interface IDappManagerStore<T = CACommonState> {
  getState(): Promise<T>;
  dispatch: any;
}

export type DappManagerOptions<T = IDappManagerStore> = {
  store: T;
};
