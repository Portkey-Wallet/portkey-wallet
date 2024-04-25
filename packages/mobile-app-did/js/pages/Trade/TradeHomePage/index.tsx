import React, { useMemo } from 'react';
import SafeAreaBox from 'components/SafeAreaBox';
import { BGStyles } from 'assets/theme/styles';
import { ProviderWebPageComponent } from 'pages/ProviderWebPage';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import CommonTopTab from 'components/CommonTopTab';

export const TradeHomePage: React.FC = () => {
  const { awakenUrl = 'https://awaken.finance/', eBridgeUrl = 'https://ebridge.exchange' } = useCurrentNetworkInfo();

  const tabList = useMemo(() => {
    return [
      {
        name: 'Swap',
        tabItemDom: <ProviderWebPageComponent title={'Swap'} url={awakenUrl} />,
      },
      {
        name: 'Bridge',
        tabItemDom: <ProviderWebPageComponent title={'Bridge'} url={eBridgeUrl} />,
      },
    ];
  }, [awakenUrl, eBridgeUrl]);

  return (
    <SafeAreaBox edges={['top', 'right', 'left']} style={[BGStyles.white]}>
      <CommonTopTab hasTabBarBorderRadius={false} tabList={tabList} />
    </SafeAreaBox>
  );
};

export default TradeHomePage;
