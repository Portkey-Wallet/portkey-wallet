import React, { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import CommonTopTab from 'components/CommonTopTab';

import MarketSection from '../MarketSection';
import { DiscoverCmsListSection } from '../DiscoverCmsListSection';
import { EarnPage } from '../SubPages/Earn';
import MarketType from '../MarketSection/components/MarketType';
import { useMarket } from 'hooks/discover';

export default forwardRef(function DiscoverTab(_, _ref) {
  const [currentRouteName, setCurrentRouteName] = useState<string>();
  const { marketInfo, handleType } = useMarket();
  const marketRef = useRef<any>(null);

  const defaultList = useMemo(
    () => [
      {
        name: 'dApps',
        value: 'Dapp',
        tabItemDom: <DiscoverCmsListSection />,
      },
      {
        name: 'Market',
        value: 'Market',
        tabItemDom: <MarketSection ref={(ref: any) => (marketRef.current = ref)} />,
      },
      {
        name: 'Earn',
        value: 'Earn',
        tabItemDom: <EarnPage />,
      },
    ],
    [],
  );

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
    marketRef.current?.closeTips?.();
  };

  useImperativeHandle(_ref, () => ({
    hideAll: () => marketRef.current?.closeTips?.(),
  }));

  return (
    <CommonTopTab
      swipeEnabled={false}
      hasTabBarBorderRadius={false}
      tabList={tabList}
      isBlockTab={true}
      hasBottomBorder={false}
      onTabChange={handleTabChange}
      suffixIconDomVisible={currentRouteName === 'Market'}
      suffixIconDom={<MarketType marketInfo={marketInfo} handleType={handleType} />}
    />
  );
});
