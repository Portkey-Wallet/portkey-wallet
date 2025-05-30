export const AutoLockData = {
  // Immediately: 'Immediately',
  OneHour: 'After 1 Hour',
  OneDay: 'After 24 Hours',
  Never: 'Never',
};

export enum AutoLockDataType {
  Immediately = 0,
  OneHour = 60, // minutes
  OneDay = 60 * 24,
  Never = Infinity,
}

export type AutoLockDataKey = keyof typeof AutoLockData;

export const DefaultLock = 'OneHour';
