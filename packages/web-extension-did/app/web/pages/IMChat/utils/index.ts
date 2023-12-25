import { UN_SUPPORTED_FORMAT } from '@portkey-wallet/constants/constants-ca/chat';
import { RED_PACKAGE_DEFAULT_MEMO } from '@portkey-wallet/constants/constants-ca/im';
import {
  ChannelItem,
  Message,
  MessageType,
  MessageTypeEnum,
  ParsedImage,
  ParsedPinSys,
  ParsedRedPackage,
  ParsedTransfer,
} from '@portkey-wallet/im';
import {
  ExtraMessageTypeEnum,
  IMessageShowPage,
  MessageContentType,
  SupportSysMsgType,
} from '@portkey-wallet/im-ui-web';
import { formatMessageTime, formatPinSysMessageToStr } from '@portkey-wallet/utils/chat';
import { divDecimalsToShow } from '@portkey-wallet/utils/converter';
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
        letter: item.fromName?.slice(0, 1)?.toUpperCase(),
        position: supportSysMsgType.includes(item.type) ? 'center' : item.from === ownerRelationId ? 'right' : 'left',
        isGroup,
        isAdmin,
        showPageType,
        extraData: {
          myPortkeyId: ownerRelationId,
        },
      };
    } else {
      transItem = {
        key: `${item.createAt}`,
        id: `${item.createAt}`,
        fromName: item.fromName,
        letter: item.fromName?.slice(0, 1)?.toUpperCase(),
        from: item.from,
        position: item.from === ownerRelationId ? 'right' : 'left',
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
          position: 'center',
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
            position: 'center',
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

export const formatChatListSubTitle = (item: ChannelItem) => {
  const _type = item.lastMessageType;
  if (_type === MessageTypeEnum.IMAGE) {
    return '[Image]';
  }
  if (_type === MessageTypeEnum.TEXT) {
    return `${item.lastMessageContent}`;
  }
  if (_type === MessageTypeEnum.SYS) {
    return `${item.lastMessageContent}`;
  }
  if (_type === MessageTypeEnum.PIN_SYS) {
    return formatPinSysMessageToStr(item.lastMessageContent as ParsedPinSys);
  }
  if (_type === MessageTypeEnum.REDPACKAGE_CARD) {
    const redPackage = (item.lastMessageContent as ParsedRedPackage).data;
    return `${redPackage?.memo || RED_PACKAGE_DEFAULT_MEMO}`;
  }
  if (_type === MessageTypeEnum.TRANSFER_CARD) {
    const asset = (item.lastMessageContent as ParsedTransfer)?.transferExtraData || {};
    const { nftInfo, tokenInfo } = asset;
    if (nftInfo) {
      return `${nftInfo.alias} #${nftInfo.nftId}`;
    }
    if (tokenInfo) {
      return `${divDecimalsToShow(tokenInfo.amount, tokenInfo.decimal)} ${tokenInfo.symbol}`;
    }
    return '';
  }
  return UN_SUPPORTED_FORMAT;
};

export const formatImageData = (parsedContent: ParsedImage) => ({
  thumbImgUrl: decodeURIComponent(parsedContent?.thumbImgUrl || ''),
  imgUrl: decodeURIComponent(parsedContent?.imgUrl || ''),
  width: parsedContent?.width,
  height: parsedContent?.height,
});
