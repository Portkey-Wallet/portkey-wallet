import dayjs from 'dayjs';
import BigNumber from 'bignumber.js';

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
