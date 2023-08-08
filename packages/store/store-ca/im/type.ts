import { ChannelItem } from '@portkey-wallet/im/types';
import { NetworkType } from '@portkey-wallet/types';

export type ChannelList = {
  list: ChannelItem[];
  cursor: string;
};

export interface IMStateType {
  hasNextNetMap: {
    [T in NetworkType]?: boolean;
  };
  channelListNetMap: {
    [T in NetworkType]?: ChannelList;
  };
}
