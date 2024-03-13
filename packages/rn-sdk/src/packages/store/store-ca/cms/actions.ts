import { createAsyncThunk } from '@reduxjs/toolkit';
import { CMSState } from './types';
import { NetworkType } from 'packages/types';
import {
  getDiscoverGroup,
  getSocialMedia,
  getTabMenu,
  getRememberMeBlackListSites,
} from 'packages/graphql/cms/queries';

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

export const getBuyButtonAsync = createAsyncThunk<Required<Pick<CMSState, 'buyButtonNetMap'>>, NetworkType>(
  'cms/getBuyButtonAsync',
  async () => {
    throw new Error('discoverGroupListNetMap error');
    // const result = await getBuyButton(network, {});

    // if (result.data.buyButton) {
    //   return {
    //     buyButtonNetMap: {
    //       [network]: result.data.buyButton,
    //     },
    //   };
    // } else {
    //   throw new Error('discoverGroupListNetMap error');
    // }
  },
);

export const getRememberMeBlackListAsync = createAsyncThunk<
  Required<Pick<CMSState, 'rememberMeBlackListMap'>>,
  NetworkType
>('cms/getRememberMeBlackListAsync', async (network: NetworkType) => {
  const result = await getRememberMeBlackListSites(network, {
    filter: {
      status: {
        _eq: 'published',
      },
    },
  });

  if (result.data.rememberMeBlackListSites) {
    return {
      rememberMeBlackListMap: {
        [network]: result.data.rememberMeBlackListSites,
      },
    };
  } else {
    throw new Error('rememberMeBlackListMap error');
  }
});
