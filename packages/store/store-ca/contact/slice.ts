import { createSlice } from '@reduxjs/toolkit';
import { ContactIndexType, ContactMapType } from '@portkey-wallet/types/types-ca/contact';
import { IContactIndexType, IContactMapType } from '@portkey-wallet/types/types-ca/contactNew';
import {
  fetchContactListAsync,
  addContactAction,
  editContactAction,
  deleteContactAction,
  resetContact,
  refreshContactMap,
  fetchContactListV2Async,
  addContactActionNew,
  editContactActionNew,
  deleteContactActionNew,
  resetContactNew,
  refreshContactMapNew,
} from './actions';
import {
  executeEventToContactIndexList,
  getInitContactIndexList,
  sortContactIndexList,
  transIndexesToContactIdMap,
  transIndexesToContactMap,
  transIndexesToContactRelationIdMap,
  transIndexesToPortkeyIdMap,
  sortContactIndexListV2,
  executeEventToContactIndexListV2,
  getInitContactIndexListV2,
  transIndexesToContactMapV2,
  transIndexesToContactIdMapV2,
  transIndexesToPortkeyIdMapV2,
} from './utils';

export interface ContactState {
  lastModified: number;
  contactIndexList: ContactIndexType[];
  contactMap: ContactMapType;
  contactRelationIdMap?: ContactMapType;
  contactIdMap?: ContactMapType;
  contactPortkeyIdMap?: ContactMapType;
  lastModifiedNew: number;
  contactIndexListNew?: IContactIndexType[];
  contactMapNew?: IContactMapType;
  // contactRelationIdMapNew?: IContactMapType;
  contactIdMapNew?: IContactMapType;
  contactPortkeyIdMapNew?: IContactMapType;
}

