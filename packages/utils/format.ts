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
