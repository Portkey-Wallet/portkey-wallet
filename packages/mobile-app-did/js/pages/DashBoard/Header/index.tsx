import React, { useMemo, useCallback } from 'react';
import { View, Animated, TouchableOpacity, GestureResponderEvent } from 'react-native';
import { pTd } from 'utils/unit';
import { TextM } from 'components/CommonText';
import CommonAvatar from 'components/CommonAvatar';
import Touchable from 'components/Touchable';
import CommonToast from 'components/CommonToast';
import Svg from 'components/Svg';
import fonts from 'assets/theme/fonts';
import GStyles from 'assets/theme/GStyles';
import { darkColors, defaultColors } from 'assets/theme';
import { measureLocation } from 'utils/measure';
import { showCopyUserAddress } from '../CopyUserAddress';
import { showSetNewWalletNamePopover } from '../SetNewWalletName/Popover';
import { useCurrentUserInfo, useSetNewWalletName } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useQrScanPermissionAndToast } from 'hooks/useQrScan';
import navigationService from 'utils/navigationService';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import { makeStyles } from '@rneui/themed';

const DashBoardHeader: React.FC = () => {
  const userInfo = useCurrentUserInfo();
  const qrScanPermissionAndToast = useQrScanPermissionAndToast();
  const { shouldShowSetNewWalletNameIcon, handleSetNewWalletName } = useSetNewWalletName();
  const styles = getStyles();
  const onGiftClick = useCallback(() => {
    navigationService.navigate('CryptoGift');
  }, []);

  const onCopyAddress = useCallback(() => {
    showCopyUserAddress();
  }, []);

  const onSetNewWalletName = useCallback(async () => {
    try {
      await handleSetNewWalletName();
      CommonToast.success('Set Success');
    } catch (error) {
      CommonToast.failError(error);
    }
  }, [handleSetNewWalletName]);

  const onShowSetNewWalletNamePopover = useCallback(
    async (event: GestureResponderEvent) => {
      const xOffset = pTd(-8);
      const yOffset = pTd(16) + pTd(7);
      const location = await measureLocation(event.target);
      showSetNewWalletNamePopover({
        setNewWalletName: onSetNewWalletName,
        xPosition: location.pageX + xOffset,
        yPosition: location.pageY + yOffset,
      });
    },
    [onSetNewWalletName],
  );

  const nickNameMaxWidth = useMemo(() => {
    const nickNameLeft = pTd(46);
    let nickNameMinRight = 74;
    if (shouldShowSetNewWalletNameIcon) {
      nickNameMinRight += pTd(32);
    }
    return screenWidth - nickNameLeft - nickNameMinRight;
  }, [shouldShowSetNewWalletNameIcon]);
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
              {shouldShowSetNewWalletNameIcon && (
                <TouchableOpacity onPress={onShowSetNewWalletNamePopover} style={styles.suggestIcon}>
                  <Svg icon="suggest-circle" size={pTd(16)} />
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.skeletonWrap}>
            <View style={styles.skeletonIcon} />
            <View style={styles.skeletonText} />
          </View>
        )}
      </Animated.View>
    );
  }, [
    nickNameMaxWidth,
    onShowAccountSetting,
    onShowSetNewWalletNamePopover,
    shouldShowSetNewWalletNameIcon,
    userInfo?.avatar,
    userInfo.nickName,
    styles,
  ]);

  const rightDom = useMemo(() => {
    return (
      <View style={styles.rightDomWrap}>
        {/* {
          <Touchable style={styles.svgWrap} onPress={onGiftClick}>
            <Svg icon="crypto-gift" size={pTd(20)} />
          </Touchable>
        } */}
        <Touchable style={styles.svgWrap} onPress={onCopyAddress}>
          <Svg icon="copy" size={pTd(24)} color={darkColors.iconBase2} />
        </Touchable>
        <Touchable
          style={styles.svgWrap}
          onPress={async () => {
            if (!(await qrScanPermissionAndToast())) return;
            navigationService.navigate('QrScanner');
          }}>
          <Svg icon="scan" size={pTd(24)} color={darkColors.iconBase2} />
        </Touchable>
      </View>
    );
  }, [onCopyAddress, qrScanPermissionAndToast, styles]);

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
  accountName: {
    color: defaultColors.white,
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
    color: defaultColors.white,
    fontWeight: 'bold',
    ...fonts.mediumFont,
  },
}));

export default DashBoardHeader;
