import React, { useEffect } from 'react';
import PageContainer from 'components/PageContainer';
import { StyleSheet, View, Image } from 'react-native';
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
import { getHost } from '@portkey-wallet/utils/dapp/browser';

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
          <Image
            style={itemStyles.itemImage}
            source={{
              uri: 'data:image/jpeg;base64,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',
            }}
          />
          <View style={itemStyles.itemCenter}>
            <TextL numberOfLines={1} ellipsizeMode="tail" style={[FontStyles.font5, itemStyles.itemDappTitle]}>
              {item?.name ?? getHost(item.origin)}
            </TextL>
            <TextM numberOfLines={1} ellipsizeMode="tail" style={[FontStyles.font7, itemStyles.itemDappUrl]}>
              {item?.origin ?? getHost(item.origin)}
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
    width: pTd(32),
    height: pTd(32),
    marginRight: pTd(16),
    borderRadius: pTd(16),
  },
  itemCenter: {
    flex: 1,
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
