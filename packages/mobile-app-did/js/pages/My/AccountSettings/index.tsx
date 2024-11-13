import React, { useMemo, useCallback } from 'react';
import { StyleProp, ViewStyle, TextProps, View } from 'react-native';
import PageContainer from 'components/PageContainer';
import useBiometricsReady from 'hooks/useBiometrics';
import useLogOut from 'hooks/useLogOut';
import navigationService from 'utils/navigationService';
import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import { useLanguage } from 'i18n/hooks';
import MenuItem from '../components/MenuItem';
import ExistOverlay from '../WalletHome/components/ExistOverlay';
import { pTd } from 'utils/unit';
import { RootStackName } from 'navigation';
import { useCurrentUserInfo, useCurrentWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { removeManager } from '@portkey-wallet/utils/guardian';
import { request } from '@portkey-wallet/api/api-did';
import { useGetCurrentCAContract } from 'hooks/contract';
import Svg, { IconName } from 'components/Svg';
import Touchable from 'components/Touchable';
import Loading from 'components/Loading';
import CommonToast from 'components/CommonToast';
import FastImage from 'components/FastImage';
import { TextM } from 'components/CommonText';
import { makeStyles } from '@rneui/themed';
import { getDeviceInfo } from 'utils/deviceInfo';

interface MenuItemType {
  name: string;
  label: string;
  icon: IconName;
  suffixDom?: () => React.ReactNode;
  onPress?: () => void;
  showDivider?: boolean;
}

export default function AccountSettings() {
  const biometricsReady = useBiometricsReady();
  const styles = getStyles();

  const {
    walletInfo: { caHash, address: managerAddress },
  } = useCurrentWallet();
  const getCurrentCAContract = useGetCurrentCAContract();
  const userInfo = useCurrentUserInfo();
  const logout = useLogOut();
  const onExitClick = useCallback(
    async (isConfirm: boolean) => {
      if (!isConfirm || !managerAddress || !caHash) return;
      Loading.show();
      try {
        const { deviceId } = await getDeviceInfo();
        await request.wallet.reportExitWallet({ params: { deviceId } });

        const caContract = await getCurrentCAContract();
        const req = await removeManager(caContract, managerAddress, caHash);

        if (req && !req.error) {
          console.log('logout success', req);
          logout();
        } else {
          CommonToast.fail(req?.error?.message || '');
        }
      } catch (error) {
        console.log(error, '=====error');

        CommonToast.failError(error);
      }
      Loading.hide();
    },
    [caHash, getCurrentCAContract, logout, managerAddress],
  );
  const onSignOut = useCallback(() => {
    ExistOverlay.showExistOverlay({
      callBack: onExitClick,
    });
  }, [onExitClick]);

  const onPressItem = useCallback((item: MenuItemType) => {
    if (item.onPress) {
      item.onPress();
    } else {
      navigationService.navigate(item.name as RootStackName);
    }
  }, []);

  const { t } = useLanguage();
  const avatarSize = pTd(40);

  const sizeStyle = useMemo(
    () => ({
      width: Number(avatarSize),
      height: Number(avatarSize),
      borderRadius: Number(avatarSize) / 2,
      marginHorizontal: pTd(8),
    }),
    [avatarSize],
  );

  const MenuList: Array<MenuItemType> = useMemo(
    () => [
      {
        name: 'GuardianHome',
        label: 'Guardians',
        icon: 'my_guardians',
      },
      {
        name: 'Security',
        label: 'Security',
        icon: 'lock',
      },
      {
        name: 'PaymentSecurityList',
        label: 'Transaction limits',
        icon: 'my_transaction_limit',
      },
      {
        name: 'Token allowances',
        label: 'Token allowances',
        icon: 'my_token allowance',
      },
      {
        name: 'Backup email',
        label: 'Backup email',
        icon: 'my_mail_thin',
        suffixDom: () => {
          return (
            <TextM
              style={{
                color: '#FFFFFF',
                fontSize: 16,
              }}>
              Not set up
            </TextM>
          );
        },
        showDivider: true,
      },
      {
        name: 'Manage devices',
        label: 'Manage devices',
        icon: 'my_device',
      },
      {
        name: 'Connected dApps',
        label: 'Connected dApps',
        icon: 'my_connect',
      },
      {
        name: 'Address book',
        label: 'Address book',
        icon: 'my_contact',
        showDivider: true,
      },
      {
        name: 'Crypto gift',
        label: 'Crypto gift',
        icon: 'gift_thin',
        suffixDom: () => {
          return (
            <View
              style={{
                borderRadius: 4,
                backgroundColor: '#0076CC',
                height: pTd(20),
              }}>
              <TextM
                style={{
                  color: '#FFFFFF',
                  fontSize: 12,
                  paddingHorizontal: pTd(6),
                  paddingVertical: pTd(4),
                }}>
                New
              </TextM>
            </View>
          );
        },
      },
      {
        name: 'Referral',
        label: 'Referral',
        icon: 'my_referral',
        showDivider: true,
      },
      {
        name: 'Switch network',
        label: 'Switch network',
        icon: 'my_change',
        showDivider: true,
      },
      {
        name: 'Help center',
        label: 'Help center',
        icon: 'my_help',
      },
      {
        name: 'About Portkey',
        label: 'About Portkey',
        icon: 'my_about',
      },
      {
        name: 'Check for updates',
        label: 'Check for updates',
        icon: 'my_change',
      },
    ],
    [],
  );

  return (
    <PageContainer containerStyles={styles.containerStyles} safeAreaColor={['black']} titleDom={t('Setting')}>
      <View style={[styles.info]}>
        <View style={styles.userInfoWrap}>
          <FastImage style={[sizeStyle]} resizeMode="cover" source={{ uri: userInfo.avatar }} />
          <TextM>{userInfo.nickName}</TextM>
        </View>

        <Svg icon="right-arrow" size={pTd(20)} color={defaultColors.icon1} />
      </View>
      <View style={styles.divider} />

      {MenuList.map(item => (
        <>
          <Touchable
            style={[styles.cell]}
            onPress={() => {
              onPressItem(item);
            }}>
            <View style={styles.cellWrap}>
              <View style={styles.svgWrap}>
                <Svg icon={item.icon} size={pTd(24)} iconStyle={[styles.menuIcon]} />
              </View>
              <TextM style={styles.cellText}>{item.label}</TextM>
            </View>

            <View style={styles.cellRightWrap}>
              {item.suffixDom && item.suffixDom()}

              <Svg
                iconStyle={{
                  marginLeft: pTd(12),
                }}
                icon="right-arrow"
                size={pTd(20)}
                color={defaultColors.icon1}
              />
            </View>
          </Touchable>
          {item.showDivider && <View style={styles.divider} />}
        </>
      ))}
      <Touchable onPress={onSignOut}>
        <TextM style={styles.signOutText}>Sign out</TextM>
      </Touchable>
    </PageContainer>
  );
}

const getStyles = makeStyles(theme => ({
  containerStyles: {},
  info: {
    height: pTd(72),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cell: {
    height: pTd(48),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cellWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  svgWrap: {
    marginRight: pTd(12),
  },
  cellText: {
    color: theme.colors.textBase1,
    fontSize: 16,
  },
  cellRightWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIcon: {},
  menuItemWrap: {
    backgroundColor: defaultColors.black,
    color: defaultColors.white,
    borderBottomColor: defaultColors.border6,
    borderRadius: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  itemWrap: {
    backgroundColor: defaultColors.black,
    borderBottomColor: defaultColors.border6,
    borderRadius: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  divider: {
    height: 1,
    borderBottomWidth: 0.5,
    width: '100%',
    backgroundColor: '#FFF',
  },
  signOutText: {
    width: '100%',
    textAlign: 'center',
    color: '#E24505',
    height: pTd(48),
    marginTop: pTd(12),
    fontSize: 16,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
}));
