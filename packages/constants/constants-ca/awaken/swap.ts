export const SWAP_LABS_FEE_RATE = 15;

export const SWAP_RECEIVE_RATE = 0.9985;

export const SWAP_TIME_INTERVAL = 30 * 1000;

export enum SwapStatusCodeEnum {
  Success = 1000,
  InsufficientLiquidity = 2000,
  NoRouteFound = 2001,
}
