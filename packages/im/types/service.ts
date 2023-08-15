import { ChannelMemberInfo, ChannelTypeEnum, Message } from '.';

export type IMServiceCommon<T> = Promise<{
  code: string;
  message: string;
  data: T;
}>;

export type MessageListParams = {
  channelUuid: string;
  maxCreateAt: number;
  toRelationId?: string;
  limit?: number;
};

export type MessageReadParams = {
  channelUuid: string;
  total: number;
};

export type VerifySignatureParams = {
  message: string;
  signature: string;
  address: string;
  caHash: string;
};

export type VerifySignatureResult = {
  token: string;
};

export type GetAuthTokenParams = {
  addressAuthToken: string;
  inviteCode?: '';
};

export type GetAuthTokenResult = {
  token: string;
};

export type GetUserInfoParams = {
  address?: string;
  fields?: string[];
};

export type GetUserInfoDefaultResult = {
  avatar: string;
  name: string;
  relationId: string;
};

export type CreateChannelParams = {
  name: string;
  type: ChannelTypeEnum;
  members: string[];
};

export type CreateChannelResult = {
  channelUuid: string;
};

export type GetChannelInfoParams = {
  channelUuid: string;
};
export type GetChannelMembersParams = GetChannelInfoParams;

export type GetChannelInfoResult = {
  uuid: string;
  name: string;
  icon: string;
  announcement: string;
  pinAnnouncement: boolean;
  openAccess: boolean;
  type: ChannelTypeEnum;
  mute: boolean;
  pin: boolean;
  members: ChannelMemberInfo[];
};

export interface IIMService {
  verifySignature(params: VerifySignatureParams): IMServiceCommon<VerifySignatureResult>;
  getAuthToken(params: GetAuthTokenParams): IMServiceCommon<GetAuthTokenResult>;
  getUserInfo<T = GetUserInfoDefaultResult>(params: GetUserInfoParams): IMServiceCommon<T>;
  createChannel(params: CreateChannelParams): IMServiceCommon<CreateChannelResult>;
  getChannelInfo(params: GetChannelInfoParams): IMServiceCommon<GetChannelInfoResult>;
  getChannelMembers(params: GetChannelMembersParams): IMServiceCommon<ChannelMemberInfo[]>;

  messageList(params: MessageListParams): IMServiceCommon<Message[]>;
  messageRead(params: MessageReadParams): IMServiceCommon<null>;
}
