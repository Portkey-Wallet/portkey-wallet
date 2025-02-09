import { EOACommonState } from './store';
import { Accounts, ChainIds, ChainsInfo, WalletName } from '@portkey/provider-types';
import { DappStoreItem } from '@portkey-wallet/store/store-eoa/dapp/type';
import { ChainId, NetworkType } from '../index';
import { SessionInfo } from '../session';
import { Address } from '../wallet';
import { IChainItemType } from './chain';
export interface IDappManager<T = EOACommonState> {
  getState(): Promise<T>;
  isLogged(): Promise<boolean>;
  originIsAuthorized(origin: string): Promise<boolean>;
  isActive(origin: string): Promise<boolean>;
  accounts(origin: string): Promise<Accounts>;
  chainId(): Promise<ChainIds>;
  chainIds(): Promise<ChainIds>;
  chainsInfo(): Promise<ChainsInfo>;
  getChainInfo(chainId: ChainId): Promise<IChainItemType | undefined>;
  addDapp(dapp: DappStoreItem): Promise<void>;
  updateDapp(dapp: DappStoreItem): Promise<void>;
  isLocked(): Promise<boolean>;
  getRpcUrl(chainId: ChainId): Promise<string | undefined>;
  networkType(): Promise<NetworkType>;
  caHash(): Promise<string>;
  walletName(): Promise<WalletName>;
  currentManagerAddress(): Promise<Address | undefined>;
  getSessionInfo(origin: string): Promise<SessionInfo | undefined>;
  getRememberMeBlackList(): Promise<string[] | undefined>;
  getOriginChainId(): Promise<ChainId>;
  updateManagerSyncState(chainId: ChainId): Promise<void>;
}
export interface IDappManagerStore<T = EOACommonState> {
  getState(): Promise<T>;
  dispatch: any;
}

export type DappManagerOptions<T = IDappManagerStore> = {
  store: T;
};
