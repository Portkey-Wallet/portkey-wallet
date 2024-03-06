import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
dayjs.extend(utc);

export function ensureMilliseconds(timestamp: string | number) {
  if (typeof timestamp === 'number') timestamp = timestamp.toString();
  const trimmedTimestamp = timestamp.trim();

  // Missing digits are filled with 0
  if (trimmedTimestamp.length < 13) return Number(trimmedTimestamp + '0'.repeat(13 - trimmedTimestamp.length));

  return Number(trimmedTimestamp);
}

export function dateToDayjs(date?: dayjs.ConfigType) {
  if (dayjs.isDayjs(date)) return date;
  const numDate = Number(date);
  if (!isNaN(numDate)) date = ensureMilliseconds(numDate);
  return dayjs(date);
}

export function isSameDay(date1: dayjs.ConfigType, date2: dayjs.ConfigType) {
  return dateToDayjs(date1).isSame(dateToDayjs(date2), 'day');
}

/**
 * timestamp to formatted time like 'Nov 10 at 1:09 pm', if last year format to "2020 Nov 10 at 1:09 pm "
 * @param time
 * @returns
 */
export const formatTransferTime = (time?: string | number) => {
  if (!time) return '';

  if (dayjs(time).isBefore(dayjs(), 'year')) {
    return dayjs(time).format('YYYY MMM D , h:mm a').replace(',', 'at');
  }

  return dayjs(time).format('MMM D , h:mm a').replace(',', 'at');
};
