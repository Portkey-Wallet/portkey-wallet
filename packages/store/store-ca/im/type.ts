import { ChannelInfo, ChannelItem, Message, RedPackageConfigType } from '@portkey-wallet/im/types';
import { NetworkType } from '@portkey-wallet/types';

export type ChannelList = {
  list: ChannelItem[];
  cursor: string;
};

export type ChannelMessageList = {
  [channelId: string]: Message[];
};

export interface IMStateType {
  hasNextNetMap: {
    [T in NetworkType]?: boolean;
  };
  channelListNetMap: {
    [T in NetworkType]?: ChannelList;
  };
  channelMessageListNetMap?: {
    [T in NetworkType]?: ChannelMessageList;
  };
  relationIdNetMap: {
    [T in NetworkType]?: string;
  };
  relationTokenNetMap: {
    [T in NetworkType]?: string;
  };
  groupInfoMapNetMap?: {
    [T in NetworkType]?: {
      [channelId: string]: ChannelInfo;
    };
  };
  redPackageConfigMap?: {
    [T in NetworkType]?: RedPackageConfigType;
  };
  pinListNetMap?: {
    [T in NetworkType]?: {
      [channelId: string]: {
        list: Message[];
        fetchTime: number;
      };
    };
  };
  lastPinNetMap?: {
    [T in NetworkType]?: {
      [channelId: string]: {
        message: Message;
        fetchTime: number;
      };
    };
  };
}

export enum UpdateChannelAttributeTypeEnum {
  UPDATE_UNREAD_CHANNEL = 'updateUnreadChannel',
}
