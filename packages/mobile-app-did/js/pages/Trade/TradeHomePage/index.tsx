import React, { useCallback, useMemo } from 'react';
import SafeAreaBox from 'components/SafeAreaBox';
import { BGStyles } from 'assets/theme/styles';
import { ProviderWebPageComponent } from 'pages/ProviderWebPage';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import CommonTopTab from 'components/CommonTopTab';
import { DepositModalMap } from 'hooks/deposit';
import navigationService from 'utils/navigationService';
import { TabRouteNameEnum } from 'types/navigate';
import { useAppBridgeButtonShow } from 'hooks/cms';

export const TradeHomePage: React.FC = () => {
  const { awakenUrl = 'https://awaken.finance/', eBridgeUrl = 'https://ebridge.exchange' } = useCurrentNetworkInfo();
  const { isBridgeShow } = useAppBridgeButtonShow();

  const navBackToHome = useCallback(() => {
    navigationService.navigate('Tab');
    navigationService.navToBottomTab(TabRouteNameEnum.WALLET);
  }, []);

  const tabList = useMemo(() => {
    const list = [];

    const swapTabItem = {
      name: 'Swap',
      tabItemDom: (
        <ProviderWebPageComponent
          needInnerDisclaimerCheck
          title={'AwakenSwap'}
          url={awakenUrl}
          icon={'awaken-swap'}
          disclaimerInfo={DepositModalMap.AwakenSwap}
          disclaimerCheckFailCallBack={navBackToHome}
        />
      ),
    };

    const bridgeTabItem = {
      name: 'Bridge',
      tabItemDom: (
        <ProviderWebPageComponent
          needInnerDisclaimerCheck
          title={'eBridge'}
          url={eBridgeUrl}
          icon={'eBridgeFavIcon'}
          disclaimerInfo={DepositModalMap.bridge}
          disclaimerCheckFailCallBack={navBackToHome}
        />
      ),
    };
    list.push(swapTabItem);
    if (isBridgeShow) list.push(bridgeTabItem);

    return list;
  }, [awakenUrl, eBridgeUrl, isBridgeShow, navBackToHome]);

  return (
    <SafeAreaBox edges={['top', 'right', 'left']} style={[BGStyles.white]}>
      <CommonTopTab hasTabBarBorderRadius={false} tabList={tabList} />
    </SafeAreaBox>
  );
};

export default TradeHomePage;
