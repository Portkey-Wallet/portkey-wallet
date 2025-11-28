import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import CommonTopTab from 'components/CommonTopTab';
import { StyleSheet } from 'react-native';
import MarketSection from '../MarketSection';
import { DiscoverCmsListSection } from '../DiscoverCmsListSection';
import EarnPage from '../SubPages/Earn';
import MarketType from '../MarketSection/components/MarketType';
import { useMarket } from 'hooks/discover';
import { pTd } from 'utils/unit';
import { useDiscoverTabList } from '@portkey-wallet/hooks/hooks-eoa/cms';

enum TabName {
  Dapp = 'dApps',
  Market = 'Market',
  Earn = 'Earn',
}

export default forwardRef(function DiscoverTab(_, _ref) {
  const [currentRouteName, setCurrentRouteName] = useState<TabName>(TabName.Dapp);
  const { marketInfo, handleType } = useMarket();
  const marketRef = useRef<any>([]);
  const discoverTabList = useDiscoverTabList();

  const defaultList = useMemo(() => {
    const DEFAULT_LIST = [
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
    ];
    let outputList = [...DEFAULT_LIST];
    if (discoverTabList && discoverTabList.length !== 0) {
      outputList = outputList.filter(item => {
        return discoverTabList.find(tab => tab.value === item.value);
      });
    }
    return outputList.length ? outputList : DEFAULT_LIST;
  }, [discoverTabList]);

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
      labelTextStyle={styles.labelTextStyle}
      suffixIconDom={<MarketType marketInfo={marketInfo} handleType={handleType} />}
    />
  );
});

const styles = StyleSheet.create({
  labelTextStyle: {
    fontSize: pTd(18),
    lineHeight: pTd(22.5),
  },
});
