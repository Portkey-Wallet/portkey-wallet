import { createSlice } from '@reduxjs/toolkit';
import {
  getDiscoverGroupAsync,
  getSocialMediaAsync,
  getTabMenuAsync,
  getRememberMeBlackListAsync,
  setEntrance,
  getLoginControlListAsync,
  getHomeBannerListAsync,
  getTokenDetailBannerAsync,
  getDiscoverDappBannerAsync,
  getDiscoverLearnBannerAsync,
  getDiscoverTabAsync,
  getDiscoverEarnAsync,
  getDiscoverLearnAsync,
} from './actions';
import { CMSState, CmsWebsiteMapItem } from './types';
import { deepEqual } from './deepEqual';

const initialState: CMSState = {
  socialMediaListNetMap: {},
  tabMenuListNetMap: {},
  discoverGroupListNetMap: {},
  rememberMeBlackListMap: {},
  entranceNetMap: {},
  homeBannerListMap: {},
  tokenDetailBannerListMap: {},
  discoverDappBannerListMap: {},
  discoverLearnBannerListMap: {},
  discoverTabListMap: {},
  discoverEarnListMap: {},
  discoverLearnGroupListMap: {},
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
        if (state.entranceNetMap && deepEqual(state.entranceNetMap[action.payload.network], action.payload.value)) {
          return;
        }
        state.entranceNetMap = {
          ...state.entranceNetMap,
          [action.payload.network]: action.payload.value,
        };
      })
      .addCase(getLoginControlListAsync.fulfilled, (state, action) => {
        state.loginModeListMap = {
          ...(state.loginModeListMap ?? {}),
          ...action.payload.loginModeListMap,
        };
      })
      .addCase(getHomeBannerListAsync.fulfilled, (state, action) => {
        state.homeBannerListMap = {
          ...(state.homeBannerListMap ?? {}),
          ...action.payload.homeBannerListMap,
        };
      })
      .addCase(getTokenDetailBannerAsync.fulfilled, (state, action) => {
        state.tokenDetailBannerListMap = {
          ...(state.tokenDetailBannerListMap ?? {}),
          ...action.payload.tokenDetailBannerListMap,
        };
      })
      .addCase(getDiscoverDappBannerAsync.fulfilled, (state, action) => {
        state.discoverDappBannerListMap = {
          ...(state.discoverDappBannerListMap ?? {}),
          ...action.payload.discoverDappBannerListMap,
        };
      })
      .addCase(getDiscoverLearnBannerAsync.fulfilled, (state, action) => {
        state.discoverLearnBannerListMap = {
          ...(state.discoverLearnBannerListMap ?? {}),
          ...action.payload.discoverLearnBannerListMap,
        };
      })
      .addCase(getDiscoverTabAsync.fulfilled, (state, action) => {
        state.discoverTabListMap = {
          ...(state.discoverTabListMap ?? {}),
          ...action.payload.discoverTabListMap,
        };
      })
      .addCase(getDiscoverEarnAsync.fulfilled, (state, action) => {
        state.discoverEarnListMap = {
          ...(state.discoverEarnListMap ?? {}),
          ...action.payload.discoverEarnListMap,
        };
      })
      .addCase(getDiscoverLearnAsync.fulfilled, (state, action) => {
        state.discoverLearnGroupListMap = {
          ...(state.discoverLearnGroupListMap ?? {}),
          ...action.payload.discoverLearnGroupListMap,
        };
      });
  },
});
