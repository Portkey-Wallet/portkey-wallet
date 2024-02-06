import { LOGIN_TYPE_LABEL_MAP } from '@portkey-wallet/constants/verifier';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';

export const LoginGuardianTypeIcon: any = {
  [LoginType.Email]: 'email',
  // [LoginType.Phone]: 'phone',
  [LoginType.Google]: 'google',
  [LoginType.Apple]: 'apple',
  [LoginType.Telegram]: 'telegram',
  [LoginType.Twitter]: 'twitter',
  [LoginType.Facebook]: 'facebook',
};

export const LOGIN_TYPE_LIST = [
  {
    value: LoginType.Email,
    name: LOGIN_TYPE_LABEL_MAP[LoginType.Email],
    icon: LoginGuardianTypeIcon[LoginType.Email],
  },
  // {
  //   value: LoginType.Phone,
  //   name: LOGIN_TYPE_LABEL_MAP[LoginType.Phone],
  //   icon: LoginGuardianTypeIcon[LoginType.Phone],
  // },
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
  {
    value: LoginType.Telegram,
    name: LOGIN_TYPE_LABEL_MAP[LoginType.Telegram],
    icon: LoginGuardianTypeIcon[LoginType.Telegram],
  },
  {
    value: LoginType.Twitter,
    name: LOGIN_TYPE_LABEL_MAP[LoginType.Twitter],
    icon: LoginGuardianTypeIcon[LoginType.Twitter],
  },
  {
    value: LoginType.Facebook,
    name: LOGIN_TYPE_LABEL_MAP[LoginType.Facebook],
    icon: LoginGuardianTypeIcon[LoginType.Facebook],
  },
];