export const initialState: ContactState = {
  lastModified: 0,
  contactIndexList: getInitContactIndexList(),
  contactMap: {},
  contactRelationIdMap: {},
  contactIdMap: {},
  lastModifiedNew: 0,
  contactIndexListNew: getInitContactIndexListV2(),
  contactMapNew: {},
  contactIdMapNew: {},
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
        state.contactRelationIdMap = transIndexesToContactRelationIdMap(state.contactIndexList);
        state.contactIdMap = transIndexesToContactIdMap(state.contactIndexList);
        state.contactPortkeyIdMap = transIndexesToPortkeyIdMap(state.contactIndexList);
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
        state.contactPortkeyIdMap = transIndexesToPortkeyIdMap(state.contactIndexList);
      })
      .addCase(editContactAction, (state, action) => {
        let _contactIndexList = [...state.contactIndexList];
        _contactIndexList = executeEventToContactIndexList(_contactIndexList, [action.payload]);
        state.contactIndexList = sortContactIndexList(_contactIndexList);
        state.contactMap = transIndexesToContactMap(state.contactIndexList);
        state.contactRelationIdMap = transIndexesToContactRelationIdMap(state.contactIndexList);
        state.contactIdMap = transIndexesToContactIdMap(state.contactIndexList);
        state.contactPortkeyIdMap = transIndexesToPortkeyIdMap(state.contactIndexList);
      })
      .addCase(deleteContactAction, (state, action) => {
        let _contactIndexList = [...state.contactIndexList];
        _contactIndexList = executeEventToContactIndexList(_contactIndexList, [action.payload]);
        state.contactIndexList = sortContactIndexList(_contactIndexList);
        state.contactMap = transIndexesToContactMap(state.contactIndexList);
        state.contactRelationIdMap = transIndexesToContactRelationIdMap(state.contactIndexList);
        state.contactIdMap = transIndexesToContactIdMap(state.contactIndexList);
        state.contactPortkeyIdMap = transIndexesToPortkeyIdMap(state.contactIndexList);
      })
      .addCase(resetContact, state => {
        state.contactIndexList = getInitContactIndexList();
        state.contactMap = {};
        state.contactRelationIdMap = {};
        state.contactIdMap = {};
        state.lastModified = 0;
      })
      .addCase(refreshContactMap, state => {
        state.contactMap = transIndexesToContactMap(state.contactIndexList);
        state.contactRelationIdMap = transIndexesToContactRelationIdMap(state.contactIndexList);
        state.contactIdMap = transIndexesToContactIdMap(state.contactIndexList);
        state.contactPortkeyIdMap = transIndexesToPortkeyIdMap(state.contactIndexList);
      })

      // getContactListV2
      .addCase(fetchContactListV2Async.fulfilled, (state, action) => {
        const { isInit, lastModified, contactIndexList, eventList } = action.payload;
        if (isInit && contactIndexList !== undefined) {
          state.contactIndexListNew = sortContactIndexListV2(contactIndexList);
          state.lastModified = lastModified;
        }

        if (!isInit && eventList !== undefined) {
          let _contactIndexListNew = [...(state.contactIndexListNew || [])];
          _contactIndexListNew = executeEventToContactIndexListV2(_contactIndexListNew, eventList);
          state.contactIndexListNew = sortContactIndexListV2(_contactIndexListNew);
          state.lastModified = lastModified;
        }

        if (state.contactIndexListNew?.length === 0) {
          state.contactIndexListNew = getInitContactIndexListV2();
        }
        state.contactMapNew = transIndexesToContactMapV2(state.contactIndexListNew || []);
        // TODO： if im delete, this is delete
        // state.contactRelationIdMap = transIndexesToContactRelationIdMap(state.contactIndexList);
        state.contactIdMapNew = transIndexesToContactIdMapV2(state.contactIndexListNew || []);
        state.contactPortkeyIdMapNew = transIndexesToPortkeyIdMapV2(state.contactIndexListNew || []);
      })
      .addCase(fetchContactListV2Async.rejected, (_state, action) => {
        console.log('fetchContactListAsync.rejected: error', action.error.message);
      })
      .addCase(addContactActionNew, (state, action) => {
        let _contactIndexListNew = [...(state.contactIndexListNew || [])];
        _contactIndexListNew = executeEventToContactIndexListV2(_contactIndexListNew, [action.payload]);
        state.contactIndexListNew = sortContactIndexListV2(_contactIndexListNew);
        state.contactMapNew = transIndexesToContactMapV2(state.contactIndexListNew);
        // TODO: delete it?
        // state.contactRelationIdMap = transIndexesToContactRelationIdMap(state.contactIndexList);
        state.contactIdMapNew = transIndexesToContactIdMapV2(state.contactIndexListNew);
        state.contactPortkeyIdMapNew = transIndexesToPortkeyIdMapV2(state.contactIndexListNew);
      })
      .addCase(editContactActionNew, (state, action) => {
        let _contactIndexListNew = [...(state.contactIndexListNew || [])];
        _contactIndexListNew = executeEventToContactIndexListV2(_contactIndexListNew, [action.payload]);
        state.contactIndexListNew = sortContactIndexListV2(_contactIndexListNew);
        state.contactMapNew = transIndexesToContactMapV2(state.contactIndexListNew);
        // state.contactRelationIdMap = transIndexesToContactRelationIdMap(state.contactIndexList);
        state.contactIdMapNew = transIndexesToContactIdMapV2(state.contactIndexListNew);
        state.contactPortkeyIdMapNew = transIndexesToPortkeyIdMapV2(state.contactIndexListNew);
      })
      .addCase(deleteContactActionNew, (state, action) => {
        let _contactIndexListNew = [...(state.contactIndexListNew || [])];
        _contactIndexListNew = executeEventToContactIndexListV2(_contactIndexListNew, [action.payload]);
        state.contactIndexListNew = sortContactIndexListV2(_contactIndexListNew);
        state.contactMapNew = transIndexesToContactMapV2(state.contactIndexListNew);
        // state.contactRelationIdMap = transIndexesToContactRelationIdMap(state.contactIndexList);
        state.contactIdMapNew = transIndexesToContactIdMapV2(state.contactIndexListNew);
        state.contactPortkeyIdMapNew = transIndexesToPortkeyIdMapV2(state.contactIndexListNew);
      })
      .addCase(resetContactNew, state => {
        state.contactIndexListNew = getInitContactIndexListV2();
        state.contactMapNew = {};
        state.contactIdMapNew = {};
        state.lastModifiedNew = 0;
      })
      .addCase(refreshContactMapNew, state => {
        state.contactMapNew = transIndexesToContactIdMapV2(state.contactIndexListNew || []);
        // state.contactRelationIdMapNew = transIndexesToContactRelationIdMapV2(state.contactIndexList);
        state.contactIdMapNew = transIndexesToContactIdMapV2(state.contactIndexListNew || []);
        state.contactPortkeyIdMapNew = transIndexesToPortkeyIdMapV2(state.contactIndexListNew || []);
      });
  },
});

export default contactSlice;
