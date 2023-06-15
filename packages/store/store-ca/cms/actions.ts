import { createAsyncThunk } from '@reduxjs/toolkit';
import { CMSState } from './types';
import { NetworkType } from '@portkey-wallet/types';
import { getDiscoverGroup, getSocialMedia, getTabMenu } from '@portkey-wallet/graphql/cms/queries';

export const getSocialMediaAsync = createAsyncThunk<Required<Pick<CMSState, 'socialMediaListNetMap'>>, NetworkType>(
  'cms/getSocialMediaAsync',
  async (network: NetworkType) => {
    const result = await getSocialMedia(network, {
      sort: 'index',
      limit: -1,
      filter: {
        status: {
          _eq: 'published',
        },
      },
    });

    if (result.data.socialMedia && Array.isArray(result.data.socialMedia)) {
      return {
        socialMediaListNetMap: {
          [network]: result.data.socialMedia,
        },
      };
    } else {
      throw new Error('getSocialMediaAsync error');
    }
  },
);

export const getTabMenuAsync = createAsyncThunk<Required<Pick<CMSState, 'tabMenuListNetMap'>>, NetworkType>(
  'cms/getTabMenuAsync',
  async (network: NetworkType) => {
    const result = await getTabMenu(network, {
      limit: -1,
      sort: 'index',
      filter: {
        status: {
          _eq: 'published',
        },
      },
    });

    if (result.data.tabMenu && Array.isArray(result.data.tabMenu)) {
      return {
        tabMenuListNetMap: {
          [network]: result.data.tabMenu,
        },
      };
    } else {
      throw new Error('getTabMenuAsync error');
    }
  },
);

export const getDiscoverGroupAsync = createAsyncThunk<Required<Pick<CMSState, 'discoverGroupListNetMap'>>, NetworkType>(
  'cms/getDiscoverGroupAsync',
  async (network: NetworkType) => {
    const result = await getDiscoverGroup(network, {
      limit: -1,
      limit1: -1,
      sort: 'index',
      sort1: 'index',
      filter: {
        status: {
          _eq: 'published',
        },
      },
      filter1: {
        status: {
          _eq: 'published',
        },
      },
    });

    if (result.data.discoverGroup && Array.isArray(result.data.discoverGroup)) {
      return {
        discoverGroupListNetMap: {
          [network]: result.data.discoverGroup,
        },
      };
    } else {
      throw new Error('discoverGroupListNetMap error');
    }
  },
);
