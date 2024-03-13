export type MessageType = 'TEXT' | 'IMAGE';
export type ParsedContent = string | ParsedImage;
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
};

export type SocketMessage = Message & {
  mute: boolean;
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
  lastMessageType: MessageType | null;
  lastMessageContent: string | null;
  lastPostAt: string | null;
  mute: boolean;
  pin: boolean;
  toRelationId: string;
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

export type ChainId = 'AELF' | 'tDVV' | 'tDVW';

export interface AddressItem {
  chainId: ChainId; // AELF tDVV tDVW
  chainName?: string;
  address: string;
  image?: string;
}

export interface CaHolderInfo {
  userId?: string;
  caHash?: string;
  walletName?: string;
}

export interface IImInfo {
  relationId?: string;
  portkeyId?: string;
  name?: string;
}

export type ContactItemType = {
  id: string;
  index: string;
  name: string;
  avatar?: string;
  addresses: AddressItem[];
  modificationTime: number;
  isDeleted: boolean;
  userId: string;
  caHolderInfo?: CaHolderInfo;
  imInfo?: IImInfo;
  isImputation?: boolean;
};
