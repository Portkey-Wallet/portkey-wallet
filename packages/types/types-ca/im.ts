import { Message } from '@portkey-wallet/im';

export enum MessageStatusEnum {
  SENDING = 'sending',
  SENT = 'sent',
  FAILED = 'FAILED',
}

export type MessageWithStatus = Message & {
  status?: MessageStatusEnum;
};
