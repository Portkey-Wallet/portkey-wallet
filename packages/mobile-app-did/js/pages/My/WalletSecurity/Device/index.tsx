import React, { useCallback, useEffect, useRef, useState } from 'react';
import PageContainer from 'components/PageContainer';
import { FlatList, View, Text } from 'react-native';
import { useLanguage } from 'i18n/hooks';
import Touchable from 'components/Touchable';
import CommonButton from 'components/CommonButton';
import GStyles from 'assets/theme/GStyles';
import Svg from 'components/Svg';
import { IDeviceItem, useCurrentWalletInfo, useDeviceList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import DeviceItem from './components/DeviceItem';
import fonts from 'assets/theme/fonts';
import { pTd } from 'utils/unit';
import myEvents from 'utils/deviceEvent';
import useEffectOnce from 'hooks/useEffectOnce';
import CommonToast from 'components/CommonToast';
import { TextM, TextL, TextTitle } from 'components/CommonText';
import { makeStyles, useTheme } from '@rneui/themed';
import { ApprovalType } from '@portkey-wallet/types/verifier';
import ActionSheet from 'components/ActionSheet';

const DeviceList: React.FC = () => {
  const onError = useCallback(() => {
    CommonToast.failError(`Loading failed. Please retry.`);
  }, []);
  const pageStyles = getStyles();
  const { theme } = useTheme();
  const {
    deviceList,
    refresh,
    loading: isRefreshing,
  } = useDeviceList({
    isInit: false,
    onError,
  });
  const walletInfo = useCurrentWalletInfo();
  const [isRemoving, setIsRemoving] = useState(false);
  const [removeDevices, setRemoveDevices] = useState<IDeviceItem[]>([]);
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
          isShowCheckBox={isRemoving && walletInfo.address !== item.managerAddress}
          onPress={isClicked => {
            const index = removeDevices.indexOf(item);
            if (isClicked) {
              if (index === -1) {
                setRemoveDevices([...removeDevices, item]);
              }
            } else {
              if (index !== -1) {
                setRemoveDevices(removeDevices.filter(i => i !== item));
              }
            }
          }}
        />
      );
    },
    [walletInfo.address, isRemoving, removeDevices],
  );
  useEffect(() => {
    if (!isRemoving) {
      setRemoveDevices([]);
    }
  }, [isRemoving]);
  const { t } = useLanguage();
  const showDialog = useCallback(
    () =>
      ActionSheet.alert({
        title: t('Remove selected login devices?'),
        message: t(
          `After removal, you'll need to verify your identity through your guardians the next time you log in on these devices.`,
        ),
        showInfoIcon: true,
        buttons: [
          {
            title: t('Cancel'),
            type: 'outline',
          },
          {
            title: t(`Remove (${removeDevices.length})`),
            type: 'warning',
            onPress: () => {
              // todo: remove devices
            },
          },
        ],
      }),
    [t],
  );
  return (
    <PageContainer
      titleDom={'Manage Devices'}
      rightDom={
        <Touchable style={[GStyles.marginRight(pTd(16))]} onPress={() => setIsRemoving(!isRemoving)}>
          {isRemoving ? <TextM>Cancel</TextM> : <Svg size={pTd(24)} icon="edit" />}
        </Touchable>
      }
      safeAreaColor={['black']}
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
        ListHeaderComponent={
          <View style={pageStyles.fromExchangeTipWrap}>
            <Svg icon="warning" size={pTd(22)} color={theme.colors.textBrand3} />
            <TextL
              style={
                pageStyles.fromExchangeTipText
              }>{`You can manage and remove any login device. Note: If you log in again on a removed device, you'll need to verify your identity through your guardians.`}</TextL>
          </View>
        }
      />
      <CommonButton
        type="clear"
        buttonStyle={pageStyles.deleteBtn}
        disabled={removeDevices.length === 0}
        onPress={() => {
          showDialog();
          // navigationService.navigate('GuardianApproval', {
          //   approvalType: ApprovalType.removeOtherManager,
          //   removeManagerAddress: deviceItem?.managerAddress,
          // });
        }}>
        <TextL style={pageStyles.deleteBtnTitle}>Remove ({removeDevices.length})</TextL>
      </CommonButton>
    </PageContainer>
  );
};

const getStyles = makeStyles(theme => ({
  pageWrap: {
    backgroundColor: theme.colors.bgBase1,
    paddingHorizontal: 0,
  },
  listWrap: {
    ...GStyles.paddingArg(24, 20, 18),
  },
  tipsWrap: {
    lineHeight: pTd(20),
    marginBottom: pTd(24),
  },
  fromExchangeTipWrap: {
    backgroundColor: theme.colors.bgBase1,
    borderWidth: pTd(1),
    borderColor: theme.colors.textBase3,
    borderRadius: pTd(16),
    padding: pTd(16),
    flexDirection: 'row',
    marginBottom: pTd(24),
  },
  fromExchangeTipText: {
    flex: 1,
    marginLeft: pTd(12),
    color: theme.colors.textBase2,
    lineHeight: pTd(20),
    fontSize: pTd(14),
  },
  deleteBtnTitle: {
    ...fonts.mediumFont,
    color: theme.colors.textBase2,
  },
  deleteBtn: {
    marginHorizontal: pTd(16),
    marginBottom: pTd(14),
    backgroundColor: theme.colors.bgDanger1,
  },
}));

export default DeviceList;
