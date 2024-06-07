import { ContactItemType, IContactProfile } from '@portkey-wallet/types/types-ca/contact';
import {
  ChainId,
  ChannelInfo,
  ChannelItem,
  ChannelMemberInfo,
  ChannelTypeEnum,
  IChannelContactItem,
  Message,
  MessageCount,
  RedPackageConfigType,
  RedPackageCreationStatusEnum,
  RedPackageDetail,
  RedPackageGrabInfoItem,
  RedPackageStatusEnum,
  RedPackageTypeEnum,
  TransferStatusEnum,
  TransferTypeEnum,
  TriggerMessageEventActionEnum,
} from '.';
import { RequireAtLeastOne } from '@portkey-wallet/types/common';
import { IM_PIN_LIST_SORT_TYPE_ENUM } from '../constant';
import { AssetType } from '@portkey-wallet/constants/constants-ca/assets';
import { ReportMessageEnum } from '@portkey-wallet/constants/constants-ca/chat';
import { ICaAddressInfoListItemType } from '@portkey-wallet/hooks/hooks-ca/wallet';

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

export type GetUserInfoListParams = {
  keywords?: string;
  fields?: string[];
};

export type GetUserInfoDefaultResult = {
  avatar?: string;
  name: string;
  relationId: string;
  portkeyId?: string;
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
  channelIcon?: string;
  members: string[];
};

export type CreateChannelResult = {
  channelUuid: string;
};

export type GetChannelInfoParams = {
  channelUuid: string;
  skipCount?: number;
  maxResultCount?: number;
};

export type GetChannelMembersParams = GetChannelInfoParams;
export type getCannelContactsParams = {
  channelUuid: string;
  skipCount?: number;
  maxResultCount?: number;
  keyword?: string;
};

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

export type SearchChannelMembersParams = {
  channelUuid?: string;
  keyword?: string;
  skipCount?: number;
  maxResultCount?: number;
  filteredMember?: string;
};

export type SearchChannelMembersResult = { members: ChannelMemberInfo[]; totalCount: number };

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

export type TDeleteMessageByGroupOwnerParams = {
  channelUuid: string;
  messageId: string;
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
  channelUuid?: string;
};

export type ChannelItemResult = ChannelItem & {
  lastMessageContent: string | null;
};

