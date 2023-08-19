import { IMessage } from 'react-native-gifted-chat';

export type ImageInfo = {
  width: string;
  height: string;
  imgUri: string;
  thumbUri: string;
};
export interface ChatMessage extends IMessage {
  imageInfo?: ImageInfo;
}
