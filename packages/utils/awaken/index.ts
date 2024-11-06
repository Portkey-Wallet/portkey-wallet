import { DEFAULT_SLIPPAGE_TOLERANCE } from '@portkey-wallet/constants/constants-ca/awaken';
import BigNumber from 'bignumber.js';
import { timesDecimals } from '../converter';
import { ONE } from '@portkey-wallet/constants/misc';

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
