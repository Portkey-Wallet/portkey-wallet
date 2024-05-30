import React, { useMemo } from 'react';
import CommonTopTab from 'components/CommonTopTab';

import { useLanguage } from 'i18n/hooks';
import MarketSection from '../MarketSection';
import { DiscoverCmsListSection } from '../DiscoverCmsListSection';
import { EarnPage } from '../SubPages/Earn';
import { LearnPage } from '../SubPages/Learn/MainPage';

const DiscoverTab: React.FC = () => {
  const { t } = useLanguage();

  const tabList = useMemo(() => {
    return [
      { name: t('dAPP'), tabItemDom: <DiscoverCmsListSection /> },
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

  return <CommonTopTab hasTabBarBorderRadius={false} tabList={tabList} />;
};
export default DiscoverTab;
