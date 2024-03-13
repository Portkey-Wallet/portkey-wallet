import { IBaseRequest } from '@portkey/types';
import { BaseService } from '@portkey/services';
import {
  AddStrangerParams,
  CreateChannelParams,
  CreateChannelResult,
  DeleteMessageParams,
  GetAuthTokenParams,
  GetAuthTokenResult,
  GetChannelInfoParams,
  GetChannelInfoResult,
  GetChannelListParams,
  GetChannelListResult,
  GetMessageListParams,
  GetProfileParams,
  GetUserInfoDefaultResult,
  GetUserInfoParams,
  HideChannelParams,
  IIMService,
  IMServiceCommon,
  ReadMessageParams,
  SendMessageParams,
  SendMessageResult,
  TriggerMessageEvent,
  UpdateChannelMuteParams,
  UpdateChannelPinParams,
  VerifySignatureLoopParams,
  VerifySignatureParams,
  VerifySignatureResult,
} from '../types/service';
import { ChannelMemberInfo, ContactItemType, Message, MessageCount } from '../types';
import { sleep } from 'packages/utils';

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
    if (times <= 0) await sleep(1000);
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
    if (times <= 0) await sleep(1000);
    return this.getAuthTokenLoop(params, checkIsContinue, times - 1);
  }

  getUserInfo<R = GetUserInfoDefaultResult>(params: GetUserInfoParams): IMServiceCommon<R> {
    return this._request.send({
      url: '/api/v1/users/userInfo',
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
  getChannelInfo(params: GetChannelInfoParams): IMServiceCommon<GetChannelInfoResult> {
    return this._request.send({
      url: '/api/v1/channelContacts/channelDetailInfo',
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
  addStranger(params: AddStrangerParams): IMServiceCommon<ContactItemType> {
    return this._request.send({
      url: '/api/v1/contacts/stranger',
      params,
      method: 'POST',
    });
  }
  getProfile(params: GetProfileParams): IMServiceCommon<ContactItemType> {
    return this._request.send({
      url: '/api/v1/contacts/profile',
      params,
      method: 'GET',
    });
  }
}
