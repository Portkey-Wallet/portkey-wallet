import { createSlice } from '@reduxjs/toolkit';
import { ContactIndexType, ContactMapType } from 'packages/types/types-ca/contact';
import {
  fetchContactListAsync,
  addContactAction,
  editContactAction,
  deleteContactAction,
  resetContact,
  readImputationAction,
  refreshContactMap,
} from './actions';
import {
  executeEventToContactIndexList,
  getInitContactIndexList,
  sortContactIndexList,
  transIndexesToContactIdMap,
  transIndexesToContactMap,
  transIndexesToContactRelationIdMap,
} from './utils';

export interface ContactState {
  lastModified: number;
  contactIndexList: ContactIndexType[];
  contactMap: ContactMapType;
  contactRelationIdMap?: ContactMapType;
  contactIdMap?: ContactMapType;
  isImputation?: boolean;
}

export const initialState: ContactState = {
  lastModified: 0,
  contactIndexList: getInitContactIndexList(),
  contactMap: {},
  contactRelationIdMap: {},
  contactIdMap: {},
  isImputation: false,
};

export const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // getContactList
      .addCase(fetchContactListAsync.fulfilled, (state, action) => {
        const { isInit, lastModified, contactIndexList, eventList, isImputation } = action.payload;
        if (isInit && contactIndexList !== undefined) {
          state.contactIndexList = sortContactIndexList(contactIndexList);
          state.lastModified = lastModified;
          state.isImputation = isImputation;
        }

        if (!isInit && eventList !== undefined) {
          let _contactIndexList = [...state.contactIndexList];
          _contactIndexList = executeEventToContactIndexList(_contactIndexList, eventList);
          state.contactIndexList = sortContactIndexList(_contactIndexList);
          state.lastModified = lastModified;
          state.isImputation = isImputation;
        }

        if (state.contactIndexList.length === 0) {
          state.contactIndexList = getInitContactIndexList();
        }
        state.contactMap = transIndexesToContactMap(state.contactIndexList);
        state.contactRelationIdMap = transIndexesToContactRelationIdMap(state.contactIndexList);
        state.contactIdMap = transIndexesToContactIdMap(state.contactIndexList);
      })
      .addCase(fetchContactListAsync.rejected, (_state, action) => {
        console.log('fetchContactListAsync.rejected: error', action.error.message);
      })
      .addCase(addContactAction, (state, action) => {
        let _contactIndexList = [...state.contactIndexList];
        _contactIndexList = executeEventToContactIndexList(_contactIndexList, [action.payload]);
        state.contactIndexList = sortContactIndexList(_contactIndexList);
        state.contactMap = transIndexesToContactMap(state.contactIndexList);
        state.contactRelationIdMap = transIndexesToContactRelationIdMap(state.contactIndexList);
        state.contactIdMap = transIndexesToContactIdMap(state.contactIndexList);
      })
      .addCase(editContactAction, (state, action) => {
        let _contactIndexList = [...state.contactIndexList];
        _contactIndexList = executeEventToContactIndexList(_contactIndexList, [action.payload]);
        state.contactIndexList = sortContactIndexList(_contactIndexList);
        state.contactMap = transIndexesToContactMap(state.contactIndexList);
        state.contactRelationIdMap = transIndexesToContactRelationIdMap(state.contactIndexList);
        state.contactIdMap = transIndexesToContactIdMap(state.contactIndexList);
      })
      .addCase(deleteContactAction, (state, action) => {
        let _contactIndexList = [...state.contactIndexList];
        _contactIndexList = executeEventToContactIndexList(_contactIndexList, [action.payload]);
        state.contactIndexList = sortContactIndexList(_contactIndexList);
        state.contactMap = transIndexesToContactMap(state.contactIndexList);
        state.contactRelationIdMap = transIndexesToContactRelationIdMap(state.contactIndexList);
        state.contactIdMap = transIndexesToContactIdMap(state.contactIndexList);
      })
      .addCase(resetContact, state => {
        state.contactIndexList = getInitContactIndexList();
        state.contactMap = {};
        state.contactRelationIdMap = {};
        state.contactIdMap = {};
        state.lastModified = 0;
        state.isImputation = false;
      })
      .addCase(readImputationAction, (state, action) => {
        let _contactIndexList = [...state.contactIndexList];
        _contactIndexList = executeEventToContactIndexList(_contactIndexList, [action.payload]);
        state.contactIndexList = sortContactIndexList(_contactIndexList);
        state.contactMap = transIndexesToContactMap(state.contactIndexList);
        state.contactRelationIdMap = transIndexesToContactRelationIdMap(state.contactIndexList);
        state.contactIdMap = transIndexesToContactIdMap(state.contactIndexList);
      })
      .addCase(refreshContactMap, state => {
        state.contactMap = transIndexesToContactMap(state.contactIndexList);
        state.contactRelationIdMap = transIndexesToContactRelationIdMap(state.contactIndexList);
        state.contactIdMap = transIndexesToContactIdMap(state.contactIndexList);
      });
  },
});

export default contactSlice;
