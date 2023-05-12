import { createSlice } from '@reduxjs/toolkit';
import { ContactIndexType, ContactMapType } from '@portkey-wallet/types/types-ca/contact';
import {
  fetchContactListAsync,
  addContactAction,
  editContactAction,
  deleteContactAction,
  resetContact,
} from './actions';
import {
  executeEventToContactIndexList,
  getInitContactIndexList,
  sortContactIndexList,
  transIndexesToContactMap,
} from './utils';

export interface ContactState {
  lastModified: number;
  contactIndexList: ContactIndexType[];
  contactMap: ContactMapType;
}

export const initialState: ContactState = {
  lastModified: 0,
  contactIndexList: getInitContactIndexList(),
  contactMap: {},
};

export const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // getContactList
      .addCase(fetchContactListAsync.fulfilled, (state, action) => {
        const { isInit, lastModified, contactIndexList, eventList } = action.payload;
        if (isInit && contactIndexList !== undefined) {
          state.contactIndexList = sortContactIndexList(contactIndexList);
          state.lastModified = lastModified;
        }

        if (!isInit && eventList !== undefined) {
          let _contactIndexList = [...state.contactIndexList];
          _contactIndexList = executeEventToContactIndexList(_contactIndexList, eventList);
          state.contactIndexList = sortContactIndexList(_contactIndexList);
          state.lastModified = lastModified;
        }

        if (state.contactIndexList.length === 0) {
          state.contactIndexList = getInitContactIndexList();
        }
        state.contactMap = transIndexesToContactMap(state.contactIndexList);
      })
      .addCase(fetchContactListAsync.rejected, (_state, action) => {
        console.log('fetchContactListAsync.rejected: error', action.error.message);
      })
      .addCase(addContactAction, (state, action) => {
        let _contactIndexList = [...state.contactIndexList];
        _contactIndexList = executeEventToContactIndexList(_contactIndexList, [action.payload]);
        state.contactIndexList = sortContactIndexList(_contactIndexList);
      })
      .addCase(editContactAction, (state, action) => {
        let _contactIndexList = [...state.contactIndexList];
        _contactIndexList = executeEventToContactIndexList(_contactIndexList, [action.payload]);
        state.contactIndexList = sortContactIndexList(_contactIndexList);
      })
      .addCase(deleteContactAction, (state, action) => {
        let _contactIndexList = [...state.contactIndexList];
        _contactIndexList = executeEventToContactIndexList(_contactIndexList, [action.payload]);
        state.contactIndexList = sortContactIndexList(_contactIndexList);
      })
      .addCase(resetContact, state => {
        state.contactIndexList = getInitContactIndexList();
        state.contactMap = {};
        state.lastModified = 0;
      });
  },
});

export default contactSlice;
