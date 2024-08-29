import { LOGIN_TYPE_LABEL_MAP } from '@portkey-wallet/constants/verifier';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { IconName } from 'components/Svg';

export const LOGIN_GUARDIAN_TYPE_ICON: any = {
  [LoginType.Email]: 'email',
  [LoginType.Phone]: 'phone',
  [LoginType.Google]: 'google',
  [LoginType.Apple]: 'apple',
  [LoginType.Telegram]: 'telegram',
  [LoginType.Twitter]: 'twitter',
  [LoginType.Facebook]: 'facebook',
  [LoginType.Ton]: 'ton',
};

export type T_LOGIN_TYPE_LIST_ITEM = {
  value: LoginType;
  name: string;
  icon: IconName;
};
export const LOGIN_TYPE_LIST: T_LOGIN_TYPE_LIST_ITEM[] = [
  {
    value: LoginType.Email,
    name: LOGIN_TYPE_LABEL_MAP[LoginType.Email],
    icon: LOGIN_GUARDIAN_TYPE_ICON[LoginType.Email],
  },
  {
    value: LoginType.Phone,
    name: LOGIN_TYPE_LABEL_MAP[LoginType.Phone],
    icon: LOGIN_GUARDIAN_TYPE_ICON[LoginType.Phone],
  },
  {
    value: LoginType.Google,
    name: LOGIN_TYPE_LABEL_MAP[LoginType.Google],
    icon: LOGIN_GUARDIAN_TYPE_ICON[LoginType.Google],
  },
  {
    value: LoginType.Apple,
    name: LOGIN_TYPE_LABEL_MAP[LoginType.Apple],
    icon: LOGIN_GUARDIAN_TYPE_ICON[LoginType.Apple],
  },
  {
    value: LoginType.Telegram,
    name: LOGIN_TYPE_LABEL_MAP[LoginType.Telegram],
    icon: LOGIN_GUARDIAN_TYPE_ICON[LoginType.Telegram],
  },
  {
    value: LoginType.Twitter,
    name: LOGIN_TYPE_LABEL_MAP[LoginType.Twitter],
    icon: LOGIN_GUARDIAN_TYPE_ICON[LoginType.Twitter],
  },
  {
    value: LoginType.Facebook,
    name: LOGIN_TYPE_LABEL_MAP[LoginType.Facebook],
    icon: LOGIN_GUARDIAN_TYPE_ICON[LoginType.Facebook],
  },
];

export enum ListLoadingEnum {
  hide = 0,
  header,
  footer,
}
