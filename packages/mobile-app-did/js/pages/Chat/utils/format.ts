import { Message as IMMessage } from '@portkey-wallet/im/types';
import { ChatMessage } from '../types';
import { UN_SUPPORTED_FORMAT } from '@portkey-wallet/constants/constants-ca/chat';

const formatImage = (message: IMMessage) => {
  const msg: {
    text?: string;
    image?: string;
    imageInfo?: {
      width: string;
      height: string;
      imgUri: string;
      thumbUri: string;
    };
  } = {};

  if (typeof message.parsedContent !== 'string') {
    msg.text = undefined; // overwrite text
    msg.image = decodeURIComponent(message.parsedContent?.thumbImgUrl || message.parsedContent?.imgUrl || '');
    msg.imageInfo = {
      width: message.parsedContent?.width || '',
      height: message.parsedContent?.height || '',
      imgUri: decodeURIComponent(message.parsedContent?.imgUrl || ''),
      thumbUri: decodeURIComponent(message.parsedContent?.thumbImgUrl || ''),
    };
  }

  return msg;
};

export const formatMessageItem = (message: IMMessage): ChatMessage => {
  const msg = {
    ...message,
    _id: message.sendUuid,
    text: message.content,
    createdAt: Number(message.createAt),
    messageType: message.type,
    user: {
      _id: message.from,
    },
  } as ChatMessage;
  let imgObj = {};

  switch (message.type) {
    case 'IMAGE':
      imgObj = formatImage(message);
      break;
    case 'TEXT':
      break;
    case 'SYS':
      msg.system = true;
      break;
    default: {
      msg.messageType = 'NOT_SUPPORTED';
      msg.text = UN_SUPPORTED_FORMAT;
      break;
    }
  }

  if (typeof message.content !== 'string') {
    msg.messageType = 'NOT_SUPPORTED';
    msg.text = UN_SUPPORTED_FORMAT;
  }

  return { ...msg, ...imgObj };
};

export const formatMessageList = (messageList: IMMessage[]): ChatMessage[] => {
  return messageList
    .map(ele => {
      if (ele.quote) return { ...formatMessageItem(ele), quote: formatMessageItem(ele.quote) };

      return formatMessageItem(ele);
    })
    .reverse();
  // .map(ele => {
  //   const msg = {
  //     _id: ele.sendUuid,
  //     ...ele,
  //     text: ele.content,
  //     createdAt: Number(ele.createAt),
  //     messageType: ele.type,
  //     user: {
  //       _id: ele.from,
  //     },
  //   } as ChatMessage;
  //   switch (ele.type) {
  //     case 'IMAGE': {
  //       if (typeof ele.parsedContent !== 'string') {
  //         delete (msg as any).text;
  //         msg.image = decodeURIComponent(ele.parsedContent?.thumbImgUrl || ele.parsedContent?.imgUrl || '');
  //         msg.imageInfo = {
  //           width: ele.parsedContent?.width,
  //           height: ele.parsedContent?.height,
  //           imgUri: decodeURIComponent(ele.parsedContent?.imgUrl || ''),
  //           thumbUri: decodeURIComponent(ele.parsedContent?.thumbImgUrl || ''),
  //         };
  //       }
  //       break;
  //     }
  //     case 'TEXT':
  //       break;
  //     case 'SYS':
  //       msg.system = true;
  //       break;
  //     default: {
  //       msg.messageType = 'NOT_SUPPORTED';
  //       msg.text = UN_SUPPORTED_FORMAT;
  //       break;
  //     }
  //   }

  //   if (typeof ele.content !== 'string') {
  //     msg.messageType = 'NOT_SUPPORTED';
  //     msg.text = UN_SUPPORTED_FORMAT;
  //   }
  //   return msg;
  // })
  // .reverse();
};
