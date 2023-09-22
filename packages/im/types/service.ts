import { ContactItemType, IContactProfile } from '@portkey-wallet/types/types-ca/contact';
import {
  ChannelInfo,
  ChannelItem,
  ChannelMemberInfo,
  ChannelTypeEnum,
  Message,
  MessageCount,
  TriggerMessageEventActionEnum,
} from '.';
import { RequireAtLeastOne } from '@portkey-wallet/types/common';

export type IMServiceCommon<T> = Promise<{
  code: string;
  message: string;
  data: T;
}>;

export type VerifySignatureParams = {
  message: string;
  signature: string;
  address: string;
  caHash: string;
};

export type VerifySignatureLoopParams = () => VerifySignatureParams | null;

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
  portkeyId: string;
};

export type GetOtherUserInfoDefaultResult = {
  avatar: string;
  name: string;
  relationId: string;
  portKeyId: string;
  createdAt: string;
  followCount: string;
  addressWithChain: { address: string; chainName: string }[];
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

export type SendMessageParams = {
  channelUuid?: string;
  toRelationId?: string;
  type?: string;
  content: string;
  sendUuid: string;
  quoteId?: string;
  mentionedUser?: string[];
};

export type SendMessageResult = {
  id: string;
  channelUuid: string;
};

export type ReadMessageParams = {
  channelUuid: string;
  total: number;
};

export type GetMessageListParams = {
  channelUuid: string;
  maxCreateAt: number;
  toRelationId?: string;
  limit?: number;
};

export type DeleteMessageParams = {
  id: string;
};

export type TriggerMessageEvent = {
  channelUuid?: string;
  toRelationId?: string;
  fromRelationId: string;
  action: TriggerMessageEventActionEnum;
};

export type GetChannelListParams = {
  keyword?: string;
  cursor?: string;
  skipCount?: number;
  maxResultCount?: number;
};

export type GetChannelListResult = {
  totalCount: number;
  cursor: string;
  list: ChannelItem[];
};

export type UpdateChannelPinParams = {
  channelUuid: string;
  pin: boolean;
};

export type UpdateChannelMuteParams = {
  channelUuid: string;
  mute: boolean;
};

export type HideChannelParams = {
  channelUuid: string;
};

export type AddStrangerParams = {
  relationId: string;
};

export type GetProfileParams = {
  portkeyId?: string;
  relationId?: string;
  id?: string;
};

export type DisbandChannelParams = {
  channelUuid: string;
};

export type TransferChannelOwnerParams = {
  channelUuid: string;
  relationId: string;
};

export type AddChannelMembersParams = {
  channelUuid: string;
  members: string[];
};

export type RemoveChannelMembersParams = {
  channelUuid: string;
  members: string[];
};

export type LeaveChannelParams = {
  channelUuid: string;
};

export type UpdateChannelNameParams = {
  channelUuid: string;
  channelName: string;
};

export interface IIMService {
  verifySignature(params: VerifySignatureParams): IMServiceCommon<VerifySignatureResult>;
  verifySignatureLoop(
    params: VerifySignatureLoopParams,
    checkIsContinue: () => boolean,
    times?: number,
  ): IMServiceCommon<VerifySignatureResult>;
  getAuthToken(params: GetAuthTokenParams): IMServiceCommon<GetAuthTokenResult>;
  getAuthTokenLoop(
    params: GetAuthTokenParams,
    checkIsContinue: () => boolean,
    times?: number,
  ): IMServiceCommon<GetAuthTokenResult>;
  getUserInfo<T = GetUserInfoDefaultResult>(params?: GetUserInfoParams): IMServiceCommon<T>;

  createChannel(params: CreateChannelParams): IMServiceCommon<CreateChannelResult>;
  getChannelInfo(params: GetChannelInfoParams): IMServiceCommon<ChannelInfo>;
  getChannelMembers(params: GetChannelMembersParams): IMServiceCommon<ChannelMemberInfo[]>;

  sendMessage(params: SendMessageParams): IMServiceCommon<SendMessageResult>;
  readMessage(params: ReadMessageParams): IMServiceCommon<number>;
  getMessageList(params: GetMessageListParams): IMServiceCommon<Message[]>;
  deleteMessage(params: DeleteMessageParams): IMServiceCommon<null>;
  getUnreadCount(): IMServiceCommon<MessageCount>;
  triggerMessageEvent(params: TriggerMessageEvent): IMServiceCommon<null>;

  getChannelList(params: GetChannelListParams): IMServiceCommon<GetChannelListResult>;
  updateChannelPin(params: UpdateChannelPinParams): IMServiceCommon<null>;
  updateChannelMute(params: UpdateChannelMuteParams): IMServiceCommon<null>;
  hideChannel(params: HideChannelParams): IMServiceCommon<null>;
  disbandChannel(params: DisbandChannelParams): IMServiceCommon<null>;
  transferChannelOwner(params: TransferChannelOwnerParams): IMServiceCommon<null>;
  addChannelMembers(params: AddChannelMembersParams): IMServiceCommon<null>;
  removeChannelMembers(params: RemoveChannelMembersParams): IMServiceCommon<null>;
  leaveChannel(params: LeaveChannelParams): IMServiceCommon<null>;
  updateChannelName(params: UpdateChannelNameParams): IMServiceCommon<null>;

  addStranger(params: AddStrangerParams): IMServiceCommon<ContactItemType>;
  getProfile(
    params: RequireAtLeastOne<GetProfileParams, 'id' | 'portkeyId' | 'relationId'>,
  ): IMServiceCommon<IContactProfile>;
}
