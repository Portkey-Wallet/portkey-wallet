import { NetworkType, Timestamp } from '@portkey-wallet/types';
import { SessionInfo } from '@portkey-wallet/types/session';
import { IconName } from 'components/Svg';

export type DappStoreItem = {
  origin: string;
  name?: string;
  icon?: string;
  svgIcon?: IconName;
  sessionInfo?: SessionInfo;
  connectedTime?: Timestamp;
};

export interface IDappStoreState {
  dappMap: { [key in NetworkType]?: DappStoreItem[] };
}
