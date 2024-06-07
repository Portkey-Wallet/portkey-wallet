import { Message as IMMessage, ParsedImage } from '@portkey-wallet/im/types';
import { ChatMessage } from '../types';
import { UN_SUPPORTED_FORMAT } from '@portkey-wallet/constants/constants-ca/chat';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
dayjs.extend(utc);

export const ONE_SECONDS = 1000;
export const ONE_MINUS = ONE_SECONDS * 60;
export const ONE_HOUR = ONE_MINUS * 60;
export const ONE_DAY = ONE_HOUR * 24;

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
    const parsedContent = message.parsedContent as ParsedImage;
    msg.text = undefined; // overwrite text
    msg.image = decodeURIComponent(parsedContent?.thumbImgUrl || parsedContent?.imgUrl || '');
    msg.imageInfo = {
      width: parsedContent?.width || '',
      height: parsedContent?.height || '',
      imgUri: decodeURIComponent(parsedContent?.imgUrl || ''),
      thumbUri: decodeURIComponent(parsedContent?.thumbImgUrl || ''),
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
    rawMessage: message,
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
    case 'PIN-SYS':
      msg.system = true;
      msg.messageType = 'PIN-SYS';
      break;
    case 'REDPACKAGE-CARD':
      msg.messageType = 'REDPACKAGE-CARD';
      break;
    case 'TRANSFER-CARD':
      msg.messageType = 'TRANSFER-CARD';
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
};

export const getNumberWithUnit = (num: number, singleUnit: string, pluralUnit: string) => {
  if (num <= 1) return `${num} ${singleUnit}`;
  return `${num} ${pluralUnit}`;
};

export const getUnit = (num: number, singleUnit: string, pluralUnit: string) => {
  if (num <= 1) return singleUnit;
  return pluralUnit;
};

export const formatRedPacketNoneLeftTime = (startTimestamp: number, endTimestamp: number): string => {
  const start = dayjs(startTimestamp);
  const end = dayjs(endTimestamp);
  const diff = end.diff(start);

  if (diff < ONE_MINUS) return getNumberWithUnit(Math.ceil(diff / ONE_SECONDS), 'second', 'seconds');
  if (diff < ONE_HOUR) return getNumberWithUnit(Math.ceil(diff / ONE_MINUS), 'minute', 'minutes');
  if (diff < ONE_DAY) return getNumberWithUnit(Math.ceil(diff / ONE_HOUR), 'hour', 'hours');

  return getNumberWithUnit(Math.ceil(diff / ONE_DAY), 'day', 'days');
};

export const getEllipsisTokenShow = (amountShow: string, symbol: string, digits = 21) => {
  const amountShowLen = amountShow?.length || 0;
  const symbolLen = symbol?.length || 0;
  if (amountShowLen + symbolLen > digits) return `${amountShow.slice(0, digits - symbolLen)}... ${symbol}`;

  return `${amountShow} ${symbol}`;
};
export const getClaimedShow = (grabbedAmountShow: string, totalAmountShow: string, symbol: string, digits = 38) => {
  const grabbedAmountShowLen = grabbedAmountShow?.length || 0;
  const totalAmountShowLen = totalAmountShow?.length || 0;
  const symbolLen = symbol?.length || 0;
  if (grabbedAmountShowLen + 3 + totalAmountShowLen + symbolLen > digits)
    return `${grabbedAmountShowLen} / ${totalAmountShow.slice(0, digits - symbolLen)}... ${symbol}`;

  return `${grabbedAmountShowLen} / ${totalAmountShow} ${symbol}`;
};
