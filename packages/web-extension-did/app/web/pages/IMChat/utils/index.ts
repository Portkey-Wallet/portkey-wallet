import { SEARCH_MEMBER_LIST_LIMIT } from '@portkey-wallet/constants/constants-ca/im';
import im, { Message, MessageType, MessageTypeEnum, ParsedImage } from '@portkey-wallet/im';
import {
  ExtraMessageTypeEnum,
  IMessageShowPage,
  MessageContentType,
  MessagePositionEnum,
  SupportSysMsgType,
} from '@portkey-wallet/im-ui-web';
import { formatMessageTime } from '@portkey-wallet/utils/chat';
import { isSameDay } from '@portkey-wallet/utils/time';

export const supportedMsgType: MessageType[] = [
  MessageTypeEnum.IMAGE,
  MessageTypeEnum.PIN_SYS,
  MessageTypeEnum.REDPACKAGE_CARD,
  MessageTypeEnum.SYS,
  MessageTypeEnum.TEXT,
  MessageTypeEnum.TRANSFER_CARD,
];

export const supportSysMsgType: MessageType[] = [MessageTypeEnum.PIN_SYS, MessageTypeEnum.SYS];

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

export interface IFormatMessageList {
  list: Message[];
  ownerRelationId: string;
  isGroup?: boolean;
  isAdmin?: boolean;
  showPageType?: IMessageShowPage;
}

export const formatMessageList = ({
  list,
  ownerRelationId,
  isGroup = false,
  isAdmin = false,
  showPageType,
}: IFormatMessageList) => {
  const formatList: MessageContentType[] = [];
  let transItem: MessageContentType;
  list?.forEach((item, i) => {
    if (supportedMsgType.includes(item.type)) {
      transItem = {
        ...item,
        key: item.sendUuid,
        showAvatar: isGroup && !SupportSysMsgType.includes(item.type) && item.from !== ownerRelationId,
        position: supportSysMsgType.includes(item.type)
          ? MessagePositionEnum.center
          : item.from === ownerRelationId
          ? MessagePositionEnum.right
          : MessagePositionEnum.left,
        isGroup,
        isAdmin,
        showPageType,
      };
    } else {
      transItem = {
        key: `${item.createAt}`,
        id: `${item.createAt}`,
        fromName: item.fromName,
        from: item.from,
        position: item.from === ownerRelationId ? MessagePositionEnum.right : MessagePositionEnum.left,
        showAvatar: item.from !== ownerRelationId && isGroup,
        createAt: item.createAt,
        type: MessageTypeEnum.TEXT,
        subType: ExtraMessageTypeEnum['NO-SUPPORT-MSG'],
        parsedContent: '',
      };
    }
    if (i === 0) {
      formatList.push(
        {
          key: `${item.createAt}`,
          id: `${item.createAt}`,
          position: MessagePositionEnum.center,
          createAt: item.createAt,
          type: MessageTypeEnum.SYS,
          parsedContent: formatMessageTime(item.createAt),
          subType: ExtraMessageTypeEnum['DATE-SYS-MSG'],
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
            position: MessagePositionEnum.center,
            createAt: item.createAt,
            type: MessageTypeEnum.SYS,
            parsedContent: formatMessageTime(item.createAt),
            subType: ExtraMessageTypeEnum['DATE-SYS-MSG'],
          },
          transItem,
        );
      }
    }
  });
  return formatList;
};

export const formatImageData = (parsedContent: ParsedImage) => ({
  thumbImgUrl: decodeURIComponent(parsedContent?.thumbImgUrl || ''),
  imgUrl: decodeURIComponent(parsedContent?.imgUrl || ''),
  width: parsedContent?.width,
  height: parsedContent?.height,
});

export const searchChannelMembers = async ({
  keyword,
  channelUuid,
  skipCount = 0,
  maxResultCount = SEARCH_MEMBER_LIST_LIMIT,
}: {
  keyword: string;
  channelUuid: string;
  skipCount?: number;
  maxResultCount?: number;
}) => {
  return await im.service.searchChannelMembers({
    keyword,
    channelUuid,
    skipCount,
    maxResultCount,
  });
};

export const fetchChannelContactList = async ({
  keyword = '',
  channelUuid,
  skipCount = 0,
  maxResultCount = SEARCH_MEMBER_LIST_LIMIT,
}: {
  keyword?: string;
  channelUuid: string;
  skipCount?: number;
  maxResultCount?: number;
}) => {
  const { data } = await im.service.getChannelContacts({ keyword, channelUuid, skipCount, maxResultCount });
  return data;
};
