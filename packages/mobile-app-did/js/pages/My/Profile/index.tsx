import React, { memo, useCallback, useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import navigationService from 'utils/navigationService';
import { TextL } from 'components/CommonText';
import { defaultColors } from 'assets/theme';
import MenuItem from '../components/MenuItem';
import { RootStackName } from 'navigation';
import Svg, { IconName } from 'components/Svg';
import { pTd } from 'utils/unit';
import { makeStyles } from '@rneui/themed';
import fonts from 'assets/theme/fonts';
import ExistOverlay from '../WalletHome/components/ExistOverlay';
import Loading from 'components/Loading';
import { useCurrentUserInfo, useCurrentWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { getDeviceInfo } from 'utils/deviceInfo';
import { useGetCurrentCAContract } from 'hooks/contract';
import { removeManager } from '@portkey-wallet/utils/guardian';
import { request } from '@portkey-wallet/api/api-did';
import useLogOut from 'hooks/useLogOut';
import CommonToast from 'components/CommonToast';
import CommonAvatar from 'components/CommonAvatar';
import GStyles from 'assets/theme/GStyles';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import Divider from 'components/Divider';
import ActionSheet from 'components/ActionSheet';

interface MenuItemType {
  name?: RootStackName;
  label: string;
  icon?: IconName;
  suffixDom?: React.ReactNode;
  type?: 'item' | 'divider';
  onPress?: () => void;
}

const Settings = () => {
  const { t } = useLanguage();
  const {
    walletInfo: { caHash, address: managerAddress },
  } = useCurrentWallet();
  const getCurrentCAContract = useGetCurrentCAContract();
  const userInfo = useCurrentUserInfo();
  const logout = useLogOut();
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
    [caHash, getCurrentCAContract, logout, managerAddress, t],
  );

  const MenuList: Array<MenuItemType> = useMemo(
    () => [
      {
        label: 'divider1',
        type: 'divider',
      },
    ],
    [],
  );
  const nickNameMaxWidth = useMemo(() => {
    const nickNameLeft = pTd(46);
    const nickNameMinRight = 74;
    return screenWidth - nickNameLeft - nickNameMinRight;
  }, []);
  const onClose = useCallback(() => {
    navigationService.goBack();
  }, []);
  const onAvatarPress = useCallback(() => {
    // todo
  }, []);
  const onSignOut = useCallback(() => {
    // ExistOverlay.showExistOverlay({
    //   callBack: onExitClick,
    // });
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

  const styles = getStyles();
  return (
    <PageContainer
      leftDom={
        <TouchableOpacity onPress={onClose}>
          <Svg icon="close4" size={pTd(20)} />
        </TouchableOpacity>
      }
      titleDom={t('Settings')}
      safeAreaColor={['black', 'black']}
      scrollViewProps={{ disabled: true }}
      containerStyles={styles.container}
      style={styles.pageContainer}>
      <TouchableOpacity onPress={onAvatarPress} style={styles.avatarDomWrap}>
        <CommonAvatar
          hasBorder={!userInfo?.avatar}
          title={userInfo?.nickName}
          avatarSize={pTd(40)}
          imageUrl={userInfo?.avatar || ''}
          resizeMode="cover"
          titleStyle={{ fontSize: pTd(14) }}
        />
        <View style={styles.accountNameWrap}>
          <TextL numberOfLines={1} style={[styles.accountName, GStyles.maxWidth(nickNameMaxWidth)]}>
            {userInfo.nickName}
          </TextL>
        </View>
        <Svg icon="right-arrow" size={pTd(12)} color={defaultColors.icon1} />
      </TouchableOpacity>
      {/* <Divider /> */}
      {MenuList.map(ele => {
        if (ele.type === 'divider') {
          return <Divider key={ele.label} />;
        }
        return (
          <MenuItem
            // showWarningCycle={ele.name === 'ContactsHome' && isImputation}
            // style={styles.menuItemWrap}
            icon={ele?.icon || 'setting'}
            title={t(ele.label || '')}
            key={ele.name}
            // iconStyle={styles.menuItemIconStyle}
            onPress={ele.onPress ? ele.onPress : () => navigationService.navigate('SwitchNetworks')}
            suffix={ele.suffixDom}
          />
        );
      })}
      <TouchableOpacity onPress={onSignOut}>
        <TextL style={styles.signOut}>Sign out</TextL>
      </TouchableOpacity>
    </PageContainer>
  );
};
export default memo(Settings);

const getStyles = makeStyles(theme => ({
  pageContainer: {
    paddingHorizontal: pTd(16),
  },
  container: {
    paddingHorizontal: pTd(16),
    flex: 1,
  },
  signOut: {
    color: theme.colors.textDanger1,
    marginBottom: pTd(24),
    paddingVertical: pTd(16),
    textAlign: 'center',
    ...fonts.SGMediumFont,
  },
  avatarDomWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: pTd(16),
  },
  accountNameWrap: {
    flex: 1,
    marginLeft: pTd(8),
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountName: {
    color: theme.colors.textBase1,
    fontSize: pTd(14),
    lineHeight: pTd(20),
    height: pTd(20),
    marginLeft: pTd(6),
    ...fonts.SGRegularFont,
  },
}));
