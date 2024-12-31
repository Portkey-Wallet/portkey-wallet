import { SessionExpiredPlan } from '@portkey-wallet/types/session';
import { MethodsBase, MethodsWallet } from '@portkey/provider-types';
import { DAPP_WHITELIST } from './network';

export const SessionKeyMap = {
  [SessionExpiredPlan.always]: 'Always',
  [SessionExpiredPlan.hour1]: 'After 1 hour',
  [SessionExpiredPlan.hour3]: 'After 3 hours',
  [SessionExpiredPlan.hour12]: 'After 12 hours',
  [SessionExpiredPlan.hour24]: 'After 24 hours',
  [SessionExpiredPlan.never]: 'Never',
};

export const SessionKeyArray = Object.entries(SessionKeyMap).map(([k, v]) => ({
  value: k === SessionExpiredPlan.never ? k : Number(k),
  label: v,
  children: v,
}));

export const REMEMBER_ME_ACTION_WHITELIST: string[] = [MethodsBase.SEND_TRANSACTION];

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
  MethodsWallet.GET_WALLET_SIGNATURE,
];

export { DAPP_WHITELIST };

export const ETransTokenList = ['USDT'];

export const BATCH_APPROVAL_SYMBOL = '*';
export const DAPP_SECURITY_DOMAIN_HINT = `The dApp's logo or domain may not be authentic. Please proceed with caution.`;
export const DAPP_SECURITY_SPENDER_INVALID = `The dApp's logo, domain, or address you're approving may not be authentic. Please proceed with caution.`;
