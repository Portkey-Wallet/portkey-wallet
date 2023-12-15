export type MessageType = 'TEXT' | 'IMAGE' | 'SYS';
export type ParsedContent = string | ParsedImage | undefined;
export type ParsedImage = {
  type: string;
  action: string;
  imgUrl: string;
  s3Key: string;
  thumbImgUrl?: string;
  thumbS3Key?: string;
  width?: string;
  height?: string;
};

export type Message = {
  channelUuid: string;
  sendUuid: string;
  type: MessageType;
  content: string;
  createAt: string;
  from: string;
  fromAvatar?: string;
  fromName?: string;

  id?: string;
  quote?: Message;
  parsedContent?: ParsedContent;
  unidentified?: boolean | undefined;

  pinner?: string;
  pinnerName?: string;
  pinnedAt?: string;
};

export type SocketMessage = Message & {
  mute: boolean;
  channelType: ChannelTypeEnum;
};

export type ChannelMemberInfo = {
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
  members: ChannelMemberInfo[];
  mute: boolean;
  pin: boolean;
};

export enum ChannelStatusEnum {
  NORMAL = 0,
  LEFT = 1,
  BE_REMOVED = 2,
  DISBAND = 3,
}
export type ChannelItem = {
  status: ChannelStatusEnum;
  channelUuid: string;
  displayName: string;
  channelIcon: string;
  channelType?: ChannelTypeEnum;
  unreadMessageCount: number;
  mentionsCount: number;
  lastMessageType: MessageType | null;
  lastMessageContent: string | null;
  lastPostAt: string | null;
  mute: boolean;
  pin: boolean;
  pinAt: string;
  toRelationId?: string;
};

export enum IMStatusEnum {
  INIT = 'init',
  AUTHORIZING = 'authorizing',
  AUTHORIZED = 'authorized',
  CONNECTED = 'connected',
  ERROR = 'error',
  DESTROY = 'destroy',
}

export type MessageCount = {
  unreadCount: number;
  mentionsCount: number;
};

export enum TriggerMessageEventActionEnum {
  ENTER_CHANNEL = 1,
  EXIT_CHANNEL = 2,
}

export type GroupMemberItemType = {
  relationId: string;
  name: string;
  avatar: string;
  isAdmin: boolean;
};
