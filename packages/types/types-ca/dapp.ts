import { CACommonState } from './store';
import { Accounts, ChainIds, ChainsInfo } from '@portkey/provider-types';
import { DappStoreItem } from '@portkey-wallet/store/store-ca/dapp/type';
export interface IDappManager {
  isLogged(): boolean;
  originIsAuthorized(origin: string): boolean;
  isActive(origin: string): boolean;
  accounts(origin: string): Accounts;
  chainId(): ChainIds;
  chainIds(): ChainIds;
  chainsInfo(): ChainsInfo;
  addDapp(dapp: DappStoreItem): void;
}
export type IDappManagerStore = {
  getState: () => CACommonState;
  dispatch: any;
};

export type DappManagerOptions = {
  store: IDappManagerStore;
};
