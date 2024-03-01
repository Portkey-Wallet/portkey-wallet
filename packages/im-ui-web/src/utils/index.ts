import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import BigNumber from 'bignumber.js';
import { MessageTypeEnum, ParsedImage, ParsedPinSys, ParsedRedPackage, ParsedTransfer } from '@portkey-wallet/im';
import { IChatItemProps } from '../type';
import { formatPinSysMessageToStr } from '@portkey-wallet/utils/chat';
import { RED_PACKAGE_DEFAULT_MEMO } from '@portkey-wallet/constants/constants-ca/im';
import { divDecimalsToShow } from '@portkey-wallet/utils/converter';
import { UN_SUPPORTED_FORMAT } from '@portkey-wallet/constants/constants-ca/chat';

dayjs.extend(utc);

export const formatChatListTime = (timeStamp?: number | string): string => {
  if (!timeStamp) return '';

  const chatTime = dayjs(Number(timeStamp));
  const now = dayjs();
  const today = now.startOf('date');
  const yesterday = today.subtract(1, 'day');
  const thisYear = now.startOf('year');

  if (chatTime.isAfter(today)) {
    return chatTime.format('HH:mm');
  } else if (chatTime.isAfter(yesterday)) {
    return 'yesterday';
  } else if (chatTime.isAfter(thisYear)) {
    return chatTime.format('MM-DD');
  } else {
    return chatTime.format('YYYY-MM-DD');
  }
};

export const formatTime = (timeStamp?: number | string) => dayjs(Number(timeStamp)).format('HH:mm');

export const ZERO = new BigNumber(0);

export const formatImageData = (parsedContent: ParsedImage) => ({
  thumbImgUrl: decodeURIComponent(parsedContent.thumbImgUrl || ''),
  imgUrl: decodeURIComponent(parsedContent.imgUrl || ''),
  width: parsedContent.width,
  height: parsedContent.height,
});

export const formatChatListSubTitle = (item: IChatItemProps) => {
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
