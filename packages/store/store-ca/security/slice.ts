import { createSlice } from '@reduxjs/toolkit';
import { SecurityStateType } from './type';
import { resetSecurity, setContactPrivacyList, updateContactPrivacy } from './actions';

const initialState: SecurityStateType = {
  contactPrivacyListNetMap: {},
};
export const securitySlice = createSlice({
  name: 'security',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(setContactPrivacyList, (state, action) => {
        state.contactPrivacyListNetMap[action.payload.network] = action.payload.list;
      })
      .addCase(updateContactPrivacy, (state, action) => {
        const { network, value } = action.payload;
        const list = state.contactPrivacyListNetMap[network] || [];
        state.contactPrivacyListNetMap[network] = list.map(item => {
          if (item.identifier === value.identifier && item.privacyType === value.privacyType) {
            return value;
          }
          return item;
        });
      })
      .addCase(resetSecurity, (state, action) => {
        return {
          ...state,
          contactPrivacyListNetMap: {
            ...state.contactPrivacyListNetMap,
            [action.payload]: undefined,
          },
        };
      });
  },
});

export default securitySlice;
