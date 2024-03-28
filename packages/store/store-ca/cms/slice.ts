import { createSlice } from '@reduxjs/toolkit';
import {
  getDiscoverGroupAsync,
  getSocialMediaAsync,
  getTabMenuAsync,
  getRememberMeBlackListAsync,
  setEntrance,
  getLoginControlListAsync,
} from './actions';
import { CMSState, CmsWebsiteMapItem } from './types';

const initialState: CMSState = {
  socialMediaListNetMap: {},
  tabMenuListNetMap: {},
  discoverGroupListNetMap: {},
  rememberMeBlackListMap: {},
  entranceNetMap: {},
};
export const cmsSlice = createSlice({
  name: 'cms',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getSocialMediaAsync.fulfilled, (state, action) => {
        state.socialMediaListNetMap = {
          ...state.socialMediaListNetMap,
          ...action.payload.socialMediaListNetMap,
        };
      })
      .addCase(getTabMenuAsync.fulfilled, (state, action) => {
        state.tabMenuListNetMap = {
          ...state.tabMenuListNetMap,
          ...action.payload.tabMenuListNetMap,
        };
      })
      .addCase(getDiscoverGroupAsync.fulfilled, (state, action) => {
        const newWebSiteMap: { [url: string]: CmsWebsiteMapItem } = {};
        Object.values(action.payload.discoverGroupListNetMap).map(networkData => {
          networkData.map(group => {
            group.items.map(item => {
              newWebSiteMap[item.url] = {
                title: item.title,
                imgUrl: item.imgUrl,
              };
            });
          });
        });

        state.discoverGroupListNetMap = {
          ...state.discoverGroupListNetMap,
          ...action.payload.discoverGroupListNetMap,
        };

        state.cmsWebsiteMap = {
          ...state.cmsWebsiteMap,
          ...newWebSiteMap,
        };
      })
      .addCase(getRememberMeBlackListAsync.fulfilled, (state, action) => {
        state.rememberMeBlackListMap = {
          ...state.rememberMeBlackListMap,
          ...action.payload.rememberMeBlackListMap,
        };
      })
      .addCase(setEntrance, (state, action) => {
        state.entranceNetMap = {
          ...state.entranceNetMap,
          [action.payload.network]: action.payload.value,
        };
      })
      .addCase(getLoginControlListAsync.fulfilled, (state, action) => {
        console.log('getLoginControlListAsync', action.payload);
        state.loginModeListMap = {
          ...(state.loginModeListMap ?? {}),
          ...action.payload.loginModeListMap,
        };
      });
  },
});
