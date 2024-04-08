import { isEffectiveNumber, ZERO } from '@portkey-wallet/constants/misc';
import { DEFAULT_AMOUNT, DEFAULT_DECIMAL, DEFAULT_DIGITS } from '@portkey-wallet/constants/constants-ca/activity';
import BigNumber from 'bignumber.js';

// const zhList = [
//   { value: 1e12, symbol: '萬億' },
//   { value: 1e8, symbol: '億' },
//   { value: 1e4, symbol: '萬' },
// ];
const enList = [
  { value: 1e12, symbol: 'T' },
  { value: 1e9, symbol: 'B' },
  { value: 1e6, symbol: 'M' },
  { value: 1e3, symbol: 'K' },
];

export const fixedDecimal = (count?: number | BigNumber | string, num = 4) => {
  const bigCount = BigNumber.isBigNumber(count) ? count : new BigNumber(count || '');
  if (bigCount.isNaN()) return '0';
  return bigCount.dp(num, BigNumber.ROUND_DOWN).toFixed();
};

export const unitConverter = (num?: number | BigNumber | string, decimal = 4, defaultVal = '0') => {
  const bigNum = BigNumber.isBigNumber(num) ? num : new BigNumber(num || '');
  if (bigNum.isNaN() || bigNum.eq(0)) return defaultVal;
  const abs = bigNum.abs();
  const list = enList;
  for (let i = 0; i < list.length; i++) {
    const { value, symbol } = list[i];
    if (abs.gte(value)) return fixedDecimal(bigNum.div(value), decimal) + symbol;
  }
  return fixedDecimal(bigNum, decimal);
};

export function divDecimals(a?: BigNumber.Value, decimals: string | number = 18) {
  if (!a) return ZERO;
  const bigA = ZERO.plus(a);
  if (bigA.isNaN()) return ZERO;
  if (typeof decimals === 'string' && decimals.length > 10) return bigA.div(decimals);
  return bigA.div(`1e${decimals}`);
}

export function divDecimalsStr(a?: BigNumber.Value, decimals: string | number = 8, defaultVal = '0') {
  const n = divDecimals(a, decimals);
  return isEffectiveNumber(n) ? n.toFixed() : defaultVal;
}

export function divDecimalsToShow(a?: BigNumber.Value, decimals: string | number = 8, defaultVal = '--') {
  const n = divDecimals(a, decimals);
  return isEffectiveNumber(n) ? n.toFormat() : defaultVal;
}

export function timesDecimals(a?: BigNumber.Value, decimals: string | number = 18) {
  if (!a) return ZERO;
  const bigA = ZERO.plus(a);
  if (bigA.isNaN()) return ZERO;
  if (typeof decimals === 'string' && decimals.length > 10) return bigA.times(decimals);
  return bigA.times(`1e${decimals}`);
}

/**
 * this function is to format address,just like "formatStr2EllipsisStr" ---> "for...ess"
 * @param address
 * @param digits [pre_count, suffix_count]
 * @param type
 * @returns
 */
export const formatStr2EllipsisStr = (address = '', digits = [10, 10], type: 'middle' | 'tail' = 'middle'): string => {
  if (!address) return '';

  const len = address.length;

  if (type === 'tail') return `${address.slice(0, digits[0])}...`;

  if (len < digits[0] + digits[1]) return address;
  const pre = address.substring(0, digits[0]);
  const suffix = address.substring(len - digits[1]);
  return `${pre}...${suffix}`;
};

export enum AmountSign {
  PLUS = '+',
  MINUS = '-',
  USD = '$ ',
  EMPTY = '',
}
export interface IFormatAmountProps {
  amount?: string | number;
  decimals?: string | number;
  digits?: number;
  sign?: AmountSign;
}

/**
 * formatAmount with prefix and unit
 * @example $11.1   11.1K
 */
export function formatAmount({
  amount = DEFAULT_AMOUNT,
  decimals = DEFAULT_DECIMAL,
  digits = DEFAULT_DIGITS,
  sign = AmountSign.EMPTY,
}: IFormatAmountProps): string {
  let amountTrans = `${unitConverter(
    ZERO.plus(amount).div(`1e${decimals || DEFAULT_DECIMAL}`),
    digits || DEFAULT_DIGITS,
  )}`;
  if (sign && amountTrans !== '0') {
    return `${sign}${amountTrans}`;
  }
  return amountTrans;
}

export interface IFormatWithCommasProps {
  amount?: string | number;
  decimals?: string | number;
  digits?: number;
  sign?: AmountSign;
}
/**
 * formatAmount with prefix and thousand mark, not unit
 * @example $11.1  +11.1  -11.1  9,999.9
 */
export function formatWithCommas({
  amount = DEFAULT_AMOUNT,
  decimals,
  digits = DEFAULT_DIGITS,
  sign = AmountSign.EMPTY,
}: IFormatWithCommasProps): string {
  const decimal = decimals || 0;
  const amountTrans = `${divDecimals(ZERO.plus(amount), decimal).decimalPlaces(digits).toFormat()}`;

  if (sign && amountTrans !== '0') {
    return `${sign}${amountTrans}`;
  }
  return amountTrans;
}

export const formatAmountShow = (
  count: number | BigNumber | string,
  decimal: string | number = 4,
  roundingMode: BigNumber.RoundingMode = BigNumber.ROUND_DOWN,
) => {
  const bigCount = BigNumber.isBigNumber(count) ? count : new BigNumber(count || '');
  if (bigCount.isNaN()) return '0';
  return bigCount.decimalPlaces(typeof decimal !== 'number' ? Number(decimal) : decimal, roundingMode).toFormat();
};

export const formatTokenAmountShowWithDecimals = (
  amount?: number | BigNumber.Value | string,
  decimal: string | number = 4,
) => {
  return formatAmountShow(divDecimals(amount, decimal), decimal);
};

export const formatAmountUSDShow = (
  count: number | BigNumber | string | null | undefined,
  decimal: string | number = 4,
  roundingMode: BigNumber.RoundingMode = BigNumber.ROUND_DOWN,
) => {
  if (count === undefined || count === null || count === '') return '';

  const min = divDecimals(1, decimal);
  const bigCount = BigNumber.isBigNumber(count) ? count : new BigNumber(count || '');
  if (bigCount.isNaN() || bigCount.eq(0)) return '$ 0';
  if (min.gt(bigCount)) return `<$ ${min.toFixed()}`;
  return (
    '$ ' + bigCount.decimalPlaces(typeof decimal !== 'number' ? Number(decimal) : decimal, roundingMode).toFormat()
  );
};

export const convertAmountUSDShow = (count: BigNumber.Value, price?: BigNumber.Value) => {
  return formatAmountUSDShow(ZERO.plus(count).times(price ?? 0));
};
