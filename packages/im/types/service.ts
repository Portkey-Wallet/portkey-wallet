import { Message } from '.';

type IMServiceCommon<T> = Promise<{
  code: string;
  message: string;
  data: T;
}>;

type MessageListParams = {
  channelUuid: string;
  maxCreateAt: number;
  toRelationId?: string;
  limit?: number;
};

type MessageReadParams = {
  channelUuid: string;
  total: number;
};

export interface IIMService {
  messageList(params: MessageListParams): IMServiceCommon<Message[]>;
  messageRead(params: MessageReadParams): IMServiceCommon<null>;
}
