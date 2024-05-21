import { isValidEmail } from './reg';
export enum EmailError {
  noEmail = 'Please enter email address',
  invalidEmail = 'Invalid email address',
  alreadyRegistered = 'This address is already registered',
  noAccount = 'Failed to log in with this email. Please use your login account.',
}

export function checkEmail(email?: string): void | string {
  if (!email) return EmailError.noEmail;
  if (!isValidEmail(email)) return EmailError.invalidEmail;
}

export function checkHolderError(message?: string, code?: string) {
  if (code === '3002') return EmailError.noAccount;
  if (message?.includes('Not found ca_hash')) return EmailError.noAccount;
  if (message?.includes('not exist')) return EmailError.noAccount;
  return message;
}

export const CHAIN_ADDRESS_RULE: Array<{ syntax: RegExp; chainName: Array<string> }> = [
  {
    syntax: /^0x[a-fA-F0-9]{40}$/,
    chainName: ['ETH', 'BSC', 'ARBITRUM', 'MATIC', 'OPTIMISM', 'AVAXC'],
  },
  {
    syntax: /^T[1-9A-HJ-NP-Za-km-z]{33}$/,
    chainName: ['TRX'],
  },
  {
    syntax: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
    chainName: ['Solana'],
  },
];

export function checkIsValidEtransferAddress(ads = '') {
  return CHAIN_ADDRESS_RULE.some(item => item.syntax.test(ads));
}
