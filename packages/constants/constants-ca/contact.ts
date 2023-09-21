import { ContactPermissionEnum } from '@portkey-wallet/types/types-ca/contact';

export const CONTACT_API_RETRY_LIMIT = 5;
export const CONTACT_API_FETCH_SIZE = 500;
export const ADDRESS_NUM_LIMIT = 5;

export const CONTACT_PERMISSION_LABEL_MAP = {
  [ContactPermissionEnum.EVERY_BODY]: 'Everybody',
  [ContactPermissionEnum.MY_CONTACTS]: 'My Contacts',
  [ContactPermissionEnum.NOBODY]: 'Nobody',
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
