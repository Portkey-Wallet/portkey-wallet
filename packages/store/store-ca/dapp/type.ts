import { NetworkType } from '@portkey-wallet/types';
import { SessionInfo } from '@portkey-wallet/types/session';

export type DappStoreItem = {
  origin: string;
  name?: string;
  icon?: string;
  sessionInfo?: SessionInfo;
};

export interface IDappStoreState {
  dappMap: { [key in NetworkType]?: DappStoreItem[] };
}
