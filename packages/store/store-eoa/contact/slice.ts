import { createSlice } from '@reduxjs/toolkit';
import { IContactIndexType, IContactMapType } from '@portkey-wallet/types/types-eoa/contact';
import { setContactAction, resetContact, refreshContactMap } from './actions';
import {
  sortContactIndexList,
  executeEventToContactIndexList,
  getInitContactIndexList,
  transIndexesToContactMap,
  transIndexesToContactIdMap,
} from './utils';
import { NetworkType } from '@portkey-wallet/types';

export type TContactState = {
  contactIndexList?: {
    [T in NetworkType]?: IContactIndexType[];
  };
  contactMap?: {
    [T in NetworkType]?: IContactMapType;
  };
  contactIdMap?: {
    [T in NetworkType]?: IContactMapType;
  };
};

export const initialState: TContactState = {
  contactIndexList: {
    MAINNET: getInitContactIndexList(),
    TESTNET: getInitContactIndexList(),
  },
  contactMap: {},
  contactIdMap: {},
};

export const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(setContactAction, (state, action) => {
        const { network, item } = action.payload;
        let _contactIndexList = [...(state.contactIndexList?.[network] || [])];
        _contactIndexList = executeEventToContactIndexList(_contactIndexList, [item]);

        state.contactIndexList = {
          ...state.contactIndexList,
          [network]: sortContactIndexList(_contactIndexList),
        };
        state.contactMap = {
          ...state.contactMap,
          [network]: transIndexesToContactMap(_contactIndexList),
        };
        state.contactIdMap = {
          ...state.contactIdMap,
          [network]: transIndexesToContactIdMap(_contactIndexList),
        };
      })
      .addCase(resetContact, (state, action) => {
        const { network } = action.payload;
        state.contactIndexList = {
          ...state.contactIndexList,
          [network]: getInitContactIndexList(),
        };
        state.contactMap = {
          ...state.contactMap,
          [network]: undefined,
        };
        state.contactIdMap = {
          ...state.contactIdMap,
          [network]: undefined,
        };
      })
      .addCase(refreshContactMap, state => {
        state.contactMap = {
          MAINNET: transIndexesToContactMap(state.contactIndexList?.['MAINNET'] || []),
          TESTNET: transIndexesToContactMap(state.contactIndexList?.['TESTNET'] || []),
        };
        state.contactIdMap = {
          MAINNET: transIndexesToContactIdMap(state.contactIndexList?.['MAINNET'] || []),
          TESTNET: transIndexesToContactIdMap(state.contactIndexList?.['TESTNET'] || []),
        };
      });
  },
});

export default contactSlice;
