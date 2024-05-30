import { useMemo } from 'react';
import { useAppCASelector } from '../.';
import {
  TBaseCardItemType,
  TDiscoverTabList,
  TDiscoverLearnGroupList,
  TDiscoverEarnList,
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

const mockLearnData: TDiscoverLearnGroupList = [
  {
    index: 1,
    title: 'learn1',
    value: 'learn1',
    items: mockCardDataList,
  },
  {
    index: 2,
    title: 'learn2',
    value: 'learn2',
    items: mockCardDataList,
  },
];

const mockTabItemData: TDiscoverTabList = [
  {
    index: 1,
    title: 'dapp',
    value: 'dapp',
  },
  {
    index: 2,
    title: 'earn',
    value: 'earn',
  },
];

export const useDiscoverData = () => {
  const discoverHeaderTabList = useMemo<TDiscoverTabList>(() => {
    return mockTabItemData;
  }, []);

  const earnList = useMemo<TDiscoverEarnList>(() => {
    return mockCardDataList;
  }, []);

  const learnGroupList = useMemo<TDiscoverLearnGroupList>(() => {
    return mockLearnData;
  }, []);

  return { discoverHeaderTabList, learnGroupList, earnList };
};
