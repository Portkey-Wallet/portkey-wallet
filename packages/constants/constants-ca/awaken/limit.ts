export const LIMIT_PRICE_DECIMAL = 8;

export const LIMIT_MAX_BUFFER_RATIO = 1.005;

export const LIMIT_TIME_INTERVAL = 10 * 1000;

export const LIMIT_LABS_FEE_RATE = 5;

export const LIMIT_RECEIVE_RATE = 0.9995;

export enum LimitExpiryEnum {
  day = 1,
  threeDay = 3,
  week = 7,
  month = 30,
}

type TLimitExpiryItem = {
  label: string;
  value: LimitExpiryEnum;
};
export const EXPIRY_LIST: TLimitExpiryItem[] = [
  {
    label: '1 day',
    value: LimitExpiryEnum.day,
  },
  {
    label: '3 days',
    value: LimitExpiryEnum.threeDay,
  },
  {
    label: '7 days',
    value: LimitExpiryEnum.week,
  },
  {
    label: '30 days',
    value: LimitExpiryEnum.month,
  },
];
