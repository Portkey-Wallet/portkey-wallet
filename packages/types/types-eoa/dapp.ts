import { EOACommonState } from './store';
import { Accounts, ChainIds, ChainsInfo, WalletName } from '@portkey/provider-types';
import { DappStoreItem } from '@portkey-wallet/store/store-eoa/dapp/type';
import { ChainId, NetworkType } from '../index';
import { SessionInfo } from '../session';
import { IChainItemType } from './chain';
export interface IDappManager<T = EOACommonState> {
  getState(): Promise<T>;
  isLogged(): Promise<boolean>;
  originIsAuthorized(origin: string): Promise<boolean>;
  isActive(origin: string): Promise<boolean>;
  accounts(origin: string): Promise<Accounts>;
  currentManagerAddress(): Promise<string | undefined>;
  chainId(): Promise<ChainIds>;
  chainIds(): Promise<ChainIds>;
  chainsInfo(): Promise<ChainsInfo>;
  getChainInfo(chainId: ChainId): Promise<IChainItemType | undefined>;
  addDapp(dapp: DappStoreItem): Promise<void>;
  updateDapp(dapp: DappStoreItem): Promise<void>;
  isLocked(): Promise<boolean>;
  getRpcUrl(chainId: ChainId): Promise<string | undefined>;
  networkType(): Promise<NetworkType>;
  walletName(): Promise<WalletName>;
  getSessionInfo(origin: string): Promise<SessionInfo | undefined>;
  getRememberMeBlackList(): Promise<string[] | undefined>;
}
export interface IDappManagerStore<T = EOACommonState> {
  getState(): Promise<T>;
  dispatch: any;
}

export type DappManagerOptions<T = IDappManagerStore> = {
  store: T;
};
