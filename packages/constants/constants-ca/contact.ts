import { ContactPermissionEnum } from '@portkey-wallet/types/types-ca/contact';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';

export const CONTACT_API_RETRY_LIMIT = 5;
export const CONTACT_API_FETCH_SIZE = 500;
export const ADDRESS_NUM_LIMIT = 5;

export const CONTACT_PERMISSION_LABEL_MAP = {
  [ContactPermissionEnum.EVERY_BODY]: 'Everybody',
  [ContactPermissionEnum.MY_CONTACTS]: 'My Contacts',
  [ContactPermissionEnum.NOBODY]: 'Nobody',
};

export const CONTACT_PRIVACY_TYPE_LABEL_MAP: { [key in LoginType]: string } = {
  [LoginType.Email]: 'Email',
  [LoginType.Phone]: 'Phone Number',
  [LoginType.Apple]: 'Apple ID',
  [LoginType.Google]: 'Google Account',
  [LoginType.Telegram]: 'Telegram Account',
  [LoginType.Facebook]: 'Facebook Account',
  [LoginType.Twitter]: 'Twitter Account',
};

export const CONTACT_PRIVACY_TYPE_LOWER_LABEL_MAP: { [key in LoginType]: string } = {
  [LoginType.Email]: 'Email',
  [LoginType.Phone]: 'Phone Number',
  [LoginType.Apple]: 'Apple ID',
  [LoginType.Google]: 'Google Account',
  [LoginType.Telegram]: 'Telegram Account',
  [LoginType.Facebook]: 'Facebook Account',
  [LoginType.Twitter]: 'Twitter Account',
};

export const CONTACT_PERMISSION_LIST = [
  {
    label: CONTACT_PERMISSION_LABEL_MAP[ContactPermissionEnum.EVERY_BODY],
    value: ContactPermissionEnum.EVERY_BODY,
  },
  {
    label: CONTACT_PERMISSION_LABEL_MAP[ContactPermissionEnum.MY_CONTACTS],
    value: ContactPermissionEnum.MY_CONTACTS,
  },
  {
    label: CONTACT_PERMISSION_LABEL_MAP[ContactPermissionEnum.NOBODY],
    value: ContactPermissionEnum.NOBODY,
  },
];

export const SOCIAL_GUARDIAN_TYPE: LoginType[] = [
  LoginType.Apple,
  LoginType.Google,
  LoginType.Telegram,
  LoginType.Twitter,
  LoginType.Facebook,
];
