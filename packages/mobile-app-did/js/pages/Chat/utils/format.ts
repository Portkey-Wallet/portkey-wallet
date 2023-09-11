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
        messageType: ele.type,
        user: {
          _id: ele.from,
        },
      } as ChatMessage;
      switch (ele.type) {
        case 'IMAGE': {
          if (typeof ele.parsedContent !== 'string') {
            delete (msg as any).text;
            msg.image = decodeURIComponent(ele.parsedContent?.thumbImgUrl || ele.parsedContent?.imgUrl || '');
            msg.imageInfo = {
              width: ele.parsedContent?.width,
              height: ele.parsedContent?.height,
              imgUri: decodeURIComponent(ele.parsedContent?.imgUrl || ''),
              thumbUri: decodeURIComponent(ele.parsedContent?.thumbImgUrl || ''),
            };
          }
          break;
        }
        case 'TEXT':
          break;
        case 'SYS':
          msg.system = true;
          // TODO: system message
          msg.text = 'system test ';
          break;
        default: {
          msg.messageType = 'NOT_SUPPORTED';
          msg.text = '[Unsupported format]';
          break;
        }
      }

      if (typeof ele.content !== 'string') {
        msg.messageType = 'NOT_SUPPORTED';
        msg.text = '[Unsupported format]';
      }
      return msg;
    })
    .reverse();
};
