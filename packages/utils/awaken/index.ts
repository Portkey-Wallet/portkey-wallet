import { DEFAULT_EXPIRATION, DEFAULT_SLIPPAGE_TOLERANCE } from '@portkey-wallet/constants/constants-ca/awaken';
import BigNumber from 'bignumber.js';
import { timesDecimals } from '../converter';
import { ONE } from '@portkey-wallet/constants/misc';
import { PBTimestamp } from '@portkey-wallet/types/types-ca/awaken';

export function valueToPercentage(input?: BigNumber.Value) {
  return BigNumber.isBigNumber(input) ? input.times(100) : timesDecimals(input, 2);
}

export function parseUserSlippageTolerance(input?: string) {
  return valueToPercentage(input || DEFAULT_SLIPPAGE_TOLERANCE);
}

export function bigNumberToString(big: BigNumber, decimals?: number) {
  return big.isNaN() ? '0' : big.dp(decimals ?? 18).toString();
}

export function minimumAmountOut(outputAmount: BigNumber, slippageTolerance = DEFAULT_SLIPPAGE_TOLERANCE) {
  if (slippageTolerance === '') slippageTolerance = DEFAULT_SLIPPAGE_TOLERANCE;
  return outputAmount.div(ONE.plus(slippageTolerance));
}

export const getDeadline = (userExpiration: string): number | PBTimestamp => {
  const deadline = new BigNumber(userExpiration);
  const seconds =
    Math.ceil(new Date().getTime() / 1000) +
    (!deadline.isNaN() ? deadline.times(60).toNumber() : Number(DEFAULT_EXPIRATION) * 60);
  return { seconds: seconds, nanos: 0 };
};
