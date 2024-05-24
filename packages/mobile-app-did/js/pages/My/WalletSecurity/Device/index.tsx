import React, { useCallback, useEffect, useRef } from 'react';
import PageContainer from 'components/PageContainer';
import { StyleSheet, FlatList } from 'react-native';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { TextM } from 'components/CommonText';
import { IDeviceItem, useCurrentWalletInfo, useDeviceList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import DeviceItem from './components/DeviceItem';
import navigationService from 'utils/navigationService';
import { FontStyles } from 'assets/theme/styles';
import { pTd } from 'utils/unit';
import myEvents from 'utils/deviceEvent';
import useEffectOnce from 'hooks/useEffectOnce';
import CommonToast from 'components/CommonToast';

const DeviceList: React.FC = () => {
  const onError = useCallback(() => {
    CommonToast.failError(`Loading failed. Please retry.`);
  }, []);

  const {
    deviceList,
    refresh,
    loading: isRefreshing,
  } = useDeviceList({
    isInit: false,
    onError,
  });
  const walletInfo = useCurrentWalletInfo();

  const isLoadingRef = useRef(false);
  const getDeviceList = useCallback(async () => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    await refresh();
    isLoadingRef.current = false;
  }, [refresh]);

  useEffectOnce(() => {
    const timer = setTimeout(() => {
      getDeviceList();
    }, 100);
    return () => {
      clearTimeout(timer);
    };
  });

  useEffect(() => {
    const listener = myEvents.refreshDeviceList.addListener(() => {
      getDeviceList();
    });
    return () => {
      listener.remove();
    };
  }, [getDeviceList]);

  const renderItem = useCallback(
    ({ item }: { item: IDeviceItem }) => {
      return (
        <DeviceItem
          key={item.managerAddress}
          deviceItem={item}
          isCurrent={walletInfo.address === item.managerAddress}
          onPress={() => {
            navigationService.navigate('DeviceDetail', { deviceItem: item });
          }}
        />
      );
    },
    [walletInfo.address],
  );

  return (
    <PageContainer
      titleDom={'Login Devices'}
      safeAreaColor={['blue', 'gray']}
      containerStyles={pageStyles.pageWrap}
      hideTouchable={true}
      scrollViewProps={{ disabled: true }}>
      <FlatList
        style={pageStyles.listWrap}
        refreshing={isRefreshing}
        data={deviceList || []}
        keyExtractor={(_item: IDeviceItem, index: number) => `${index}`}
        renderItem={renderItem}
        onRefresh={getDeviceList}
        // onEndReached={getDeviceList}
        ListHeaderComponent={
          <TextM style={[FontStyles.font3, pageStyles.tipsWrap]}>
            {`You can manage your login devices and remove any device. 
Please note that when you log in again on a removed device, you will need to verify your identity through your guardians.`}
          </TextM>
        }
      />
    </PageContainer>
  );
};

const pageStyles = StyleSheet.create({
  pageWrap: {
    backgroundColor: defaultColors.bg4,
    paddingHorizontal: 0,
  },
  listWrap: {
    ...GStyles.paddingArg(24, 20, 18),
  },
  tipsWrap: {
    lineHeight: pTd(20),
    marginBottom: pTd(24),
  },
});

export default DeviceList;
