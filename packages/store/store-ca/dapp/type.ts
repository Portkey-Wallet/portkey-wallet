import { NetworkType } from '@portkey-wallet/types';

export type DappStoreItem = {
  origin: string;
  name?: string;
  icon?: string;
};

export interface IDappStoreState {
  dappMap: { [key in NetworkType]?: DappStoreItem[] };
}
