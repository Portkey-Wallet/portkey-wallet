import React, { useMemo, useState } from 'react';
import CommonTopTab from 'components/CommonTopTab';

import MarketSection from '../MarketSection';
import { DiscoverCmsListSection } from '../DiscoverCmsListSection';
import { EarnPage } from '../SubPages/Earn';
import MarketType from '../MarketSection/components/MarketType';
import { useMarket } from 'hooks/discover';

const defaultList = [
  {
    name: 'dApps',
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
];

const DiscoverTab: React.FC = () => {
  const [currentRouteName, setCurrentRouteName] = useState<string>();
  const { marketInfo, handleType } = useMarket();

  const tabList = useMemo(
    () =>
      defaultList.map(item => ({
        name: item.name || item.value || '',
        tabItemDom: defaultList.find(tab => tab.value === item.value)?.tabItemDom || <></>,
      })),
    [],
  );

  const handleTabChange = (routeName: string) => {
    setCurrentRouteName(routeName);
  };

  return (
    <CommonTopTab
      swipeEnabled={false}
      hasTabBarBorderRadius={false}
      tabList={tabList}
      isBlockTab={true}
      hasBottomBorder={false}
      onTabChange={handleTabChange}
      suffixIconDom={currentRouteName === 'Market' && <MarketType marketInfo={marketInfo} handleType={handleType} />}
    />
  );
};
export default DiscoverTab;
