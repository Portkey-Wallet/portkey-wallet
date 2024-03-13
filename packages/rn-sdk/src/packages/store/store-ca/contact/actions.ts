import { createAsyncThunk, createAction } from '@reduxjs/toolkit';
import { ContactItemType } from 'packages/types/types-ca/contact';
import { ContactState } from './slice';
import { FetchContractListAsyncPayloadType } from './type';
import { CONTACT_API_FETCH_SIZE, CONTACT_API_RETRY_LIMIT } from 'packages/constants/constants-ca/contact';
import { transContactsToIndexes } from './utils';
import { WalletState } from '../wallet/type';
import { NetworkList } from 'packages/constants/constants-ca/network';
import {
  getContactList as getContactListEs,
  getContactEventList as getContactEventListEs,
} from 'packages/api/api-did/es/utils';

export const fetchContactListAsync = createAsyncThunk<FetchContractListAsyncPayloadType, boolean | undefined>(
  'contact/fetchContactListAsync',
  async (isInit = false, thunkAPI) => {
    const {
      contact: contactState,
      wallet: { currentNetwork },
    } = thunkAPI.getState() as {
      contact: ContactState;
      wallet: WalletState;
    };
    const baseUrl = NetworkList.find(item => item.networkType === currentNetwork)?.apiUrl;
    if (!baseUrl)
      return {
        isInit: true,
        contactIndexList: [],
        isImputation: false,
        lastModified: 0,
      };

    // init
    let contactList: ContactItemType[] = [];
    if (isInit || contactState.lastModified === 0) {
      let page = 1,
        errorTimes = 0,
        totalCount = 0,
        isImputation = false;

      const modificationTime = Date.now();
      while (page === 1 || contactList.length < totalCount) {
        try {
          console.log('getContactList', page, errorTimes);
          const response = await getContactListEs(baseUrl, {
            page,
            size: CONTACT_API_FETCH_SIZE,
            modificationTime: new Date(modificationTime).toISOString(),
          });
          console.log('getContactList: response', response);
          response.items.forEach(item => (item.modificationTime = new Date(item.modificationTime).getTime()));
          contactList = contactList.concat(response.items);
          isImputation = contactList.some(item => item.isImputation);
          totalCount = response.totalCount;
          errorTimes = 0;
          page++;
        } catch (err) {
          errorTimes++;
          console.log('getContactList: error', errorTimes);
          if (errorTimes >= CONTACT_API_RETRY_LIMIT) {
            throw new Error(`getContactList errorTimes too many ${err}`);
          }
        }
      }

      if (contactList.length === 0) {
        throw new Error('getContactList no data');
      }

      return {
        isInit: true,
        contactIndexList: transContactsToIndexes(contactList),
        isImputation,
        lastModified: modificationTime,
      };
    }

    // update getContactEventList
    let eventList: ContactItemType[] = [];
    let page = 1,
      errorTimes = 0,
      totalCount = 0,
      isImputation = false;

    const lastModified = contactState.lastModified;
    const fetchTime = Date.now();

    while (page === 1 || eventList.length < totalCount) {
      try {
        console.log('getContactEventList', page, errorTimes);
        const response = await getContactEventListEs(baseUrl, {
          modificationTime: new Date(lastModified).toISOString(),
          fetchTime: new Date(fetchTime).toISOString(),
          page,
          size: CONTACT_API_FETCH_SIZE,
        });
        console.log('getContactEventList: response', response);
        response.items.forEach(item => (item.modificationTime = new Date(item.modificationTime).getTime()));
        eventList = eventList.concat(response.items);
        isImputation = eventList.some(item => item.isImputation);
        totalCount = response.totalCount;
        errorTimes = 0;
        page++;
      } catch (err) {
        errorTimes++;
        if (errorTimes >= CONTACT_API_RETRY_LIMIT) {
          throw Error(`getContactEventList errorTimes too many ${err}`);
        }
      }
    }

    if (eventList.length === 0) {
      throw new Error('getContactEventList no data');
    }

    return {
      isInit: false,
      eventList,
      isImputation,
      lastModified: fetchTime,
    };
  },
);

export const addContactAction = createAction<ContactItemType>('contact/addContract');

export const editContactAction = createAction<ContactItemType>('contact/editContract');

export const deleteContactAction = createAction<ContactItemType>('contact/deleteContract');

export const resetContact = createAction<void>('contact/resetContact');

export const readImputationAction = createAction<ContactItemType>('contact/readImputation');

export const refreshContactMap = createAction<void>('contact/refreshContactMap');