export type GetChannelListResult = {
  totalCount: number;
  cursor: string;
  list: ChannelItemResult[];
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

export type UpdateChannelInfoParams = {
  channelUuid: string;
  channelName: string;
  channelIcon?: string;
};

export type JoinChannelParams = {
  channelUuid: string;
};

export type CreateRedPackageParams = {
  chainId: ChainId;
  symbol: string;
};

export type CreateRedPackageResult = {
  id: string;
  publicKey: string;
  chainId: ChainId;
  minAmount: string;
  symbol: string;
  decimal: string | number;
  expireTime: string;
  redPackageContractAddress: string;
};

export type SendRedPackageParams = {
  id: string;
  totalAmount: string;
  type: RedPackageTypeEnum;
  count: number;
  chainId: ChainId;
  symbol: string;
  memo: string;
  channelUuid: string;
  rawTransaction: string;
  message: string;
  assetType: AssetType;
};

export type SendRedPackageResult = {
  sessionId: string;
};

export type GetRedPackageCreationStatusParams = SendRedPackageResult;

export type GetRedPackageCreationStatusResult = {
  status: RedPackageCreationStatusEnum;
  message: string;
  TransactionId: string;
  TransactionResult: string;
};

export type GetRedPackageDetailParams = {
  id: string;
  skipCount: number;
  maxResultCount: number;
};

export type GetRedPackageDetailResult = RedPackageDetail & {
  items: RedPackageGrabInfoItem[];
};

export type GetCryptoGiftHistoriesResult = RedPackageDetail[];

export type GrabRedPackageParams = {
  id: string;
  channelUuid: string;
};

export enum GrabRedPackageResultEnum {
  SUCCESS = 1,
  FAIL = 2,
}
export type GrabRedPackageResult = {
  result: GrabRedPackageResultEnum;
  errorMessage: string;
  amount: string;
  decimal: string | number;
  viewStatus: RedPackageStatusEnum;
};

export type GetRedPackageConfigParams = {
  chainId?: ChainId;
  token?: string;
};

export type SendTransferParams = {
  type: TransferTypeEnum;
  toUserId?: string;
  chainId: ChainId;
  channelUuid?: string;
  rawTransaction: string;
  message: string;
};
export type SendTransferResult = {
  transferId: string;
};

export type GetTransferStatusParams = {
  transferId: string;
};

export type GetTransferStatusResult = {
  status: TransferStatusEnum;
  message?: string;
  transactionId: string;
  transactionResult: string;
  blockHash: string;
  channelUuid: string;
};

export type GetPinListParams = {
  channelUuid: string;
  sortType: IM_PIN_LIST_SORT_TYPE_ENUM;
  ascending: boolean;
  maxResultCount: number;
  skipCount: number;
};
export type GetPinListResult = {
  data: Message[];
  totalCount: number;
};

export type UnPinParams = {
  id: string;
  channelUuid: string;
};

export type UnPinAllParams = {
  channelUuid: string;
};

export type TBlockUserParams = {
  relationId: string;
};
export type TUnBlockUserParams = TBlockUserParams;
export type TCheckIsBlockedParams = TBlockUserParams;

export type TReportMessageParams = {
  userId: string;
  reportedRelationId: string;
  userCaAddressInfos: ICaAddressInfoListItemType[];
  channelUuid?: string;
  reportType: ReportMessageEnum;
  message: string;
  messageId: string;
  description?: string; // if is other report type , this is required
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
  getUserInfoList<T = GetUserInfoDefaultResult>(params?: GetUserInfoListParams): IMServiceCommon<T[]>;

  createChannel(params: CreateChannelParams): IMServiceCommon<CreateChannelResult>;
  getChannelInfo(params: GetChannelInfoParams): IMServiceCommon<
    Omit<ChannelInfo, 'members' | 'totalCount'> & {
      memberInfos: {
        members: ChannelMemberInfo[];
        totalCount: number;
      };
    }
  >;

  getChannelMembers(params: GetChannelMembersParams): IMServiceCommon<ChannelMemberInfo[]>;
  getChannelContacts(params: getCannelContactsParams): IMServiceCommon<{
    contacts: IChannelContactItem[];
    totalCount: number;
  }>;

  searchChannelMembers(params: SearchChannelMembersParams): IMServiceCommon<SearchChannelMembersResult>;

  sendMessage(params: SendMessageParams): IMServiceCommon<SendMessageResult>;
  readMessage(params: ReadMessageParams): IMServiceCommon<number>;
  getMessageList(params: GetMessageListParams): IMServiceCommon<Message[]>;
  deleteMessage(params: DeleteMessageParams): IMServiceCommon<null>;
  deleteMessageByGroupOwner(params: TDeleteMessageByGroupOwnerParams): IMServiceCommon<null>;
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
  updateChannelInfo(params: UpdateChannelInfoParams): IMServiceCommon<null>;
  joinChannel(params: JoinChannelParams): IMServiceCommon<null>;

  addStranger(params: AddStrangerParams): IMServiceCommon<ContactItemType>;
  getProfile(
    params: RequireAtLeastOne<GetProfileParams, 'id' | 'portkeyId' | 'relationId'>,
  ): IMServiceCommon<IContactProfile>;

  createRedPackage(params: CreateRedPackageParams): IMServiceCommon<CreateRedPackageResult>;
  sendRedPackage(params: SendRedPackageParams): IMServiceCommon<SendRedPackageResult>;
  getRedPackageCreationStatus(
    params: GetRedPackageCreationStatusParams,
  ): IMServiceCommon<GetRedPackageCreationStatusResult>;
  getRedPackageDetail(params: GetRedPackageDetailParams): IMServiceCommon<GetRedPackageDetailResult>;
  grabRedPackage(params: GrabRedPackageParams): IMServiceCommon<GrabRedPackageResult>;
  getRedPackageConfig(params: GetRedPackageConfigParams): IMServiceCommon<RedPackageConfigType>;

  sendTransfer(params: SendTransferParams): IMServiceCommon<SendTransferResult>;
  getTransferStatus(params: GetTransferStatusParams): IMServiceCommon<GetTransferStatusResult>;

  getPinList(params: GetPinListParams): IMServiceCommon<GetPinListResult>;
  setPin(params: Message): IMServiceCommon<null>;
  unPin(params: UnPinParams): IMServiceCommon<null>;
  unPinAll(params: UnPinAllParams): IMServiceCommon<null>;
  blockUser(params: TBlockUserParams): IMServiceCommon<null>;
  unBlockUser(params: TUnBlockUserParams): IMServiceCommon<null>;
  checkIsBlocked(params: TCheckIsBlockedParams): IMServiceCommon<null>;
  fetchBlockedList(): IMServiceCommon<string[]>;
  reportMessage(params: TReportMessageParams): IMServiceCommon<null>;
}
