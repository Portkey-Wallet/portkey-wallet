import { createAsyncThunk } from '@reduxjs/toolkit';
import { CMSState } from './types';
import { NetworkType } from '@portkey-wallet/types';
import { getSocialMedia, getTabMenu } from '@portkey-wallet/graphql/cms/queries';

export const getSocialMediaAsync = createAsyncThunk<Required<Pick<CMSState, 'socialMediaListNetMap'>>, NetworkType>(
  'cms/getSocialMediaAsync',
  async (network: NetworkType) => {
    const result = await getSocialMedia(network, {
      sort: 'index',
      limit: -1,
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
