export const test = 1;

export enum LockingTimeType {
  '0s' = 0,
  '15s' = 15,
  '60s' = 60,
  '5min' = 300,
  '10min' = 600,
  'never' = 86400,
}

export type SettingsState = {
  autoLockingTime: LockingTimeType;
  leaveTime: number;
};
