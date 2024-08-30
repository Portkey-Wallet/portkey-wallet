import { LoginType } from '@portkey-wallet/types/types-ca/wallet';

export type T_LOGIN_TYPE_LABEL_MAP = { [key in LoginType]: string };

export const LOGIN_TYPE_LABEL_MAP: T_LOGIN_TYPE_LABEL_MAP = {
  [LoginType.Email]: 'Email',
  [LoginType.Phone]: 'Phone',
  [LoginType.Apple]: 'Apple',
  [LoginType.Google]: 'Google',
  [LoginType.Telegram]: 'Telegram',
  [LoginType.Twitter]: 'Twitter',
  [LoginType.Facebook]: 'Facebook',
  [LoginType.TonWallet]: 'TonWallet',
};
