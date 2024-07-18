import { createAsyncThunk, createAction } from '@reduxjs/toolkit';
import { CMSState } from './types';
import { NetworkType } from '@portkey-wallet/types';
import {
  getDiscoverGroup,
  getSocialMedia,
  getTabMenu,
  getRememberMeBlackListSites,
  getLoginMode,
  getHomeBanner,
  getDiscoverDappBanner,
  getTokenDetailBanner,
  getDiscoverLearnBanner,
  getDiscoverTabList,
  getDiscoverEarnList,
  getDiscoverLearnGroupList,
} from '@portkey-wallet/graphql/cms/queries';
import {
  ActivityModalConfig,
  IEntrance,
  ILoginModeItem,
  TBaseCardItemType,
  TDiscoverEarnList,
  TDiscoverLearnGroupList,
  TDiscoverTabList,
  TTokenDetailBannerItemType,
  TimingType,
} from '@portkey-wallet/types/types-ca/cms';

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

export const getLoginControlListAsync = createAsyncThunk<Required<Pick<CMSState, 'loginModeListMap'>>, NetworkType[]>(
  'cms/getLoginModeList',
  async (networkList: NetworkType[]) => {
    try {
      const res = await Promise.all(
        networkList.map(async network => {
          try {
            return await getLoginMode(network, {
              filter6: {
                status: {
                  _eq: 'published',
                },
              },
            });
          } catch (error) {
            console.log(error, '=====error');
            return null;
          }
        }),
      );
      const loginModeListMap: { [T in NetworkType]?: ILoginModeItem[] } = {};
      res?.map((item, index) => {
        if (item?.data) {
          loginModeListMap[networkList[index]] = item.data.loginMode as ILoginModeItem[];
        }
      });
      return { loginModeListMap };
    } catch (error) {
      throw new Error('getLoginControlListAsync error');
    }
  },
);

export const getHomeBannerListAsync = createAsyncThunk<Required<Pick<CMSState, 'homeBannerListMap'>>, NetworkType>(
  'cms/getHomeBannerListAsync',
  async (network: NetworkType) => {
    let returnList: TBaseCardItemType[] = [];
    try {
      const result = await getHomeBanner(network, {});
      if (result.data.homeBanner?.status === 'published') {
        returnList = result?.data?.homeBanner?.items
          ?.filter(ele => ele?.portkeyCard_id?.status === 'published')
          ?.map(ele => ({
            imgUrl: ele?.portkeyCard_id?.imgUrl,
            index: ele?.portkeyCard_id?.index,
            url: ele?.portkeyCard_id?.url,
            appLink: ele?.portkeyCard_id?.appLink,
            extensionLink: ele?.portkeyCard_id?.extensionLink,
          }))
          ?.sort((a, b) => Number(a.index) - Number(b.index)) as TBaseCardItemType[];
      }

      console.log('getHomeBannerListAsync', returnList);

      return {
        homeBannerListMap: {
          [network]: returnList,
        },
      };
    } catch (error) {
      throw new Error('getHomeBannerListAsync error');
    }
  },
);

export const getDiscoverDappBannerAsync = createAsyncThunk<
  Required<Pick<CMSState, 'discoverDappBannerListMap'>>,
  NetworkType
>('cms/getDiscoverDappBannerAsync', async (network: NetworkType) => {
  let returnList: TBaseCardItemType[] = [];
  try {
    const result = await getDiscoverDappBanner(network, {});
    if (result.data?.discoverDappBanner?.status === 'published') {
      returnList = result?.data?.discoverDappBanner?.items
        ?.filter(ele => ele?.portkeyCard_id?.status === 'published')
        ?.map(ele => ({
          index: ele?.portkeyCard_id?.index,
          url: ele?.portkeyCard_id?.url,
          appLink: ele?.portkeyCard_id?.appLink,
          extensionLink: ele?.portkeyCard_id?.extensionLink,
          imgUrl: {
            filename_disk: ele?.portkeyCard_id?.imgUrl?.filename_disk,
          },
        }))
        ?.sort((a, b) => Number(a.index) - Number(b.index)) as TBaseCardItemType[];
    }

    console.log('getDiscoverDappBannerAsync', returnList);

    return {
      discoverDappBannerListMap: {
        [network]: returnList,
      },
    };
  } catch (error) {
    throw new Error('getDiscoverDappBannerAsync error');
  }
});

export const getDiscoverLearnBannerAsync = createAsyncThunk<
  Required<Pick<CMSState, 'discoverLearnBannerListMap'>>,
  NetworkType
