import { SessionExpiredPlan } from '@portkey-wallet/types/session';

export const CA_METHOD_WHITELIST = ['ManagerForwardCall', 'ManagerTransfer'];

export const SessionKeyMap = {
  [SessionExpiredPlan.hour1]: '1 hours',
  [SessionExpiredPlan.hour3]: '3 hours',
  [SessionExpiredPlan.hour12]: '12 hours',
  [SessionExpiredPlan.hour24]: '24 hours',
  [SessionExpiredPlan.always]: 'Never',
};

export const SessionKeyArray = Object.entries(SessionKeyMap).map(([k, v]) => ({
  value: k === SessionExpiredPlan.always ? k : Number(k),
  label: v,
}));
