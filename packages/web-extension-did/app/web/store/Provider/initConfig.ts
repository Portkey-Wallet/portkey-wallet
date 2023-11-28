import BigNumber from 'bignumber.js';

export function initConfig() {
  BigNumber.set({ ROUNDING_MODE: BigNumber.ROUND_DOWN });
}
