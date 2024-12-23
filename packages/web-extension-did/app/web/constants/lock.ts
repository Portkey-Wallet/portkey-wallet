export const AutoLockData = {
  Immediately: 'Immediately',
  QuarterMinute: 'After 15 seconds',
  OneMinute: 'After 60 seconds',
  FiveMinute: 'After 5 minutes',
  TenMinute: 'After 10 minutes',
  // OneHour: 'After 1 Hour',
  // OneDay: 'After 24 Hours',
  Never: 'Never',
};

export enum AutoLockDataType {
  Immediately = 0,
  QuarterMinute = 0.25,
  OneMinute = 1,
  FiveMinute = 5,
  TenMinute = 10,
  // OneHour = 60, // minutes
  OneDay = 60 * 24,
  Never = Infinity,
  OneHour,
}

export type AutoLockDataKey = keyof typeof AutoLockData;

export const DefaultLock = 'QuarterMinute';
