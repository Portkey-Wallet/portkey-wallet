import { Message as IMMessage } from '@portkey-wallet/im/types';
import { ChatMessage } from '../types';

export const formatMessageList = (message: IMMessage[]): ChatMessage[] => {
  return message
    .map(ele => {
      const msg = {
        _id: ele.sendUuid,
        ...ele,
        text: ele.content,
        createdAt: Number(ele.createAt),
        user: {
          _id: ele.from,
        },
      } as ChatMessage;
      if (ele.type === 'IMAGE' && typeof ele.parsedContent !== 'string') {
        delete (msg as any).text;
        msg.image = decodeURIComponent(ele.parsedContent?.thumbImgUrl || ele.parsedContent?.imgUrl || '');
        msg.imageInfo = {
          width: ele.parsedContent?.width,
          height: ele.parsedContent?.height,
          imgUri: decodeURIComponent(ele.parsedContent?.imgUrl || ''),
          thumbUri: decodeURIComponent(ele.parsedContent?.thumbImgUrl || ''),
        };
      }
      return msg;
    })
    .reverse();
};
