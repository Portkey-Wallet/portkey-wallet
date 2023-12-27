import { Message } from '@portkey-wallet/im';
import { IMessage } from 'react-native-gifted-chat';

export type ImageInfo = {
  width?: string;
  height?: string;
  imgUri?: string;
  thumbUri?: string;
};
export interface ChatMessage extends IMessage, Message {
  imageInfo?: ImageInfo;
  messageType?: Message['type'] | 'NOT_SUPPORTED';
  quote?: ChatMessage;
  rawMessage?: Message;
}

export enum GroupRedPacketTabEnum {
  Random = 'Random',
  Fixed = 'Fixed',
}
