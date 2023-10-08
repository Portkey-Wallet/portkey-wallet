import { createSlice } from '@reduxjs/toolkit';
import { SecurityStateType } from './type';
import {
  nextTransferLimitList,
  resetSecurity,
  setContactPrivacyList,
  setTransferLimitList,
  updateContactPrivacy,
  updateTransferLimit,
} from './actions';

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
      .addCase(setTransferLimitList, (state, action) => {
        return {
          ...state,
          transferLimitListNetMap: {
            ...state.transferLimitListNetMap,
            [action.payload.network]: action.payload.value,
          },
        };
      })
      .addCase(nextTransferLimitList, (state, action) => {
        const { network, value } = action.payload;
        const listWithPagination = state.transferLimitListNetMap?.[network];
        if (!listWithPagination || listWithPagination.pagination.page + 1 !== value.pagination.page) {
          return state;
        }

        return {
          ...state,
          transferLimitListNetMap: {
            ...state.transferLimitListNetMap,
            [network]: {
              list: [...listWithPagination.list, ...value.list],
              pagination: value.pagination,
            },
          },
        };
      })
      .addCase(updateTransferLimit, (state, action) => {
        const { network, value } = action.payload;
        const listWithPagination = state.transferLimitListNetMap?.[network];
        if (!listWithPagination) return state;

        return {
          ...state,
          transferLimitListNetMap: {
            ...state.transferLimitListNetMap,
            [network]: {
              list: listWithPagination.list.map(item => {
                if (item.chainId === value.chainId && item.symbol === value.symbol) {
                  return {
                    ...item,
                    ...value,
                  };
                }
                return item;
              }),
              pagination: listWithPagination.pagination,
            },
          },
        };
      })
      .addCase(resetSecurity, (state, action) => {
        return {
          ...state,
          contactPrivacyListNetMap: {
            ...state.contactPrivacyListNetMap,
            [action.payload]: undefined,
          },
          transferLimitListNetMap: {
            ...state.transferLimitListNetMap,
            [action.payload]: undefined,
          },
        };
      });
  },
});

export default securitySlice;
