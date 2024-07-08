export type MessageType = 'TEXT' | 'IMAGE' | 'SYS' | 'REDPACKAGE-CARD' | 'TRANSFER-CARD' | 'PIN-SYS';
export type ParsedContent = string | ParsedImage | ParsedRedPackage | ParsedTransfer | ParsedPinSys | undefined;
import { AssetType } from '@portkey-wallet/constants/constants-ca/assets';
import { PIN_OPERATION_TYPE_ENUM } from './pin';
import { RedPackageStatusInfo } from './redPackage';
import { ContactItemType, ContactType } from '@portkey-wallet/types/types-ca/contact';

export type ChainId = 'AELF' | 'tDVV' | 'tDVW';

export enum MessageTypeEnum {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  SYS = 'SYS',
  REDPACKAGE_CARD = 'REDPACKAGE-CARD',
  TRANSFER_CARD = 'TRANSFER-CARD',
  PIN_SYS = 'PIN-SYS',
}

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
export type ParsedRedPackage = {
  image: string;
  link: string;
  data: {
    id: string;
    senderId: string;
    memo: string;
    assetType?: AssetType;
    imageUrl?: string;
    alias?: string;
    tokenId?: string;
  };
};

export type ParsedTransfer = {
  image: string;
  link: string;
  data: {
    id: string;
    senderId: string;
    senderName: string;
    memo: string;
    transactionId: string;
    blockHash: string;
    toUserId: string;
    toUserName: string;
  };
  transferExtraData?: {
    tokenInfo?: {
      amount: string | number;
      decimal: string;
      symbol: string;
    };
    nftInfo?: {
      nftId: string;
      alias: string;
    };
  };
};

export type ParsedPinSys = {
  userInfo: {
    portkeyId: string;
    name: string;
  };
  pinType: PIN_OPERATION_TYPE_ENUM;
  messageType: MessageType;
  content: string;
  messageId: string;
  sendUuid: string;

  unpinnedCount?: number;
  parsedContent?: ParsedContent;
};

export type PinInfoType = {
  pinner: string;
  pinnerName: string;
  pinnedAt: string;
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
  isOwner?: boolean;

  id?: string;
  quote?: Message;
  parsedContent?: ParsedContent;
  unidentified?: boolean | undefined;

  redPackage?: RedPackageStatusInfo;
  pinInfo?: PinInfoType;
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
  userId?: string;
  addresses?: {
    chainId: ChainId;
    chainName?: string;
    address: string;
  }[];
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
  totalCount: number;
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
  lastMessageContent: ParsedContent | null;
  lastPostAt: string | null;
  mute: boolean;
  pin: boolean;
  pinAt: string;
  toRelationId?: string;
  redPackage?: RedPackageStatusInfo;
  contactType?: ContactType;
  botChannel?: boolean;
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

export type IChannelContactItem = ContactItemType & { isGroupMember: boolean };

export type RedPackageTokenInfo = {
  chainId: ChainId;
  symbol: string;
  decimal: string | number;
  minAmount: string;
};
export type RedPackageContractAddressInfo = {
  chainId: ChainId;
  contractAddress: string;
};

export type RedPackageConfigType = {
  tokenInfo: RedPackageTokenInfo[];
  redPackageContractAddress: RedPackageContractAddressInfo[];
};

export * from './service';
export * from './redPackage';
export * from './transfer';
