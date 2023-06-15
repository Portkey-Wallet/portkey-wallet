import React, { useEffect } from 'react';
import PageContainer from 'components/PageContainer';
import { StyleSheet, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { TextL, TextM, TextS } from 'components/CommonText';
import { useDeviceList } from '@portkey-wallet/hooks/hooks-ca/wallet';
// import DeviceItem from './components/DeviceItem';
import { FontStyles } from 'assets/theme/styles';
import { pTd } from 'utils/unit';
import myEvents from 'utils/deviceEvent';

import { useCurrentDappList } from '@portkey-wallet/hooks/hooks-ca/dapp';
import { useAppDispatch } from 'store/hooks';
import { removeDapp } from '@portkey-wallet/store/store-ca/dapp/actions';
import Touchable from 'components/Touchable';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import fonts from 'assets/theme/fonts';
import NoData from 'components/NoData';
import { getFaviconUrl, getHost } from '@portkey-wallet/utils/dapp/browser';
import DiscoverWebsiteImage from 'pages/Discover/components/DiscoverWebsiteImage';

const DeviceList: React.FC = () => {
  const { refetch } = useDeviceList();
  const currentNetwork = useCurrentNetworkInfo();

  const dispatch = useAppDispatch();
  const dappList = useCurrentDappList();

  useEffect(() => {
    const listener = myEvents.refreshDeviceList.addListener(() => {
      refetch();
    });
    return () => {
      listener.remove();
    };
  }, [refetch]);

  return (
    <PageContainer
      titleDom={'Connected Sites'}
      safeAreaColor={['blue', 'gray']}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: false }}>
      {dappList?.map(item => (
        <View key={item.name} style={itemStyles.itemWrap}>
          <DiscoverWebsiteImage size={pTd(32)} imageUrl={getFaviconUrl(item.origin)} style={itemStyles.itemImage} />
          <View style={itemStyles.itemCenter}>
            <TextL numberOfLines={1} ellipsizeMode="tail" style={[FontStyles.font5, itemStyles.itemDappTitle]}>
              {item?.name || getHost(item.origin)}
            </TextL>
            <TextM numberOfLines={1} ellipsizeMode="tail" style={[FontStyles.font7, itemStyles.itemDappUrl]}>
              {item?.origin || getHost(item.origin)}
            </TextM>
          </View>
          <Touchable
            onPress={() => dispatch(removeDapp({ networkType: currentNetwork.networkType, origin: item.origin }))}>
            <TextS style={[itemStyles.itemRight, fonts.mediumFont]}>Disconnect</TextS>
          </Touchable>
        </View>
      ))}
      {(dappList ?? []).length === 0 && <NoData style={pageStyles.noData} message="No Connected Sites" />}
    </PageContainer>
  );
};

const pageStyles = StyleSheet.create({
  pageWrap: {
    backgroundColor: defaultColors.bg4,
    ...GStyles.paddingArg(24, 20, 18),
  },
  tipsWrap: {
    lineHeight: pTd(20),
    marginBottom: pTd(24),
  },
  noData: {
    backgroundColor: defaultColors.bg4,
  },
});

const itemStyles = StyleSheet.create({
  itemWrap: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    ...GStyles.paddingArg(13, 16),
    backgroundColor: defaultColors.bg1,
    marginBottom: pTd(24),
    borderRadius: pTd(6),
  },
  itemImage: {
    marginRight: pTd(16),
    borderRadius: pTd(16),
  },
  itemCenter: {
    flex: 1,
    paddingRight: pTd(16),
  },
  itemDappTitle: {
    marginBottom: pTd(1),
  },
  itemDappUrl: {
    marginTop: pTd(1),
  },
  itemRight: {
    width: pTd(85),
    height: pTd(24),
    borderWidth: pTd(1),
    borderColor: defaultColors.font12,
    color: defaultColors.font12,
    textAlign: 'center',
    lineHeight: pTd(22),
    borderRadius: pTd(6),
  },
});

export default DeviceList;
