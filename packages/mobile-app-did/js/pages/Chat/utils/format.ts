import { Message as IMMessage, ParsedImage } from '@portkey-wallet/im/types';
import { ChatMessage } from '../types';
import { UN_SUPPORTED_FORMAT } from '@portkey-wallet/constants/constants-ca/chat';
import dayjs from 'dayjs';

export const ONE_SECONDS = 1000;
export const ONE_MINUS = ONE_SECONDS * 60;
export const ONE_HOUR = ONE_MINUS * 60;
export const ONE_DAY = ONE_HOUR * 24;

export const formatMessageList = (message: IMMessage[]): ChatMessage[] => {
  // console.log('IMMessage', message);
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
            msg.image = decodeURIComponent(
              (ele.parsedContent as ParsedImage)?.thumbImgUrl || (ele.parsedContent as ParsedImage)?.imgUrl || '',
            );
            msg.imageInfo = {
              width: (ele.parsedContent as ParsedImage)?.width,
              height: (ele.parsedContent as ParsedImage)?.height,
              imgUri: decodeURIComponent((ele.parsedContent as ParsedImage)?.imgUrl || ''),
              thumbUri: decodeURIComponent((ele.parsedContent as ParsedImage)?.thumbImgUrl || ''),
            };
          }
          break;
        }
        case 'TEXT':
          break;

        case 'REDPACKAGE-CARD':
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

      if (typeof ele.content !== 'string') {
        msg.messageType = 'NOT_SUPPORTED';
        msg.text = UN_SUPPORTED_FORMAT;
      }
      return msg;
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
  const amountShowLen = amountShow.length;
  const symbolLen = symbol.length;
  if (amountShowLen + symbolLen > digits) return `${amountShow.slice(0, digits - symbolLen)}... ${symbol}`;

  return `${amountShow} ${symbol}`;
};
