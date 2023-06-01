import { NetworkType } from '@portkey-wallet/types';

export type DappStoreItem = {
  name?: string;
  icon?: string;
  origin?: string;
};

export interface IDappStoreState {
  dappMap: { [key in NetworkType]?: DappStoreItem[] };
}
