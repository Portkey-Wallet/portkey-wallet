import { createSlice } from '@reduxjs/toolkit';
import {
  getDiscoverGroupAsync,
  getSocialMediaAsync,
  getTabMenuAsync,
  getBuyButtonAsync,
  getRememberMeBlackListAsync,
  getEntranceControlAsync,
} from './actions';
import { CMSState, CmsWebsiteMapItem } from './types';

const initialState: CMSState = {
  socialMediaListNetMap: {},
  tabMenuListNetMap: {},
  discoverGroupListNetMap: {},
  buyButtonNetMap: {},
  rememberMeBlackListMap: {},
  cmsWebsiteMap: {},
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
        state.discoverGroupListNetMap = {
          ...state.discoverGroupListNetMap,
          ...action.payload.discoverGroupListNetMap,
        };

        const newWebSiteMap: { [url: string]: CmsWebsiteMapItem } = {};
        Object.values(action.payload.discoverGroupListNetMap).map(networkData => {
          networkData.map(group => {
            group.items.map(item => {
              if (!!item.url && !state.cmsWebsiteMap?.[item.url]) {
                newWebSiteMap[item.url] = {
                  title: item.title,
                  imgUrl: item.imgUrl,
                };
              }
            });
          });
        });

        state.cmsWebsiteMap = {
          ...state.cmsWebsiteMap,
          ...newWebSiteMap,
        };
      })
      .addCase(getBuyButtonAsync.fulfilled, (state, action) => {
        state.buyButtonNetMap = {
          ...state.buyButtonNetMap,
          ...action.payload.buyButtonNetMap,
        };
      })
      .addCase(getEntranceControlAsync.fulfilled, (state, action) => {
        state.entranceControlNetMap = {
          ...state.entranceControlNetMap,
          ...action.payload.entranceControlNetMap,
        };
      })
      .addCase(getRememberMeBlackListAsync.fulfilled, (state, action) => {
        state.rememberMeBlackListMap = {
          ...state.rememberMeBlackListMap,
          ...action.payload.rememberMeBlackListMap,
        };
      });
  },
});
