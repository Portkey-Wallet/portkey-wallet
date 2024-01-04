import { Message, ParsedImage, ParsedRedPackage } from '@portkey-wallet/im';
import { MessageType } from '@portkey-wallet/im-ui-web';
import { formatMessageTime } from '@portkey-wallet/utils/chat';
import { isSameDay } from '@portkey-wallet/utils/time';
import { MessageTypeWeb } from 'types/im';

export const supportedMsgType = ['text', 'image', 'system', 'red-package-card'];

export const getPixel = async (url: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = (e) => {
      reject(e);
    };
  });
};

export const formatMessageList = (list: Message[], ownerRelationId: string, isGroup = false) => {
  const formatList: MessageType[] = [];
  let transItem: MessageType;
  list?.forEach((item, i) => {
    const transType = MessageTypeWeb[item.type] || '';
    if (supportedMsgType.includes(transType)) {
      transItem = {
        id: `${item.id}`,
        key: item.sendUuid,
        title: item.fromName,
        letter: item.fromName?.slice(0, 1)?.toUpperCase(),
        from: item.from,
        position: transType === MessageTypeWeb.SYS ? 'center' : item.from === ownerRelationId ? 'right' : 'left',
        text: `${item.parsedContent}`,
        imgData:
          transType === MessageTypeWeb.IMAGE && typeof item.parsedContent === 'object'
            ? {
                ...item.parsedContent,
                thumbImgUrl: decodeURIComponent(`${(item.parsedContent as ParsedImage).thumbImgUrl}`) || '',
                imgUrl: decodeURIComponent(`${(item.parsedContent as ParsedImage).imgUrl}`) || '',
                width: `${(item.parsedContent as ParsedImage).width}`,
                height: `${(item.parsedContent as ParsedImage).height}`,
              }
            : {},
        type: transType,
        date: item.createAt,
        showAvatar: item.from !== ownerRelationId && isGroup,
        avatar: item.fromAvatar,
        redPacket:
          transType === MessageTypeWeb['REDPACKAGE-CARD'] ? (item.parsedContent as ParsedRedPackage) : undefined,
      };
    } else {
      transItem = {
        key: `${item.createAt}`,
        id: `${item.createAt}`,
        title: item.fromName,
        letter: item.fromName?.slice(0, 1)?.toUpperCase(),
        from: item.from,
        position: item.from === ownerRelationId ? 'right' : 'left',
        showAvatar: item.from !== ownerRelationId && isGroup,
        date: item.createAt,
        type: 'text',
        subType: 'non-support-msg',
        text: '',
      };
    }
    if (i === 0) {
      formatList.push(
        {
          key: `${item.createAt}`,
          id: `${item.createAt}`,
          position: 'center',
          date: item.createAt,
          type: 'system',
          text: formatMessageTime(item.createAt),
          subType: 'show-time',
        },
        transItem,
      );
    } else {
      if (isSameDay(list[i - 1].createAt, item.createAt)) {
        formatList.push(transItem);
      } else {
        formatList.push(
          {
            key: `${item.createAt}`,
            id: `${item.createAt}`,
            position: 'center',
            date: item.createAt,
            type: 'system',
            text: formatMessageTime(item.createAt),
            subType: 'show-time',
          },
          transItem,
        );
      }
    }
  });
  return formatList;
};