>('cms/getDiscoverLearnBannerAsync', async (network: NetworkType) => {
  let returnList: TBaseCardItemType[] = [];
  try {
    const result = await getDiscoverLearnBanner(network, {});
    if (result.data?.discoverLearnBanner?.status === 'published') {
      returnList = result?.data?.discoverLearnBanner?.items
        ?.filter(ele => ele?.portkeyCard_id?.status === 'published')
        ?.map(ele => ({
          index: ele?.portkeyCard_id?.index,
          url: ele?.portkeyCard_id?.url,
          appLink: ele?.portkeyCard_id?.appLink,
          extensionLink: ele?.portkeyCard_id?.extensionLink,
          imgUrl: {
            filename_disk: ele?.portkeyCard_id?.imgUrl?.filename_disk,
          },
        }))
        ?.sort((a, b) => Number(a.index) - Number(b.index)) as TBaseCardItemType[];
    }

    console.log('getDiscoverLearnBannerAsync', returnList);

    return {
      discoverLearnBannerListMap: {
        [network]: returnList,
      },
    };
  } catch (error) {
    throw new Error('getDiscoverLearnBannerAsync error');
  }
});

export const getTokenDetailBannerAsync = createAsyncThunk<
  Required<Pick<CMSState, 'tokenDetailBannerListMap'>>,
  NetworkType
>('cms/getTokenDetailBannerAsync', async (network: NetworkType) => {
  let returnList: TTokenDetailBannerItemType[] = [];

  try {
    const result = await getTokenDetailBanner(network, {});

    returnList = result.data?.tokenDetailBanner
      .filter(ele => ele.status === 'published')
      .map(i => ({
        chainId: i.chainId,
        symbol: i.symbol,
        items: i.items
          ?.filter(ele => ele?.portkeyCard_id?.status === 'published')
          ?.map(ele => ({
            index: ele?.portkeyCard_id?.index,
            url: ele?.portkeyCard_id?.url,
            appLink: ele?.portkeyCard_id?.appLink,
            extensionLink: ele?.portkeyCard_id?.extensionLink,
            imgUrl: {
              filename_disk: ele?.portkeyCard_id?.imgUrl?.filename_disk,
            },
          }))
          ?.sort((a, b) => Number(a.index) - Number(b.index)),
      })) as TTokenDetailBannerItemType[];

    console.log('getTokenDetailBannerAsync', returnList);

    return {
      tokenDetailBannerListMap: {
        [network]: returnList,
      },
    };
  } catch (error) {
    throw new Error('getTokenDetailBannerAsync error');
  }
});

export const getDiscoverTabAsync = createAsyncThunk<Required<Pick<CMSState, 'discoverTabListMap'>>, NetworkType>(
  'cms/getDiscoverTabAsync',
  async (network: NetworkType) => {
    let returnList: TDiscoverTabList = [];
    try {
      const result = await getDiscoverTabList(network, {});

      returnList = (result.data?.discoverTabData
        .filter(ele => ele.status === 'published')
        .map(i => ({
          index: i.index || 0,
          value: i.value || '',
          name: i.name || '',
        }))
        ?.sort((a, b) => Number(a.index) - Number(b.index)) || []) as TDiscoverTabList;

      console.log('getDiscoverTabAsync', returnList);

      return {
        discoverTabListMap: {
          [network]: returnList,
        },
      };
    } catch (error) {
      throw new Error('getTokenDetailBannerAsync error');
    }
  },
);

export const getDiscoverEarnAsync = createAsyncThunk<Required<Pick<CMSState, 'discoverEarnListMap'>>, NetworkType>(
  'cms/getDiscoverEarnAsync',
  async (network: NetworkType) => {
    let returnList: TDiscoverEarnList = [];
    try {
      const result = await getDiscoverEarnList(network, {});

      if (result.data?.discoverEarnData?.status === 'published') {
        returnList = result?.data?.discoverEarnData?.items
          ?.filter(ele => ele?.portkeyCard_id?.status === 'published')
          ?.map(ele => ({
            ...ele?.portkeyCard_id,
            imgUrl: {
              filename_disk: ele?.portkeyCard_id?.imgUrl?.filename_disk,
            },
          }))
          ?.sort((a, b) => Number(a.index) - Number(b.index)) as TBaseCardItemType[];
      }

      console.log('getDiscoverEarnAsync list ', returnList);

      return {
        discoverEarnListMap: {
          [network]: returnList,
        },
      };
    } catch (error) {
      throw new Error('getDiscoverEarnAsync error');
    }
  },
);

export const getDiscoverLearnAsync = createAsyncThunk<
  Required<Pick<CMSState, 'discoverLearnGroupListMap'>>,
  NetworkType
>('cms/getDiscoverLearnAsync', async (network: NetworkType) => {
  let returnList: TDiscoverLearnGroupList = [];

  try {
    const result = await getDiscoverLearnGroupList(network, {});
    returnList = (result?.data?.discoverLearnGroup
      .filter(ele => ele.status === 'published')
      .map(group => ({
        index: group.index,
        title: group.title,
        value: group.value,
        items: group?.items
          ?.filter(i => i?.portkeyCard_id?.status === 'published')
          ?.map(ele => ({ ...ele?.portkeyCard_id }))
          .sort((a, b) => Number(a.index) - Number(b.index)),
      }))
      .sort((a, b) => Number(a.index) - Number(b.index)) || []) as TDiscoverLearnGroupList;

    console.log('getDiscoverLearnAsync list ', returnList);

    return {
      discoverLearnGroupListMap: {
        [network]: returnList,
      },
    };
  } catch (error) {
    throw new Error('getDiscoverLearnAsync error');
  }
});

