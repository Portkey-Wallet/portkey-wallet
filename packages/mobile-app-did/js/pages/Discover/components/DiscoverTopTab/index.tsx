import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import CommonTopTab from 'components/CommonTopTab';

import MarketSection from '../MarketSection';
import { DiscoverCmsListSection } from '../DiscoverCmsListSection';
import EarnPage from '../SubPages/Earn';
import MarketType from '../MarketSection/components/MarketType';
import { useMarket } from 'hooks/discover';

enum TabName {
  Dapp = 'dApps',
  Market = 'Market',
  Earn = 'Earn',
}

export default forwardRef(function DiscoverTab(_, _ref) {
  const [currentRouteName, setCurrentRouteName] = useState<TabName>(TabName.Dapp);
  const { marketInfo, handleType } = useMarket();
  const marketRef = useRef<any>([]);

  const defaultList = useMemo(
    () => [
      {
        name: 'dApps',
        value: 'dApps',
        tabItemDom: <DiscoverCmsListSection />,
      },
      {
        name: 'Market',
        value: 'Market',
        tabItemDom: <MarketSection ref={(ref: any) => (marketRef.current[TabName.Market] = ref)} />,
      },
      {
        name: 'Earn',
        value: 'Earn',
        tabItemDom: <EarnPage ref={(ref: any) => (marketRef.current[TabName.Earn] = ref)} />,
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
    [defaultList],
  );

  const handleTabChange = (routeName: TabName) => {
    setCurrentRouteName(routeName);
    marketRef.current?.[TabName.Market]?.closeTips?.();
  };

  const onRefresh = useCallback(
    (callback?: () => void) => {
      if (marketRef.current?.[currentRouteName]?.onRefresh) {
        marketRef.current?.[currentRouteName]?.onRefresh?.(callback);
      } else {
        callback?.();
      }
    },
    [currentRouteName],
  );

  useImperativeHandle(
    _ref,
    () => ({
      hideAll: () => marketRef.current?.[TabName.Market]?.closeTips?.(),
      onRefresh,
    }),
    [onRefresh],
  );

  return (
    <CommonTopTab
      swipeEnabled={false}
      hasTabBarBorderRadius={false}
      tabList={tabList}
      isBlockTab={true}
      hasBottomBorder={false}
      onTabChange={(routeName: string) => handleTabChange(routeName as TabName)}
      suffixIconDomVisible={currentRouteName === 'Market'}
      suffixIconDom={<MarketType marketInfo={marketInfo} handleType={handleType} />}
    />
  );
});
