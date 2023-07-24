import { Timestamp } from './index';

export enum SessionExpiredPlan {
  // hours
  hour1 = 1,
  hour3 = 3,
  hour12 = 12,
  hour24 = 24,
  always = 'Infinity',
}
export type SessionInfo = {
  expiredPlan: SessionExpiredPlan;
  expiredTime: Timestamp;
  signature: string;
};
