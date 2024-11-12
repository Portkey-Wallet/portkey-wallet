import { ContactIndexType, ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import { IContactIndexType, IContactItemType } from '@portkey-wallet/types/types-ca/contactNew';
import { ContactState } from './slice';

export interface FetchContractListAsyncPayloadType {
  isInit: boolean;
  contactIndexList?: ContactIndexType[];
  eventList?: ContactItemType[];
  lastModified: ContactState['lastModified'];
}

export interface FetchContactListAsyncPayloadTypeV2 {
  isInit: boolean;
  contactIndexList?: IContactIndexType[];
  eventList?: IContactItemType[];
  lastModified: ContactState['lastModifiedNew'];
}
