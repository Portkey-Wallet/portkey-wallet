import { NetworkType, Timestamp } from '@portkey-wallet/types';
import { SessionInfo } from '@portkey-wallet/types/session';

export type DappStoreItem = {
  origin: string;
  name?: string;
  icon?: string;
  svgIcon?: string;
  sessionInfo?: SessionInfo;
  connectedTime?: Timestamp;
};

export interface IDappStoreState {
  dappMap: { [key in NetworkType]?: DappStoreItem[] };
}
