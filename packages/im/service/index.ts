import { IBaseRequest } from '@portkey/types';
import { BaseService } from '@portkey/services';
import {
  AddChannelMembersParams,
  AddStrangerParams,
  CreateChannelParams,
  CreateChannelResult,
  DeleteMessageParams,
  DisbandChannelParams,
  GetAuthTokenParams,
  GetAuthTokenResult,
  GetChannelInfoParams,
  GetChannelListParams,
  GetChannelListResult,
  GetMessageListParams,
  GetProfileParams,
  GetUserInfoDefaultResult,
  GetUserInfoListParams,
  GetUserInfoParams,
  HideChannelParams,
  IIMService,
  IMServiceCommon,
  JoinChannelParams,
  LeaveChannelParams,
  ReadMessageParams,
  RemoveChannelMembersParams,
  SendMessageParams,
  SendMessageResult,
  TransferChannelOwnerParams,
  TriggerMessageEvent,
  UpdateChannelMuteParams,
  UpdateChannelInfoParams,
  UpdateChannelPinParams,
  VerifySignatureLoopParams,
  VerifySignatureParams,
  VerifySignatureResult,
  CreateRedPackageParams,
  CreateRedPackageResult,
  GetRedPackageConfigParams,
  GetRedPackageCreationStatusResult,
  GetRedPackageDetailParams,
  GetRedPackageDetailResult,
  GrabRedPackageParams,
  GrabRedPackageResult,
  SendRedPackageParams,
  SendRedPackageResult,
  GetTransferStatusParams,
  GetTransferStatusResult,
  SendTransferParams,
  SendTransferResult,
  GetPinListParams,
  UnPinParams,
  GetPinListResult,
  UnPinAllParams,
  SearchChannelMembersParams,
  SearchChannelMembersResult,
} from '../types/service';
import {
  ChannelInfo,
  ChannelMemberInfo,
  IChannelContactItem,
  Message,
  MessageCount,
  RedPackageConfigType,
  TDeleteMessageByGroupOwnerParams,
} from '../types';
import { sleep } from '@portkey-wallet/utils';
import { ContactItemType, IContactProfile } from '@portkey-wallet/types/types-ca/contact';
import { RequireAtLeastOne } from '@portkey-wallet/types/common';

export class IMService<T extends IBaseRequest = IBaseRequest> extends BaseService<T> implements IIMService {
  constructor(request: T) {
    super(request);
  }

  verifySignature(params: VerifySignatureParams): IMServiceCommon<VerifySignatureResult> {
    return this._request.send({
      url: '/api/v1/users/token',
      params,
      method: 'POST',
      headers: {
        'R-Authorization': '',
      },
    });
  }
  async verifySignatureLoop(
    generateVerifyData: VerifySignatureLoopParams,
    checkIsContinue: () => boolean,
    times = 0,
  ): IMServiceCommon<VerifySignatureResult> {
    try {
      const params = generateVerifyData();
      if (params === null) throw new Error('VerifyData is null');
      return await this.verifySignature(params);
    } catch (error) {
      const isContinue = checkIsContinue();
      if (!isContinue) throw new Error('account changed');
      if (times === 1) throw error;
      console.log('verifySignatureLoop: error', error);
    }
    // if (times <= 0) await sleep(1000);
    await sleep(1000);
    return this.verifySignatureLoop(generateVerifyData, checkIsContinue, times - 1);
  }

  getAuthToken(params: GetAuthTokenParams): IMServiceCommon<GetAuthTokenResult> {
    return this._request.send({
      url: '/api/v1/users/auth',
      params,
      method: 'POST',
      headers: {
        'R-Authorization': '',
      },
    });
  }

  async getAuthTokenLoop(
    params: GetAuthTokenParams,
    checkIsContinue: () => boolean,
    times = 0,
  ): IMServiceCommon<GetAuthTokenResult> {
    try {
      return await this.getAuthToken(params);
    } catch (error) {
      const isContinue = checkIsContinue();
      if (!isContinue) throw new Error('account changed');
      if (times === 1) throw error;
      console.log('getAuthToken: error', error);
    }
    // if (times <= 0) await sleep(1000);
    await sleep(1000);
    return this.getAuthTokenLoop(params, checkIsContinue, times - 1);
  }

