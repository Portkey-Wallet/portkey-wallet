import React, { useCallback, useMemo } from 'react';
import SafeAreaBox from 'components/SafeAreaBox';
import { BGStyles } from 'assets/theme/styles';
import { ProviderWebPageComponent } from 'pages/ProviderWebPage';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import CommonTopTab from 'components/CommonTopTab';
import { DepositModalMap } from 'hooks/deposit';
import navigationService from 'utils/navigationService';
import { TabRouteNameEnum } from 'types/navigate';
import { useAppBridgeButtonShow, useAppNFTTabShow } from 'hooks/cms';
import { useFocusEffect } from '@react-navigation/native';

export const TradeHomePage: React.FC = (props: any) => {
  const { navigation, route } = props;
  console.log('propssssssss', props);
  const {
    awakenUrl = 'https://app.awaken.finance/',
    eBridgeUrl = 'https://ebridge.exchange',
    eForestUrl = 'https://www.eforest.finance',
  } = useCurrentNetworkInfo();
  const { isBridgeShow } = useAppBridgeButtonShow();
  const { isNFTTabShow } = useAppNFTTabShow();
  const navBackToHome = useCallback(() => {
    navigationService.navigate('Tab');
    navigationService.navToBottomTab(TabRouteNameEnum.WALLET);
  }, []);

  useFocusEffect(
    useCallback(() => {
      navigation && route.params.initTab && navigation.jumpTo(route.params.initTab);
    }, [navigation, route.params.initTab]),
  );
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
    const NFTTabItem = {
      name: 'NFT',
      tabItemDom: (
        <ProviderWebPageComponent
          needInnerDisclaimerCheck
          title={DepositModalMap.eForest.title}
          url={eForestUrl + '/collections'}
          icon={DepositModalMap.eForest.icon}
          disclaimerInfo={DepositModalMap.eForest}
          disclaimerCheckFailCallBack={navBackToHome}
        />
      ),
    };
    list.push(swapTabItem);
    if (isBridgeShow) list.push(bridgeTabItem);
    if (isNFTTabShow) list.push(NFTTabItem);
    return list;
  }, [awakenUrl, eBridgeUrl, eForestUrl, isBridgeShow, isNFTTabShow, navBackToHome]);

  return (
    <SafeAreaBox edges={['top', 'right', 'left']} style={[BGStyles.white]}>
      <CommonTopTab hasTabBarBorderRadius={false} tabList={tabList} initialRouteName={props.route.params.initTab} />
    </SafeAreaBox>
  );
};

export default TradeHomePage;
