import { IBaseRequest } from '@portkey/types';
import { BaseService } from '@portkey/services';
import {
  CreateChannelParams,
  CreateChannelResult,
  GetAuthTokenParams,
  GetAuthTokenResult,
  GetChannelInfoParams,
  GetChannelInfoResult,
  GetUserInfoDefaultResult,
  GetUserInfoParams,
  IIMService,
  IMServiceCommon,
  MessageListParams,
  MessageReadParams,
  VerifySignatureParams,
  VerifySignatureResult,
} from '../types/service';
import { ChannelMemberInfo, Message } from '../types';

export class IMService<T extends IBaseRequest = IBaseRequest> extends BaseService<T> implements IIMService {
  constructor(request: T) {
    super(request);
  }
  verifySignature(params: VerifySignatureParams): IMServiceCommon<VerifySignatureResult> {
    throw new Error('Method not implemented.');
  }
  getAuthToken(params: GetAuthTokenParams): IMServiceCommon<GetAuthTokenResult> {
    throw new Error('Method not implemented.');
  }
  getUserInfo<T = GetUserInfoDefaultResult>(params: GetUserInfoParams): IMServiceCommon<T> {
    throw new Error('Method not implemented.');
  }
  createChannel(params: CreateChannelParams): IMServiceCommon<CreateChannelResult> {
    throw new Error('Method not implemented.');
  }
  getChannelInfo(params: GetChannelInfoParams): IMServiceCommon<GetChannelInfoResult> {
    throw new Error('Method not implemented.');
  }
  getChannelMembers(params: GetChannelInfoParams): IMServiceCommon<ChannelMemberInfo[]> {
    throw new Error('Method not implemented.');
  }
  messageList(params: MessageListParams): IMServiceCommon<Message[]> {
    throw new Error('Method not implemented.');
  }
  messageRead(params: MessageReadParams): IMServiceCommon<null> {
    throw new Error('Method not implemented.');
  }
}
