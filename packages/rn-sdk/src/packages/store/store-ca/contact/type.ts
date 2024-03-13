import { ContactIndexType, ContactItemType } from 'packages/types/types-ca/contact';
import { ContactState } from './slice';

export interface FetchContractListAsyncPayloadType {
  isInit: boolean;
  contactIndexList?: ContactIndexType[];
  eventList?: ContactItemType[];
  lastModified: ContactState['lastModified'];
  isImputation: boolean;
}
