import React, { useMemo, useCallback } from 'react';
import { View, Animated, TouchableOpacity } from 'react-native';
import { pTd } from 'utils/unit';
import { TextM } from 'components/CommonText';
import CommonAvatar from 'components/CommonAvatar';
import Touchable from 'components/Touchable';
import Svg from 'components/Svg';
import fonts from 'assets/theme/fonts';
import GStyles from 'assets/theme/GStyles';
import { showCopyUserAddress } from '../CopyUserAddress';
import { useCurrentUserInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useQrScanPermissionAndToast } from 'hooks/useQrScan';
import navigationService from 'utils/navigationService';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import { makeStyles, useTheme } from '@rneui/themed';

const DashBoardHeader: React.FC = () => {
  const userInfo = useCurrentUserInfo();
  const qrScanPermissionAndToast = useQrScanPermissionAndToast();
  const styles = getStyles();
  const { theme } = useTheme();

  const onCopyAddress = useCallback(() => {
    showCopyUserAddress();
  }, []);

  const nickNameMaxWidth = useMemo(() => {
    const nickNameLeft = pTd(46);
    const nickNameMinRight = 74;
    return screenWidth - nickNameLeft - nickNameMinRight;
  }, []);
  const onShowAccountSetting = useCallback(() => {
    navigationService.navigate('ProfileSettings');
  }, []);
  const leftDom = useMemo(() => {
    return (
      <Animated.View style={styles.leftDomWrap}>
        {userInfo?.nickName ? (
          <TouchableOpacity onPress={onShowAccountSetting} style={styles.leftTouchableDomWrap}>
            <CommonAvatar
              hasBorder={!userInfo?.avatar}
              title={userInfo?.nickName}
              avatarSize={pTd(24)}
              imageUrl={userInfo?.avatar || ''}
              resizeMode="cover"
              titleStyle={{ fontSize: pTd(14) }}
            />
            <View style={styles.accountNameWrap}>
              <TextM numberOfLines={1} style={[styles.accountName, GStyles.maxWidth(nickNameMaxWidth)]}>
                {userInfo.nickName}
              </TextM>
              <View style={styles.arrowIconWrap}>
                <Svg icon="keyboard_arrow_down" size={pTd(12)} />
              </View>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={onShowAccountSetting} style={styles.skeletonWrap}>
            <View style={styles.skeletonIcon} />
            <View style={styles.skeletonText} />
          </TouchableOpacity>
        )}
      </Animated.View>
    );
  }, [nickNameMaxWidth, onShowAccountSetting, userInfo?.avatar, userInfo.nickName, styles]);

  const rightDom = useMemo(() => {
    return (
      <View style={styles.rightDomWrap}>
        <Touchable style={styles.svgWrap} onPress={onCopyAddress}>
          <Svg icon="copy" size={pTd(24)} color={theme.colors.iconBase2} />
        </Touchable>
        <Touchable
          style={styles.svgWrap}
          onPress={async () => {
            if (!(await qrScanPermissionAndToast())) {
              return;
            }
            navigationService.navigate('QrScanner');
          }}>
          <Svg icon="scan" size={pTd(24)} color={theme.colors.iconBase2} />
        </Touchable>
      </View>
    );
  }, [onCopyAddress, qrScanPermissionAndToast, styles, theme]);

  return (
    <View style={styles.container}>
      {leftDom}
      {rightDom}
    </View>
  );
};

const getStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    height: pTd(44),
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftDomWrap: {
    flex: 1,
    marginLeft: pTd(16),
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftTouchableDomWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountNameWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowIconWrap: {
    width: pTd(18),
    height: pTd(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountName: {
    color: theme.colors.textBase1,
    fontSize: pTd(14),
    lineHeight: pTd(20),
    height: pTd(20),
    marginLeft: pTd(6),
  },
  suggestIcon: {
    marginLeft: pTd(6),
    marginRight: pTd(6),
    width: pTd(16),
    height: pTd(16),
  },
  skeletonWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skeletonText: {
    marginLeft: pTd(6),
    width: pTd(126),
    height: pTd(14),
    borderRadius: pTd(4),
    backgroundColor: theme.colors.bgBase3,
  },
  skeletonIcon: {
    width: pTd(24),
    height: pTd(24),
    borderRadius: pTd(12),
    backgroundColor: theme.colors.bgBase3,
  },
  rightDomWrap: {
    flexDirection: 'row',
    marginRight: pTd(4),
    marginLeft: pTd(8),
    alignItems: 'center',
  },
  svgWrap: {
    padding: pTd(12),
  },
  title: {
    height: pTd(44),
    lineHeight: pTd(44),
    color: theme.colors.textBase1,
    ...fonts.mediumFont,
  },
}));

export default DashBoardHeader;
