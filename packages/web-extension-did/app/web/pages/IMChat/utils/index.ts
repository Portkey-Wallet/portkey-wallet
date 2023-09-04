import { Message } from '@portkey-wallet/im';
import { MessageType } from '@portkey-wallet/im-ui-web';
import { formatMessageTime } from '@portkey-wallet/utils/chat';
import { isSameDay } from '@portkey-wallet/utils/time';
import { MessageTypeWeb } from 'types/im';

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

export const formatMessageList = (list: Message[], ownerRelationId: string) => {
  const formatList: MessageType[] = [];
  let transItem: MessageType;
  list?.forEach((item, i) => {
    const transType = MessageTypeWeb[item.type] || '';
    if (['text', 'image'].includes(transType)) {
      transItem = {
        id: `${item.id}`,
        key: item.sendUuid,
        title: item.fromName,
        position: item.from === ownerRelationId ? 'right' : 'left',
        text: `${item.parsedContent}`,
        imgData:
          typeof item.parsedContent === 'object'
            ? {
                ...item.parsedContent,
                thumbImgUrl: decodeURIComponent(`${item.parsedContent.thumbImgUrl}`) || '',
                imgUrl: decodeURIComponent(`${item.parsedContent.imgUrl}`) || '',
                width: `${item?.parsedContent?.width}`,
                height: `${item?.parsedContent?.height}`,
              }
            : {},
        type: transType,
        date: item.createAt,
      };
    } else {
      transItem = {
        key: `${item.createAt}`,
        id: `${item.createAt}`,
        position: 'left',
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
          position: 'left',
          date: item.createAt,
          type: 'system',
          text: formatMessageTime(item.createAt),
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
            position: 'left',
            date: item.createAt,
            type: 'system',
            text: formatMessageTime(item.createAt),
          },
          transItem,
        );
      }
    }
  });
  return formatList;
};
