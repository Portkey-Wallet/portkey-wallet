import { NetworkType } from '@portkey-wallet/types';

export type DappStoreItem = {
  origin: string;
  name?: string;
  icon?: string;
  // Record the tabId of the dapp after opening the link
  tadIds?: string[];
};

export interface IDappStoreState {
  dappMap: { [key in NetworkType]?: DappStoreItem[] };
}
