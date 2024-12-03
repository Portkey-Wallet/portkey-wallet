import { ONE_BILLION, ONE_MILLION, ONE_TRILLION, ZERO } from '@portkey-wallet/constants/misc';
import BigNumber from 'bignumber.js';

export const replaceCharacter = (str: string, replaced: string, replacedBy: string) => {
  return str?.replace(replaced, replacedBy);
};

export const formatSymbolDisplay = (str: string) => {
  return replaceCharacter(str, '-1', '');
};

export function formatTrillion(price?: BigNumber.Value): string {
  if (!price) {
    return ZERO.toString();
  }

  if (new BigNumber(price).gte(ONE_TRILLION.times(1000))) {
    return '>999T';
  }

  return `${new BigNumber(price).div(ONE_TRILLION).toFixed(2)}T`;
}

export function formatBillion(price?: BigNumber.Value): string {
  if (!price) {
    return ZERO.toString();
  }
  return `${new BigNumber(price).div(ONE_BILLION).toFixed(2)}B`;
}

export function formatMillion(price?: BigNumber.Value): string {
  if (!price) {
    return ZERO.toString();
  }
  return `${new BigNumber(price).div(ONE_MILLION).toFixed(2)}M`;
}

export function formatPrice(price?: BigNumber.Value, digits = 12): string {
  if (!price) {
    return ZERO.toString();
  }
  const bigNum = new BigNumber(price);

  if (bigNum.gte(ONE_TRILLION)) {
    return formatTrillion(price);
  }

  if (bigNum.gte(ONE_BILLION)) {
    return formatBillion(bigNum);
  }

  if (bigNum.gte(ONE_MILLION)) {
    return formatMillion(bigNum);
  }

  if (bigNum.gte(10)) {
    return bigNum.dp(2).toString();
  }

  if (bigNum.gte(0.0001)) {
    return bigNum.dp(4).toString();
  }

  return bigNum.precision(4).dp(digits).toString();
}

export const formatPriceUsd = (price?: BigNumber.Value) => {
  if (!price) return `0`;
  const priceBN = ZERO.plus(price);
  if (priceBN.gte(0.01)) return priceBN.dp(2, BigNumber.ROUND_HALF_CEIL).toFixed();
  const precisionResult = priceBN.toPrecision(4, BigNumber.ROUND_HALF_CEIL);
  return ZERO.plus(precisionResult).toFixed();
};

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  let hours = date.getUTCHours();
  let minutes = date.getUTCMinutes();
  let seconds = date.getUTCSeconds();

  if (hours >= 24) {
    hours -= 24;
  }

  const monthStr = month < 10 ? `0${month}` : month;
  const dayStr = day < 10 ? `0${day}` : day;
  const hoursStr = hours < 10 ? `0${hours}` : hours;
  const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
  const secondsStr = seconds < 10 ? `0${seconds}` : seconds;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  return `${monthStr}/${dayStr}/${year} ${hoursStr}:${minutesStr}:${secondsStr} ${ampm} UTC.`;
}
