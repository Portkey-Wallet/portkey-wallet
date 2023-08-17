import { IBaseRequest } from '@portkey/types';
import { BaseService } from '@portkey/services';
import {
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
  VerifySignatureParams,
  VerifySignatureResult,
} from '../types/service';
import { ChannelMemberInfo, Message, MessageCount } from '../types';
import { IM_SUCCESS_CODE } from '../constant';
import { sleep } from '@portkey-wallet/utils';

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
  async verifySignatureLoop(params: VerifySignatureParams, times = 0): IMServiceCommon<VerifySignatureResult> {
    try {
      const result = await this.verifySignature(params);
      if (result.code === IM_SUCCESS_CODE) return result;
      if (times === 1) throw result;
    } catch (error) {
      console.log('verifySignatureLoop: error', error);
    }
    if (times <= 0) await sleep(1000);
    return this.verifySignatureLoop(params, times - 1);
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
  async getAuthTokenLoop(params: GetAuthTokenParams, times = 0): IMServiceCommon<GetAuthTokenResult> {
    try {
      const result = await this.getAuthToken(params);
      if (result.code === IM_SUCCESS_CODE) return result;
      if (times === 1) throw result;
    } catch (error) {
      console.log('getAuthToken: error', error);
    }
    if (times <= 0) await sleep(1000);
    return this.getAuthTokenLoop(params, times - 1);
  }

  getUserInfo<T = GetUserInfoDefaultResult>(params: GetUserInfoParams): IMServiceCommon<T> {
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
}
