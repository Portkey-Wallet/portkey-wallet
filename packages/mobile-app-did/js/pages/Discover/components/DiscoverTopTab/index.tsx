import React, { useMemo } from 'react';
import CommonTopTab from 'components/CommonTopTab';

import { useLanguage } from 'i18n/hooks';
import MarketSection from '../MarketSection';
import { DiscoverCmsListSection } from '../DiscoverCmsListSection';
import { EarnPage } from '../SubPages/Earn';
import { LearnPage } from '../SubPages/Learn/MainPage';
import { useDiscoverData } from '@portkey-wallet/hooks/hooks-ca/cms/discover';
import { Platform } from 'react-native';

const defaultList = [
  {
    name: 'Dapp',
    value: 'Dapp',
    tabItemDom: <DiscoverCmsListSection />,
  },
  {
    name: 'Market',
    value: 'Market',

    tabItemDom: <MarketSection />,
  },
  {
    name: 'Earn',
    value: 'Earn',
    tabItemDom: <EarnPage />,
  },
  {
    name: 'Learn',
    value: 'Learn',
    tabItemDom: <LearnPage />,
  },
];

const DiscoverTab: React.FC = () => {
  const { discoverHeaderTabList } = useDiscoverData();

  const tabList = useMemo(
    () =>
      discoverHeaderTabList.map(item => ({
        name: item.name || item.value || '',
        tabItemDom: defaultList.find(tab => tab.value === item.value)?.tabItemDom || <></>,
      })),
    [discoverHeaderTabList],
  );

  return (
    <CommonTopTab
      swipeEnabled={Platform.OS === 'android' ? false : true}
      hasTabBarBorderRadius={false}
      tabList={tabList}
    />
  );
};
export default DiscoverTab;