  getUserInfo<T = GetUserInfoDefaultResult>(params: GetUserInfoParams): IMServiceCommon<T> {
    return this._request.send({
      url: '/api/v1/users/userInfo',
      params,
      method: 'GET',
    });
  }
  getUserInfoList<T = GetUserInfoDefaultResult>(params?: GetUserInfoListParams | undefined): IMServiceCommon<T[]> {
    return this._request.send({
      url: '/api/v1/users/userInfo/list',
      params,
      method: 'GET',
    });
  }

  createChannel(params: CreateChannelParams): IMServiceCommon<CreateChannelResult> {
    return this._request.send({
      url: '/api/v1/channelContacts/createChannel',
      params,
      method: 'POST',
    });
  }
  getChannelInfo(params: GetChannelInfoParams): IMServiceCommon<
    Omit<ChannelInfo, 'members' | 'totalCount'> & {
      memberInfos: {
        members: ChannelMemberInfo[];
        totalCount: number;
      };
    }
  > {
    return this._request.send({
      url: '/api/v2/channelContacts/channelDetailInfo',
      params,
      method: 'GET',
    });
  }
  getChannelContacts(
    params: GetChannelInfoParams,
  ): IMServiceCommon<{ contacts: IChannelContactItem[]; totalCount: number }> {
    return this._request.send({
      url: '/api/v1/channelContacts/contacts',
      params,
      method: 'GET',
    });
  }
  searchChannelMembers(params: SearchChannelMembersParams): IMServiceCommon<SearchChannelMembersResult> {
    return this._request.send({
      url: '/api/v1/channelContacts/searchMembers',
      params,
      method: 'GET',
    });
  }
  getChannelMembers(params: GetChannelInfoParams): IMServiceCommon<ChannelMemberInfo[]> {
    return this._request.send({
      url: '/api/v1/channelContacts/members',
      params,
      method: 'GET',
    });
  }
  sendMessage(params: SendMessageParams): IMServiceCommon<SendMessageResult> {
    return this._request.send({
      url: '/api/v1/message/send',
      params,
      method: 'POST',
    });
  }
  readMessage(params: ReadMessageParams): IMServiceCommon<number> {
    return this._request.send({
      url: '/api/v1/message/read',
      params,
      method: 'POST',
    });
  }
  getMessageList(params: GetMessageListParams): IMServiceCommon<Message[]> {
    return this._request.send({
      url: '/api/v1/message/list',
      params,
      method: 'GET',
    });
  }
  deleteMessage(params: DeleteMessageParams): IMServiceCommon<null> {
    return this._request.send({
      url: '/api/v1/message/hide',
      params,
      method: 'POST',
    });
  }
  deleteMessageByGroupOwner(params: TDeleteMessageByGroupOwnerParams): IMServiceCommon<null> {
    return this._request.send({
      url: '/api/v1/message/hideByLeader',
      params,
      method: 'POST',
    });
  }
  getUnreadCount(): IMServiceCommon<MessageCount> {
    return this._request.send({
      url: '/api/v1/message/unreadCount',
      method: 'GET',
    });
  }
  triggerMessageEvent(params: TriggerMessageEvent): IMServiceCommon<null> {
    return this._request.send({
      url: '/api/v1/message/event',
      params,
      method: 'POST',
    });
  }
  getChannelList(params: GetChannelListParams): IMServiceCommon<GetChannelListResult> {
    return this._request.send({
      url: '/api/v1/feed/list',
      params,
      method: 'GET',
    });
  }
  updateChannelPin(params: UpdateChannelPinParams): IMServiceCommon<null> {
    return this._request.send({
      url: '/api/v1/feed/pin',
      params,
      method: 'POST',
    });
  }
  updateChannelMute(params: UpdateChannelMuteParams): IMServiceCommon<null> {
    return this._request.send({
      url: '/api/v1/feed/mute',
      params,
      method: 'POST',
    });
  }
  hideChannel(params: HideChannelParams): IMServiceCommon<null> {
    return this._request.send({
      url: '/api/v1/feed/hide',
      params,
      method: 'POST',
    });
  }
  disbandChannel(params: DisbandChannelParams): IMServiceCommon<null> {
    return this._request.send({
      url: '/api/v1/channelContacts/disband',
      params,
      method: 'POST',
    });
  }
  transferChannelOwner(params: TransferChannelOwnerParams): IMServiceCommon<null> {
    return this._request.send({
      url: '/api/v1/channelContacts/ownerTransfer',
      params,
      method: 'POST',
    });
  }
  addChannelMembers(params: AddChannelMembersParams): IMServiceCommon<null> {
    return this._request.send({
      url: '/api/v1/channelContacts/members/add',
      params,
      method: 'POST',
    });
  }
  removeChannelMembers(params: RemoveChannelMembersParams): IMServiceCommon<null> {
    return this._request.send({
      url: '/api/v1/channelContacts/members/remove',
      params,
      method: 'POST',
    });
  }
  leaveChannel(params: LeaveChannelParams): IMServiceCommon<null> {
    return this._request.send({
      url: '/api/v1/channelContacts/members/leave',
      params,
      method: 'POST',
    });
  }
  updateChannelInfo(params: UpdateChannelInfoParams): IMServiceCommon<null> {
    return this._request.send({
      url: '/api/v1/channelContacts/update',
      params,
      method: 'POST',
    });
  }
  joinChannel(params: JoinChannelParams): IMServiceCommon<null> {
    return this._request.send({
      url: '/api/v1/channelContacts/join',
      params,
      method: 'POST',
    });
  }

