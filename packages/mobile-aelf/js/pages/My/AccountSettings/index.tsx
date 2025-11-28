import React, { useMemo, useCallback } from 'react';
import { View, Text } from 'react-native';
import PageContainer from 'components/PageContainer';
import navigationService from 'utils/navigationService';
import { useLanguage } from 'i18n/hooks';
import { pTd } from 'utils/unit';
import { RootStackName } from 'navigation';
import { useCurrentAccount, useCurrentWallet } from '@portkey-wallet/hooks/hooks-eoa/wallet';
import fonts from 'assets/theme/fonts';
import Svg, { IconName } from 'components/Svg';
import Touchable from 'components/Touchable';
import { TextL, TextM } from 'components/CommonText';
import { makeStyles } from '@rneui/themed';
import { useCurrentDappList } from '@portkey-wallet/hooks/hooks-eoa/dapp';
import CommonAvatar from 'components/CommonAvatar';
import { LOCAL_AVATARS } from 'assets/image/avatars';
import { useCurrentNetwork } from '@portkey-wallet/hooks/hooks-eoa/network';
import { useAddressesTokensInfo } from '../WalletManagement/hooks/useAddressesTokensInfo';

interface MenuItemType {
  name: string;
  label: string;
  icon: IconName;
  suffixDom?: () => React.ReactNode;
  onPress?: () => void;
  showDivider?: boolean;
}

export default function AccountSettings() {
  const styles = getStyles();
  const dappList = useCurrentDappList();
  const currentNetwork = useCurrentNetwork();

  const onPressItem = useCallback((item: MenuItemType) => {
    if (item.onPress) {
      item.onPress();
    } else {
      navigationService.navigate(item.name as RootStackName);
    }
  }, []);

  const userInfo = useCurrentAccount();
  const accountsAddress = useMemo(() => (userInfo?.address ? [userInfo.address] : []), [userInfo]);

  const { addressesTotalBalanceInUsd } = useAddressesTokensInfo(accountsAddress);
  const currentWallet = useCurrentWallet();
  const { t } = useLanguage();
  const avatarSize = pTd(40);

  const MenuList: Array<MenuItemType> = useMemo(
    () => [
      {
        name: 'Security',
        label: 'Security',
        icon: 'lock',
      },
      {
        name: 'WalletManagement',
        label: 'Wallet management',
        icon: 'wallet thin',
      },
      {
        name: 'DappList',
        label: 'Connected dApps',
        icon: 'my_connect',
        suffixDom: () => <TextM style={styles.setBackupMailText}>{dappList?.length}</TextM>,
      },
      {
        name: 'Address book',
        label: 'Address book',
        icon: 'my_contact',
        // showDivider: true,
        onPress: () => {
          navigationService.navigate('ContactsHome');
        },
      },
      {
        name: 'SwitchNetworks',
        label: 'Switch network',
        icon: 'my_change',
        suffixDom: () => (
          <TextM style={styles.setBackupMailText}>
            {currentNetwork === 'MAINNET' ? 'aelf Mainnet' : 'aelf Testnet'}
          </TextM>
        ),
      },
      {
        name: 'AboutUs',
        label: 'About FairyVault',
        icon: 'logo-fairy-vault',
      },
    ],
    [dappList?.length, styles],
  );

  const onPressUserInfo = useCallback(() => {
    // navigationService.navigate('WalletName');
    navigationService.push('AddressDetail', {
      currentWalletKey: currentWallet?.key,
      currentAddress: userInfo?.address,
    });
  }, [currentWallet?.key, userInfo?.address]);

  return (
    <PageContainer
      containerStyles={styles.containerStyles}
      safeAreaColor={['black']}
      titleDom={t('Settings')}
      leftIconType="close">
      <Touchable style={[styles.info]} onPress={onPressUserInfo}>
        <View style={styles.userInfoWrap}>
          <CommonAvatar
            hasBorder={true}
            title={userInfo?.name}
            avatarSize={avatarSize}
            // imageUrl={userInfo?.avatar || ''}
            localImage={LOCAL_AVATARS[userInfo?.icon || 'avatar_1']}
            resizeMode="cover"
            titleStyle={{ fontSize: pTd(14) }}
          />

          <TextL
            style={{
              marginLeft: pTd(8),
            }}>
            {userInfo?.name}
          </TextL>
        </View>

        <View style={styles.userInfoRight}>
          <Text style={styles.userInfoUSDBalance}>
            {addressesTotalBalanceInUsd && userInfo?.address
              ? `$${addressesTotalBalanceInUsd[userInfo?.address] || '0'}`
              : ''}
          </Text>
          <Svg icon="chevron_right" size={pTd(12)} />
        </View>
      </Touchable>
      <View style={styles.divider} />

      {MenuList.map((item, index) => (
        <Touchable
          key={index}
          style={[styles.cell]}
          onPress={() => {
            onPressItem(item);
          }}>
          <View style={styles.cellWrap}>
            <View style={styles.svgWrap}>
              <Svg icon={item.icon} size={pTd(24)} />
            </View>
            <TextL style={styles.cellText}>{item.label}</TextL>
          </View>

          <View style={styles.cellRightWrap}>
            {item.suffixDom && item.suffixDom()}

            <Svg
              iconStyle={{
                marginLeft: pTd(12),
              }}
              icon="chevron_right"
              size={pTd(12)}
            />
          </View>
        </Touchable>
        // <View key={index}>
        //   {item.showDivider && <View style={styles.divider} />}
        // </View>
      ))}
    </PageContainer>
  );
}

const getStyles = makeStyles(theme => ({
  containerStyles: {},
  info: {
    marginTop: pTd(16),
    height: pTd(74),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfoRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfoUSDBalance: {
    ...fonts.SGMediumFont,
    color: theme.colors.textBase1,
    fontSize: pTd(16),
    lineHeight: pTd(16) * 1.4,
    marginRight: pTd(4),
  },
  cell: {
    height: pTd(48),
    marginBottom: pTd(12),
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
    lineHeight: pTd(18),
    color: theme.colors.textBase1,
    fontSize: pTd(16),
  },
  cellRightWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    borderBottomWidth: 0.5,
    width: '100%',
    backgroundColor: theme.colors.borderNeutral2,
    // backgroundColor: '#FFF',
    marginVertical: pTd(12),
  },
  setBackupMailText: {
    lineHeight: pTd(18),
    color: theme.colors.textBase2,
    fontSize: pTd(16),
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
    lineHeight: pTd(14),
    fontSize: pTd(12),
  },
}));
