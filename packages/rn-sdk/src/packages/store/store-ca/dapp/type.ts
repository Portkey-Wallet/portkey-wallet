import { NetworkType, Timestamp } from 'packages/types';
import { SessionInfo } from 'packages/types/session';

export type DappStoreItem = {
  origin: string;
  name?: string;
  icon?: string;
  sessionInfo?: SessionInfo;
  connectedTime?: Timestamp;
};

export interface IDappStoreState {
  dappMap: { [key in NetworkType]?: DappStoreItem[] };
}
