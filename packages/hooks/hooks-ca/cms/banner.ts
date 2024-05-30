import { useCallback, useMemo } from 'react';
import { useAppCASelector } from '../.';
import {
  TBaseCardItemType,
  THomeBannerList,
  TTokenDetailBannerList,
  TDiscoverDappBannerList,
  TDiscoverLearnBannerList,
} from '@portkey-wallet/types/types-ca/cms';
import { ChainId } from '@portkey-wallet/types';

export const useCMS = () => useAppCASelector(state => state.cms);

const mockCardDataList: TBaseCardItemType[] = [
  {
    index: 1,
    url: 'https://portkey.finance',
    title: 'title',
    description: 'description',
    buttonTitle: 'buttonTitle',
    imgUrl: {
      filename_disk: '843753ae-0961-44fe-9b2b-415922833611',
    },
  },
  {
    index: 2,
    url: 'https://portkey.finance',
    title: 'title2',
    description: 'description2',
    buttonTitle: 'buttonTitle2',
    imgUrl: {
      filename_disk: '843753ae-0961-44fe-9b2b-415922833611',
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

  const getTokenDetailBannerList = useCallback((chainId: ChainId, symbol: string): TTokenDetailBannerList => {
    console.log('===', chainId, symbol);
    return mockCardDataList;
  }, []);

  return { homeBannerList, dappBannerList, learnBannerList, getTokenDetailBannerList };
};
