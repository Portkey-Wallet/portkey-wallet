import BigNumber from 'bignumber.js';

export enum REQ_CODE {
  UserDenied = -1,
  Fail = -2,
  Success = 1,
}

export const LANG_MAX = new BigNumber('9223372036854774784');

export const ZERO = new BigNumber(0);
export const ONE = new BigNumber(1);

export const isEffectiveNumber = (v: any) => {
  const val = new BigNumber(v);
  return !val.isNaN() && !val.lte(0);
};

export const PIN_SIZE = 6;

export const DIGIT_CODE = {
  // digit code expiration time (minutes)
  expiration: 10,
  // digit code length
  length: 6,
};
// verifier info expiration time (hour)
export const VERIFIER_EXPIRATION = 1;

// guardian expired time (millisecond)
export const GUARDIAN_EXPIRED_TIME = 58 * 60 * 1000;

export const DEFAULT_FETCH_TIMEOUT = 10000;
