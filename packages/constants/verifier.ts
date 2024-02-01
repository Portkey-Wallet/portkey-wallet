import { LoginType } from '@portkey-wallet/types/types-ca/wallet';

export const LOGIN_TYPE_LABEL_MAP: { [key in LoginType]: string } = {
  [LoginType.Email]: 'Email',
  [LoginType.Phone]: 'Phone',
  [LoginType.Apple]: 'Apple',
  [LoginType.Google]: 'Google',
  [LoginType.Telegram]: 'Telegram',
  [LoginType.Twitter]: 'Twitter',
  [LoginType.Facebook]: 'Facebook',
};
