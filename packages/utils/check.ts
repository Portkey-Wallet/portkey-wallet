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

export function checkIsValidEtransferAddress(ads = '') {
  return ads.length >= 32 && ads.length <= 59;
}
