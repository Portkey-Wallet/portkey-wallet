import React, { useCallback, useMemo } from 'react';
import SafeAreaBox from 'components/SafeAreaBox';
import { BGStyles } from 'assets/theme/styles';
import { ProviderWebPageComponent } from 'pages/ProviderWebPage';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import CommonTopTab from 'components/CommonTopTab';
import { DepositModalMap } from 'hooks/deposit';
import navigationService from 'utils/navigationService';
import { TabRouteNameEnum } from 'types/navigate';

export const TradeHomePage: React.FC = () => {
  const { awakenUrl = 'https://awaken.finance/', eBridgeUrl = 'https://ebridge.exchange' } = useCurrentNetworkInfo();

  const navBackToHome = useCallback(() => {
    navigationService.navigate('Tab');
    navigationService.navToBottomTab(TabRouteNameEnum.WALLET);
  }, []);

  const tabList = useMemo(() => {
    return [
      {
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
      },
      {
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
      },
    ];
  }, [awakenUrl, eBridgeUrl, navBackToHome]);

  return (
    <SafeAreaBox edges={['top', 'right', 'left']} style={[BGStyles.white]}>
      <CommonTopTab hasTabBarBorderRadius={false} tabList={tabList} />
    </SafeAreaBox>
  );
};

export default TradeHomePage;
