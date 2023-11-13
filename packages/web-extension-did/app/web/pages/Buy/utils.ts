import { ZERO } from '@portkey-wallet/constants/misc';
import { formatAmountShow } from '@portkey-wallet/utils/converter';
import { IErrMsgHandlerParams, IValidValueCheckParams } from './types';

export const limitText = ({ min, max, symbol }: IErrMsgHandlerParams) =>
  `Limit Amount ${formatAmountShow(min)}-${formatAmountShow(max)} ${symbol} `;

export const validValueCheck = ({ amount, min, max }: IValidValueCheckParams) => {
  return ZERO.plus(amount).isGreaterThanOrEqualTo(min) && ZERO.plus(amount).isLessThanOrEqualTo(max);
};
