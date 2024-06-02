import React, { useMemo } from 'react';
import CommonTopTab from 'components/CommonTopTab';

import { useLanguage } from 'i18n/hooks';
import MarketSection from '../MarketSection';
import { DiscoverCmsListSection } from '../DiscoverCmsListSection';
import { EarnPage } from '../SubPages/Earn';
import { LearnPage } from '../SubPages/Learn/MainPage';
import { useDiscoverData } from '@portkey-wallet/hooks/hooks-ca/cms/discover';

const DiscoverTab: React.FC = () => {
  const { t } = useLanguage();
  const { discoverHeaderTabList } = useDiscoverData();

  const tabOriginalList = useMemo(() => {
    return [
      { name: t('Dapp'), tabItemDom: <DiscoverCmsListSection /> },
      {
        name: t('Market'),
        tabItemDom: <MarketSection />,
      },
      {
        name: t('Earn'),
        tabItemDom: <EarnPage />,
      },
      {
        name: t('Learn'),
        tabItemDom: <LearnPage />,
      },
    ];
  }, [t]);

  const tabList = useMemo(() => {
    return (
      discoverHeaderTabList
        // .sort((a, b) => Number(a.index) - Number(b.index))
        .map(item => {
          return {
            name: item.name || 'tab',
            tabItemDom: tabOriginalList.find(tab => tab.name === item.name)?.tabItemDom || <></>,
          };
        })
    );
  }, [discoverHeaderTabList, tabOriginalList]);

  return <CommonTopTab swipeEnabled={false} hasTabBarBorderRadius={false} tabList={tabList} />;
};
export default DiscoverTab;
