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
  setActivityModalShowed,
  setActivityModalCurrentTimeShowed,
  getActivityModalAsync,
  resetCms,
} from './actions';
import { CMSState, CmsWebsiteMapItem } from './types';
import { NetworkType } from '@portkey-wallet/types';

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
  activityModalListMap: {},
  activityModalListLoaded: {},
  currentShowedAcModalListMap: {},
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
      })
      .addCase(getActivityModalAsync.fulfilled, (state, action) => {
        // state.activityModalListMap
        const key = Object.keys(action.payload.activityModalListMap)[0] as NetworkType;
        state.activityModalListLoaded = {
          ...(state.activityModalListLoaded ?? {}),
          [key]: true,
        };
        const networkResult = action.payload.activityModalListMap?.[key];
        const currentActivityModalList = state.activityModalListMap?.[key];
        networkResult?.forEach(networkItem => {
          const existingItem = currentActivityModalList?.find(item => item.id === networkItem.id);
          if (existingItem) {
            const isOtherFieldsEqual = Object.keys(networkItem).every(key => {
              return key === 'showed' || networkItem[key] === existingItem[key];
            });
            if (isOtherFieldsEqual) {
              networkItem.showed = existingItem.showed;
            }
          }
        });
        console.log('wfs key is:', key);
        console.log('wfs networkResult is:', JSON.stringify(networkResult));
        console.log('wfs currentActivityModalList is:', JSON.stringify(currentActivityModalList));
        state.activityModalListMap = {
          ...(state.activityModalListMap ?? {}),
          [key]: networkResult,
          // ...action.payload.activityModalListMap,
        };
        console.log('wfs getActivityModalAsync result', JSON.stringify(state.activityModalListMap));
      })
      .addCase(setActivityModalShowed, (state, action) => {
        console.log(
          'setActivityModalShowed1 state.activityModalListMap[action.payload.network]',
          JSON.stringify(state.activityModalListMap[action.payload.network]),
          'action.payload.network',
          action.payload.network,
          'typeof',
          typeof state.activityModalListMap[action.payload.network],
          'length',
          state.activityModalListMap[action.payload.network]?.length,
        );
        const result = state.activityModalListMap[action.payload.network]?.find(item => item.id === action.payload.id);
        console.log('setActivityModalShowed1 find result', JSON.stringify(result));
        if (result) {
          result.showed = true;
        }
        const newArray = [...(state.activityModalListMap[action.payload.network] || [])];
        console.log('setActivityModalShowed1 result111', state.activityModalListMap[action.payload.network]?.length);
        console.log('setActivityModalShowed1 result222', newArray.length);
        state.activityModalListMap = {
          ...state.activityModalListMap,
          [action.payload.network]: newArray,
        };
        console.log(
          'setActivityModalShowed2 state.activityModalListMap[action.payload.network]',
          typeof newArray,
          'length',
          newArray.length,
          'state.activityModalListMap',
          state.activityModalListMap[action.payload.network],
        );
      })
      .addCase(setActivityModalCurrentTimeShowed, (state, action) => {
        console.log(
          'setActivityModalCurrentTimeShowed1 state.currentShowedAcModalListMap[action.payload.network]',
          JSON.stringify(state.currentShowedAcModalListMap[action.payload.network]),
          'action.payload.network',
          action.payload.network,
        );
        const result = state.currentShowedAcModalListMap[action.payload.network]?.find(
          item => item.id === action.payload.id,
        );
        console.log('setActivityModalCurrentTimeShowed1 find result', result);
        if (result) {
          result.currentTimeShowed = true;
        } else {
          if (!state.currentShowedAcModalListMap[action.payload.network]) {
            state.currentShowedAcModalListMap[action.payload.network] = [];
          }
          state.currentShowedAcModalListMap[action.payload.network]?.push({
            id: action.payload.id,
            currentTimeShowed: true,
          });
        }
        state.currentShowedAcModalListMap = {
          ...state.currentShowedAcModalListMap,
        };
        console.log(
          'setActivityModalCurrentTimeShowed2 state.currentShowedAcModalListMap[action.payload.network]',
          JSON.stringify(state.currentShowedAcModalListMap[action.payload.network]),
        );
      })
      .addCase(resetCms, (state, action) => {
        return {
          ...state,
          activityModalListLoaded: {
            ...state.activityModalListLoaded,
            [action.payload]: undefined,
          },
          activityModalListMap: {
            ...state.activityModalListMap,
            [action.payload]: undefined,
          },
          currentShowedAcModalListMap: {
            ...state.currentShowedAcModalListMap,
            [action.payload]: undefined,
          },
        };
      });
  },
});