export const getActivityModalAsync = createAsyncThunk<Required<Pick<CMSState, 'activityModalListMap'>>, NetworkType>(
  'cms/activityModalListMap',
  async (network: NetworkType) => {
    let returnList: ActivityModalConfig[] = [];
    console.log('rightTimingConfig start getActivityModalAsync');
    try {
      // todo wfs request api for ActivityModalConfig
      returnList = await new Promise<ActivityModalConfig[]>(resolve => {
        // 模拟异步 API 请求
        setTimeout(() => {
          // 假设这是从 API 请求返回的数据
          const fetchedData: ActivityModalConfig[] = [
            {
              id: 1,
              showClose: true,
              headerImg: '',
              title: '标题1',
              description:
                '描述1描述1描述1描述1描述1描述1描述1描述1描述1描述1描述1描述1描述1描述1描述1描述1描述1描述1描述1描述1',
              negtiveTitle: '取消1',
              positiveTitle: '确认1',
              positiveAction: '',
              timingOperation: 'Tab',
              timingType: TimingType.Page,
            },
            {
              id: 2,
              showClose: false,
              headerImg: 'https://cdn.pixabay.com/photo/2016/12/23/12/40/night-1927265_1280.jpg',
              title: '标题2 change03',
              description:
                '描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2',
              negtiveTitle: '取消2',
              positiveTitle: '确认2',
              positiveAction: '',
              timingOperation: 'Tab',
              timingType: TimingType.Page,
            },
            {
              id: 3,
              showClose: false,
              headerImg: 'https://cdn.pixabay.com/photo/2016/12/23/12/40/night-1927265_1280.jpg',
              title: '标题3',
              description:
                '描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2',
              negtiveTitle: '取消3',
              positiveTitle: '确认3',
              positiveAction: '',
              timingOperation: 'Discover',
              timingType: TimingType.Tab,
            },
            {
              id: 4,
              showClose: true,
              headerImg: 'https://cdn.pixabay.com/photo/2016/12/23/12/40/night-1927265_1280.jpg',
              title: '标题4',
              description:
                '描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2',
              negtiveTitle: '取消4',
              positiveTitle: '确认4',
              positiveAction: '',
              timingOperation: '/',
              timingType: TimingType.Page,
            },
            {
              id: 5,
              showClose: false,
              headerImg: 'https://cdn.pixabay.com/photo/2016/12/23/12/40/night-1927265_1280.jpg',
              title: '标题5 change10',
              description:
                '描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2',
              negtiveTitle: '取消5',
              positiveTitle: '确认5',
              positiveAction: '',
              timingOperation: '/',
              timingType: TimingType.Page,
            },
            {
              id: 6,
              showClose: false,
              headerImg: 'https://cdn.pixabay.com/photo/2016/12/23/12/40/night-1927265_1280.jpg',
              title: '标题6',
              description:
                '描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2',
              negtiveTitle: '取消6',
              positiveTitle: '确认6',
              positiveAction: '',
              timingOperation: '/',
              timingType: TimingType.AppOpen,
            },
            {
              id: 7,
              showClose: false,
              headerImg: 'https://cdn.pixabay.com/photo/2016/12/23/12/40/night-1927265_1280.jpg',
              title: '标题7',
              description:
                '描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2',
              negtiveTitle: '取消7',
              positiveTitle: '确认7',
              positiveAction: '',
              timingOperation: '/buy',
              timingType: TimingType.Page,
            },
            {
              id: 8,
              showClose: true,
              headerImg: 'https://cdn.pixabay.com/photo/2016/12/23/12/40/night-1927265_1280.jpg',
              title: '标题8',
              description:
                '描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2描述2',
              negtiveTitle: '取消8',
              positiveTitle: '确认8',
              positiveAction: '',
              timingOperation: '/chat-list',
              timingType: TimingType.Page,
            },
          ];
          resolve(fetchedData);
        }, 2000);
      });
      console.log('rightTimingConfig getActivityModalAsync list ', returnList);
      return {
        activityModalListMap: {
          [network]: returnList,
        },
      };
    } catch (error) {
      throw new Error('getActivityModalAsync error');
    }
  },
);

export const setEntrance = createAction<{
  network: NetworkType;
  value: IEntrance;
}>('cms/setEntrance');

export const setActivityModalShowed = createAction<{
  network: NetworkType;
  id: number;
}>('cms/setActivityModalShowed');
export const setActivityModalCurrentTimeShowed = createAction<{
  network: NetworkType;
  id: number;
}>('cms/setActivityModalCurrentTimeShowed');

export const resetCms = createAction<NetworkType>('cms/resetCms');
