import { useCallback, useMemo } from 'react';
import { useAppCASelector } from '../.';
import {
  TBaseCardItemType,
  THomeBannerList,
  TTokenDetailBannerList,
  TDiscoverDappBannerList,
  TDiscoverLearnBannerList,
} from '@portkey-wallet/types/types-ca/cms';

export const useCMS = () => useAppCASelector(state => state.cms);

const mockCardDataList: TBaseCardItemType[] = [
  {
    index: 1,
    url: 'https://portkey.finance',
    title: 'title',
    description: 'description',
    buttonTitle: 'buttonTitle',
    imgUrl: {
      filename_disk: '2b85049c-e6be-4362-bb2f-822b4d252551.png',
    },
  },
  {
    index: 2,
    url: 'https://portkey.finance',
    title: 'title2',
    description: 'description2',
    buttonTitle: 'buttonTitle2',
    imgUrl: {
      filename_disk: '40b2d2ab-3daf-4834-ae27-f902cff34f7a.png',
    },
  },
];

export const useCmsBanner = () => {
  const homeBannerList = useMemo<THomeBannerList>(() => {
    return mockCardDataList;
  }, []);

  const dappBannerList = useMemo<TDiscoverDappBannerList>(() => {
    return mockCardDataList;
  }, []);

  const learnBannerList = useMemo<TDiscoverLearnBannerList>(() => {
    return mockCardDataList;
  }, []);

  const getTokenDetailBannerList = useCallback((chainId, symbol): TTokenDetailBannerList => {
    console.log('===', chainId, symbol);
    return mockCardDataList;
  }, []);

  return { homeBannerList, dappBannerList, learnBannerList, getTokenDetailBannerList };
};
