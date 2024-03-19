import { LoginType } from '@portkey-wallet/types/types-ca/wallet';

export const LoginGuardianTypeIcon: any = {
  [LoginType.Email]: 'email',
  [LoginType.Phone]: 'phone',
  [LoginType.Google]: 'google-icon',
  [LoginType.Apple]: 'apple-icon',
};

const LOGIN_TYPE_LABEL_MAP: { [key in LoginType]: string } = {
  [LoginType.Email]: 'Email',
  [LoginType.Phone]: 'Phone',
  [LoginType.Apple]: 'Apple',
  [LoginType.Google]: 'Google',
};
export const LOGIN_TYPE_LIST = [
  {
    value: LoginType.Email,
    name: LOGIN_TYPE_LABEL_MAP[LoginType.Email],
    icon: LoginGuardianTypeIcon[LoginType.Email],
  },
  {
    value: LoginType.Google,
    name: LOGIN_TYPE_LABEL_MAP[LoginType.Google],
    icon: LoginGuardianTypeIcon[LoginType.Google],
  },
  {
    value: LoginType.Apple,
    name: LOGIN_TYPE_LABEL_MAP[LoginType.Apple],
    icon: LoginGuardianTypeIcon[LoginType.Apple],
  },
];
