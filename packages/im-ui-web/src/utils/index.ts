import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import BigNumber from 'bignumber.js';
import { ParsedImage } from '@portkey-wallet/im';

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