  addStranger(params: AddStrangerParams): IMServiceCommon<ContactItemType> {
    return this._request.send({
      url: '/api/v1/contacts/stranger',
      params,
      method: 'POST',
    });
  }
  getProfile(
    params: RequireAtLeastOne<GetProfileParams, 'id' | 'portkeyId' | 'relationId'>,
  ): IMServiceCommon<IContactProfile> {
    return this._request.send({
      url: '/api/v1/contacts/profile',
      params,
      method: 'GET',
    });
  }

  createRedPackage(params: CreateRedPackageParams): IMServiceCommon<CreateRedPackageResult> {
    return this._request.send({
      url: '/api/v1/redPackage/generate',
      params,
      method: 'POST',
    });
  }
  sendRedPackage(params: SendRedPackageParams): IMServiceCommon<SendRedPackageResult> {
    return this._request.send({
      url: '/api/v1/redPackage/send',
      params,
      method: 'POST',
    });
  }
  getRedPackageCreationStatus(params: SendRedPackageResult): IMServiceCommon<GetRedPackageCreationStatusResult> {
    return this._request.send({
      url: '/api/v1/redPackage/getCreationResult',
      params,
      method: 'GET',
    });
  }
  getRedPackageDetail(params: GetRedPackageDetailParams): IMServiceCommon<GetRedPackageDetailResult> {
    return this._request.send({
      url: '/api/v1/redPackage/detail',
      params,
      method: 'GET',
    });
  }
  grabRedPackage(params: GrabRedPackageParams): IMServiceCommon<GrabRedPackageResult> {
    return this._request.send({
      url: '/api/v1/redPackage/grab',
      params,
      method: 'POST',
    });
  }
  getRedPackageConfig(params: GetRedPackageConfigParams): IMServiceCommon<RedPackageConfigType> {
    return this._request.send({
      url: '/api/v1/redPackage/config',
      params,
      method: 'GET',
    });
  }

  sendTransfer(params: SendTransferParams): IMServiceCommon<SendTransferResult> {
    return this._request.send({
      url: '/api/v1/transfer/send',
      params,
      method: 'POST',
    });
  }
  getTransferStatus(params: GetTransferStatusParams): IMServiceCommon<GetTransferStatusResult> {
    return this._request.send({
      url: '/api/v1/transfer/getResult',
      params,
      method: 'GET',
    });
  }

  getPinList(params: GetPinListParams): IMServiceCommon<GetPinListResult> {
    return this._request.send({
      url: '/api/v1/pin/list',
      params,
      method: 'POST',
    });
  }
  setPin(params: Message): IMServiceCommon<null> {
    return this._request.send({
      url: '/api/v1/pin/add',
      params,
      method: 'POST',
    });
  }
  unPin(params: UnPinParams): IMServiceCommon<null> {
    return this._request.send({
      url: '/api/v1/pin/cancel',
      params,
      method: 'POST',
    });
  }
  unPinAll(params: UnPinAllParams): IMServiceCommon<null> {
    return this._request.send({
      url: '/api/v1/pin/cancelAll',
      params,
      method: 'POST',
    });
  }
}
