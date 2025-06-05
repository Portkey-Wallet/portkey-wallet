import { ZERO } from '@portkey-wallet/constants/misc';
import { formatAmountShow } from '@portkey-wallet/utils/converter';
import { ILimitTextParams, IValidValueCheckParams } from './types';

export const limitText = ({ min, max, symbol }: ILimitTextParams) =>
  `Limit Amount ${formatAmountShow(min)}-${formatAmountShow(max)} ${symbol} `;

export const validValueCheck = ({ amount, min, max }: IValidValueCheckParams) => {
  return ZERO.plus(amount).isGreaterThanOrEqualTo(min) && ZERO.plus(amount).isLessThanOrEqualTo(max);
};

export const generateRateText = (crypto: string, exchange: string, fiat: string) => {
  return `1 ${crypto} ≈ ${formatAmountShow(exchange, 2)} ${fiat}`;
};

export const generateReceiveText = (receive: string, symbol: string) => {
  return `I will receive ≈ ${formatAmountShow(receive)} ${symbol}`;
};
