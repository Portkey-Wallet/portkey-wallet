import { SessionExpiredPlan } from '@portkey-wallet/types/session';
import { MethodsBase } from '@portkey/provider-types';

export const SessionKeyMap = {
  [SessionExpiredPlan.hour1]: 'In 1 hour',
  [SessionExpiredPlan.hour3]: 'In 3 hours',
  [SessionExpiredPlan.hour12]: 'In 12 hours',
  [SessionExpiredPlan.hour24]: 'In 24 hours',
  [SessionExpiredPlan.always]: 'Never',
};

export const SessionKeyArray = Object.entries(SessionKeyMap).map(([k, v]) => ({
  value: k === SessionExpiredPlan.always ? k : Number(k),
  label: v,
}));

export const CA_METHOD_WHITELIST = ['ManagerForwardCall', 'ManagerTransfer'];

export const REMEMBER_ME_ACTION_WHITELIST: string[] = [MethodsBase.SEND_TRANSACTION];
