import { IEditContactItemApiType } from '@portkey-wallet/types/types-ca/contactNew';

export interface IEditContactItemFormType {
  contactName: IEditContactItemApiType['name'];
  addressInfo: Omit<IEditContactItemApiType, 'name'>;
}
