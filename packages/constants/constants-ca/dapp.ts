import { SessionExpiredPlan } from '@portkey-wallet/types/session';
import { MethodsBase, MethodsWallet } from '@portkey/provider-types';
import { DAPP_WHITELIST } from './network';

export const SessionKeyMap = {
  [SessionExpiredPlan.hour1]: '1 hour',
  [SessionExpiredPlan.hour3]: '3 hours',
  [SessionExpiredPlan.hour12]: '12 hours',
  [SessionExpiredPlan.hour24]: '24 hours',
  [SessionExpiredPlan.always]: 'Never',
};

export const SessionKeyArray = Object.entries(SessionKeyMap).map(([k, v]) => ({
  value: k === SessionExpiredPlan.always ? k : Number(k),
  label: v,
  children: v,
}));

export const REMEMBER_ME_ACTION_WHITELIST: string[] = [
  MethodsBase.SEND_TRANSACTION,
  MethodsBase.SEND_MULTI_TRANSACTION,
];

export const DefaultDapp = {
  origin: 'default',
};

export enum ApproveMethod {
  token = 'Approve',
  ca = 'ManagerApprove',
}

export const CA_METHOD_WHITELIST = ['ManagerForwardCall', 'ManagerTransfer', ApproveMethod.ca];

export const DAPP_WHITELIST_ACTION_WHITELIST: string[] = [
  MethodsBase.REQUEST_ACCOUNTS,
  MethodsBase.SEND_TRANSACTION,
  MethodsBase.SEND_MULTI_TRANSACTION,
  MethodsWallet.GET_WALLET_SIGNATURE,
];

export { DAPP_WHITELIST };

export const ETransTokenList = ['USDT'];

export const BATCH_APPROVAL_SYMBOL = '*';
