export type MessageType = 'SYS' | 'TEXT' | 'CARD' | 'ANNOUNCEMENT' | 'BATCH_TRANSFER';
export type ParsedContent = string;

export type Message = {
  channelUuid: string;
  sendUuid: string;
  type: MessageType;
  content: string;
  createAt: string;
  from: string;
  fromAvatar?: string;
  fromName?: string;

  quote?: Message;
  parsedContent?: ParsedContent;
  unidentified?: boolean | undefined;
};

export type MemberInfo = {
  relationId: string;
  name: string;
  avatar: string;
  isAdmin: boolean;
};
export enum ChannelTypeEnum {
  GROUP = 'G',
  P2P = 'P',
}
export type ChannelInfo = {
  uuid: string;
  name: string;
  icon: string;
  announcement: string;
  pinAnnouncement: boolean;
  openAccess: boolean;
  type: ChannelTypeEnum;
  members: MemberInfo[];
  mute: boolean;
  pin: boolean;
};

export enum ChannelStatusEnum {
  NORMAL = 0,
  EXITED = 1,
  BE_REMOVED = 2,
  DISBAND = 3,
}
export type ChannelItem = {
  status: ChannelStatusEnum;
  channelUuid: string;
  displayName: string;
  channelIcon: string;
  channelType: ChannelTypeEnum;
  unreadMessageCount: number;
  mentionsCount: number;
  lastMessageType: MessageType;
  lastMessageContent: string;
  lastPostAt: string;
  mute: boolean;
  pin: boolean;
};

export enum IMStatusEnum {
  INIT = 'init',
  AUTHORIZING = 'authorizing',
  AUTHORIZED = 'authorized',
  CONNECTED = 'connected',
  ERROR = 'error',
}

export type MessageCount = {
  unreadCount: number;
  mentionsCount: number;
};
