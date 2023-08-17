import { createSlice } from '@reduxjs/toolkit';

import { IMStateType, UpdateChannelAttributeTypeEnum } from './type';
import {
  removeChannel,
  nextChannelList,
  resetIm,
  setChannelList,
  setHasNext,
  updateChannelAttribute,
  setChannelMessageList,
  nextChannelMessageList,
  addChannelMessage,
  deleteChannelMessage,
} from './actions';
import { formatChannelList } from './util';

const initialState: IMStateType = {
  channelListNetMap: {},
  hasNextNetMap: {},
  channelMessageListNetMap: {},
};
export const imSlice = createSlice({
  name: 'im',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(setChannelList, (state, action) => {
        return {
          ...state,
          channelListNetMap: {
            ...state.channelListNetMap,
            [action.payload.network]: action.payload.channelList,
          },
        };
      })
      .addCase(nextChannelList, (state, action) => {
        const originList = state.channelListNetMap[action.payload.network]?.list || [];
        const channelList = {
          list: [...originList, ...action.payload.channelList.list],
          cursor: action.payload.channelList.cursor,
        };
        return {
          ...state,
          channelListNetMap: {
            ...state.channelListNetMap,
            [action.payload.network]: channelList,
          },
        };
      })
      .addCase(setHasNext, (state, action) => {
        return {
          ...state,
          hasNextNetMap: {
            ...state.hasNextNetMap,
            [action.payload.network]: action.payload.hasNext,
          },
        };
      })
      .addCase(updateChannelAttribute, (state, action) => {
        const preChannelList = state.channelListNetMap[action.payload.network];
        if (!preChannelList) return state;

        let channelList = {
          ...preChannelList,
          list: preChannelList.list.map(item => {
            if (item.channelUuid === action.payload.channelId) {
              return {
                ...item,
                ...action.payload.value,
                ...((): typeof action.payload.value => {
                  switch (action.payload.type) {
                    case UpdateChannelAttributeTypeEnum.UPDATE_UNREAD_CHANNEL:
                      return {
                        unreadMessageCount: item.unreadMessageCount + 1,
                      };
                    default:
                      return {};
                  }
                })(),
              };
            }
            return item;
          }),
        };
        channelList = formatChannelList(channelList);

        return {
          ...state,
          channelListNetMap: {
            ...state.channelListNetMap,
            [action.payload.network]: channelList,
          },
        };
      })
      .addCase(removeChannel, (state, action) => {
        const preChannelList = state.channelListNetMap[action.payload.network];
        if (!preChannelList) return state;
        let channelList = {
          ...preChannelList,
          list: preChannelList.list.filter(item => item.channelUuid !== action.payload.channelId),
        };
        channelList = formatChannelList(channelList);

        return {
          ...state,
          channelListNetMap: {
            ...state.channelListNetMap,
            [action.payload.network]: channelList,
          },
        };
      })
      .addCase(setChannelMessageList, (state, action) => {
        return {
          ...state,
          channelMessageListNetMap: {
            ...state.channelMessageListNetMap,
            [action.payload.network]: {
              ...state.channelMessageListNetMap?.[action.payload.network],
              [action.payload.channelId]: action.payload.list,
            },
          },
        };
      })
      .addCase(nextChannelMessageList, (state, action) => {
        return {
          ...state,
          channelMessageListNetMap: {
            ...state.channelMessageListNetMap,
            [action.payload.network]: {
              ...state.channelMessageListNetMap?.[action.payload.network],
              [action.payload.channelId]: [
                ...action.payload.list,
                ...(state.channelMessageListNetMap?.[action.payload.network]?.[action.payload.channelId] || []),
              ],
            },
          },
        };
      })
      .addCase(addChannelMessage, (state, action) => {
        return {
          ...state,
          channelMessageListNetMap: {
            ...state.channelMessageListNetMap,
            [action.payload.network]: {
              ...state.channelMessageListNetMap?.[action.payload.network],
              [action.payload.channelId]: [
                ...(state.channelMessageListNetMap?.[action.payload.network]?.[action.payload.channelId] || []),
                action.payload,
              ],
            },
          },
        };
      })
      .addCase(deleteChannelMessage, (state, action) => {
        return {
          ...state,
          channelMessageListNetMap: {
            ...state.channelMessageListNetMap,
            [action.payload.network]: {
              ...state.channelMessageListNetMap?.[action.payload.network],
              [action.payload.channelId]: [
                ...(state.channelMessageListNetMap?.[action.payload.network]?.[action.payload.channelId]?.filter(
                  item => item.sendUuid !== action.payload.sendUuid,
                ) || []),
              ],
            },
          },
        };
      })
      .addCase(resetIm, (state, action) => {
        return {
          ...state,
          channelListNetMap: {
            ...state.channelListNetMap,
            [action.payload]: undefined,
          },
          hasNextNetMap: {
            ...state.hasNextNetMap,
            [action.payload]: undefined,
          },
        };
      });
  },
});

export default imSlice;
