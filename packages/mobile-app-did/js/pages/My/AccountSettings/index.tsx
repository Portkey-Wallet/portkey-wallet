import React, { useMemo, useCallback } from 'react';
import { View } from 'react-native';
import PageContainer from 'components/PageContainer';
import useBiometricsReady from 'hooks/useBiometrics';
import useLogOut from 'hooks/useLogOut';
import navigationService from 'utils/navigationService';
import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import { useLanguage } from 'i18n/hooks';
import { pTd } from 'utils/unit';
import { RootStackName } from 'navigation';
import { useCurrentUserInfo, useCurrentWallet, useSetNewWalletName } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useIsSecondaryMailSet } from '@portkey-wallet/hooks/hooks-ca/useSecondaryMail';
import { HELP_CENTER_URL } from '@portkey-wallet/constants/constants-ca/common';
import { removeManager } from '@portkey-wallet/utils/guardian';
import { request } from '@portkey-wallet/api/api-did';
import { useGetCurrentCAContract } from 'hooks/contract';
import Svg, { IconName } from 'components/Svg';
import Touchable from 'components/Touchable';
import Loading from 'components/Loading';
import CommonToast from 'components/CommonToast';
import FastImage from 'components/FastImage';
import { TextM } from 'components/CommonText';
import { makeStyles, useTheme } from '@rneui/themed';
import { getDeviceInfo } from 'utils/deviceInfo';
import ActionSheet from 'components/ActionSheet';
import { CommonPromptCard, PromptCardType } from 'components/CommonPromptCard';
import fonts from 'assets/theme/fonts';

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
  const { showNotSet, secondaryEmail, getSecondaryMail, hideNotSetMark, fetching } = useIsSecondaryMailSet();
  const { shouldShowSetNewWalletNameIcon, handleSetNewWalletName } = useSetNewWalletName();

  const onPressItem = useCallback((item: MenuItemType) => {
    if (item.onPress) {
      item.onPress();
    } else {
      navigationService.navigate(item.name as RootStackName);
    }
  }, []);

  const {
    walletInfo: { caHash, address: managerAddress },
  } = useCurrentWallet();
  const getCurrentCAContract = useGetCurrentCAContract();
  const userInfo = useCurrentUserInfo();
  const logout = useLogOut();
  const { theme } = useTheme();
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
        name: 'TokenAllowanceHome',
        label: 'Token allowances',
        icon: 'my_token allowance',
      },
      {
        name: 'Backup email',
        label: 'Backup email',
        icon: 'my_mail_thin',
        suffixDom:
          !fetching && showNotSet
            ? () => {
                return <TextM style={styles.setBackupMailText}>Not set up</TextM>;
              }
            : undefined,
        showDivider: true,
        onPress: () => {
          if (showNotSet) {
            navigationService.navigate('SecondaryMailboxEdit');
          } else {
            navigationService.navigate('SecondaryMailboxHome', {
              secondaryEmail,
            });
          }
        },
      },
      {
        name: 'DeviceList',
        label: 'Manage devices',
        icon: 'my_device',
      },
      {
        name: 'DappList',
        label: 'Connected dApps',
        icon: 'my_connect',
      },
      {
        name: 'Address book',
        label: 'Address book',
        icon: 'my_contact',
        showDivider: true,
        onPress: () => {
          navigationService.navigate('ContactsHome');
        },
      },
      {
        name: 'CryptoGift',
        label: 'Crypto gift',
        icon: 'gift_thin',
        suffixDom: () => {
          return (
            <View style={styles.newLabelWrap}>
              <TextM style={styles.newLabelText}>New</TextM>
            </View>
          );
        },
        showDivider: true,
      },
      // {
      //   name: 'Referral',
      //   label: 'Referral',
      //   icon: 'my_referral',
      //   showDivider: true,
      // },
      {
        name: 'SwitchNetworks',
        label: 'Switch network',
        icon: 'my_change',
        showDivider: true,
      },
      {
        name: 'Help center',
        label: 'Help center',
        icon: 'my_help',
        onPress: () => {
          navigationService.navigate('ProviderWebPage', {
            title: 'Help center',
            url: HELP_CENTER_URL,
          });
        },
      },
      {
        name: 'AboutUs',
        label: 'About Portkey',
        icon: 'my_about',
      },
      {
        name: 'Check for updates',
        label: 'Check for updates',
        icon: 'my_update',
      },
    ],
    [fetching, secondaryEmail, showNotSet, styles],
  );

  const onExitClick = useCallback(
    async (isConfirm: boolean) => {
      if (!isConfirm || !managerAddress || !caHash) return;
      // Loading.show({ text: t('Signing out of Portkey...') });
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
    ActionSheet.alert({
      showInfoIcon: true,
      title: 'Confirm sign out',
      message: 'Your assets will remain safe in your account and accessible next time you log in via social recovery.',
      buttons: [
        { title: 'Cancel', type: 'outline' },
        {
          title: 'Sign out',
          type: 'warning',
          onPress: () => {
            onExitClick(true);
          },
        },
      ],
    });
  }, [onExitClick]);

  const onPressUserInfo = useCallback(() => {
    navigationService.navigate('WalletName');
  }, []);

  const onSetNewWalletName = useCallback(async () => {
    try {
      await handleSetNewWalletName();
      CommonToast.success('Wallet name updated.');
    } catch (error) {
      CommonToast.failError(error);
    }
  }, [handleSetNewWalletName]);

  const updateWalletNameTip = useMemo(() => {
    return (
      <View>
        <TextM style={{ color: theme.colors.textWarning1, lineHeight: pTd(20) }}>
          {t(`Use your login account as your wallet name to give it a unique identity.`)}
        </TextM>
        <Touchable onPress={onSetNewWalletName}>
          <TextM style={[fonts.SGMediumFont, { color: theme.colors.textBrand1, marginTop: pTd(16) }]}>
            {t(`Set it now`)}
          </TextM>
        </Touchable>
      </View>
    );
  }, [onSetNewWalletName, t, theme]);

  return (
    <PageContainer containerStyles={styles.containerStyles} safeAreaColor={['black']} titleDom={t('Setting')}>
      {shouldShowSetNewWalletNameIcon && (
        <CommonPromptCard
          style={{ marginBottom: pTd(16) }}
          type={PromptCardType.WARNING}
          description={updateWalletNameTip}
        />
      )}
      <Touchable style={[styles.info]} onPress={onPressUserInfo}>
        <View style={styles.userInfoWrap}>
          <FastImage style={[sizeStyle]} resizeMode="cover" source={{ uri: userInfo.avatar }} />
          <TextM>{userInfo.nickName}</TextM>
        </View>

        <Svg icon="right-arrow" size={pTd(20)} color={defaultColors.icon1} />
      </Touchable>
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
  setBackupMailText: {
    color: theme.colors.textBase1,
    fontSize: 16,
  },
  newLabelWrap: {
    borderRadius: 4,
    backgroundColor: theme.colors.iconBrand6,
    height: pTd(20),
    width: pTd(38),
    justifyContent: 'center',
    alignItems: 'center',
  },
  newLabelText: {
    color: theme.colors.textBase1,
    fontSize: 12,
  },
}));
