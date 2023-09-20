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
};

export const CONTACT_PERMISSION_LABEL_LIST = [
  { text: CONTACT_PERMISSION_LABEL_MAP[ContactPermissionEnum.EVERY_BODY], id: ContactPermissionEnum.EVERY_BODY },
  { text: CONTACT_PERMISSION_LABEL_MAP[ContactPermissionEnum.MY_CONTACTS], id: ContactPermissionEnum.MY_CONTACTS },
  { text: CONTACT_PERMISSION_LABEL_MAP[ContactPermissionEnum.NOBODY], id: ContactPermissionEnum.NOBODY },
];
