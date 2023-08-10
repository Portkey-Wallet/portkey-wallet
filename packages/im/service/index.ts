import { IBaseRequest } from '@portkey/types';
import { BaseService } from '@portkey/services';
import { IIMService } from '../types/service';
import { Message } from '../types';

export class IMService<T extends IBaseRequest = IBaseRequest> extends BaseService<T> implements IIMService {
  constructor(request: T) {
    super(request);
  }
  messageList(params: {
    channelUuid: string;
    maxCreateAt: number;
    toRelationId?: string | undefined;
    limit?: number | undefined;
  }): Promise<{ code: string; message: string; data: Message[] }> {
    throw new Error('Method not implemented.');
  }
  messageRead(params: { channelUuid: string; total: number }): Promise<{ code: string; message: string; data: null }> {
    throw new Error('Method not implemented.');
  }
}
