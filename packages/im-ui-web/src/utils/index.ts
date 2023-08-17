import dayjs from 'dayjs';
import BigNumber from 'bignumber.js';

export const formatDate = (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm:ss');
export const formatTime = (time: string) => dayjs(time).format('HH:mm');

export const ZERO = new BigNumber(0);
