import dayjs from 'dayjs';
import { dateToDayjs } from './time';

export const formatMessageCountToStr = (num: number): string | undefined => {
  if (!num || num < 0) return undefined;
  return num > 99 ? '99+' : String(num);
};

export const formatChatListTime = (date?: dayjs.ConfigType): string => {
  if (!date) return '';
  const chatTime = dateToDayjs(date);
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

export const formatMessageTime = (date?: dayjs.ConfigType): string => {
  if (!date) return '';
  const messageTime = dateToDayjs(date);
  const now = dayjs();
  if (messageTime.isSame(now, 'year')) {
    return messageTime.format('MM-DD');
  } else {
    return messageTime.format('YYYY-MM-DD');
  }
};
