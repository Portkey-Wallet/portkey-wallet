import React, { useMemo, useCallback } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { pTd } from 'utils/unit';
import { TextL, TextM } from 'components/CommonText';
import CommonAvatar from 'components/CommonAvatar';
import { PortkeyLinearGradient } from 'components/PortkeyLinearGradient';
import Touchable from 'components/Touchable';
import Svg from 'components/Svg';
import fonts from 'assets/theme/fonts';
import GStyles from 'assets/theme/GStyles';
import { defaultColors } from 'assets/theme';
import { showCopyUserAddress } from '../CopyUserAddress';
import { showSetNewWalletNamePopover } from '../SetNewWalletName/Popover';
import { useCurrentUserInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useQrScanPermissionAndToast } from 'hooks/useQrScan';
import navigationService from 'utils/navigationService';
import { Skeleton } from '@rneui/base';

interface DashBoardHeaderProps {
  title: string;
  scrollY: Animated.Value;
}

const DashBoardHeader: React.FC<DashBoardHeaderProps> = ({ title, scrollY }) => {
  const userInfo = useCurrentUserInfo();
  const qrScanPermissionAndToast = useQrScanPermissionAndToast();

  const onCopyAddress = useCallback(() => {
    showCopyUserAddress();
  }, []);

  const onShowSetNewWalletNamePopover = useCallback(() => {
    console.log('onShowSetNewWalletNamePopover');
    showSetNewWalletNamePopover();
  }, []);

  const leftDom = useMemo(() => {
    return (
      <Animated.View
        style={[
          {
            opacity: scrollY.interpolate({
              inputRange: [0, pTd(40), pTd(60)],
              outputRange: [1, 1, 0],
            }),
          },
          styles.leftDomWrap,
        ]}>
        <CommonAvatar
          hasBorder={!userInfo?.avatar}
          title={userInfo?.nickName}
          avatarSize={pTd(24)}
          imageUrl={userInfo?.avatar || ''}
          resizeMode="cover"
          titleStyle={{ fontSize: pTd(14) }}
        />
        {userInfo?.nickName ? (
          <View style={styles.accountNameWrap}>
            <TextM numberOfLines={1} style={styles.accountName}>
              {userInfo.nickName}
            </TextM>
            <TouchableOpacity onPress={onShowSetNewWalletNamePopover}>
              <Svg icon="suggest-circle" size={pTd(16)} iconStyle={styles.suggestIcon} />
            </TouchableOpacity>
          </View>
        ) : (
          <Skeleton
            animation="wave"
            LinearGradientComponent={() => <PortkeyLinearGradient />}
            style={[styles.skeletonStyle, GStyles.marginBottom(pTd(4))]}
            height={pTd(20)}
            width={pTd(80)}
          />
        )}
      </Animated.View>
    );
  }, [onShowSetNewWalletNamePopover, scrollY, userInfo?.avatar, userInfo.nickName]);

  const titleDom = useMemo(() => {
    return (
      <Animated.View
        style={{
          opacity: scrollY.interpolate({
            inputRange: [0, pTd(60), pTd(80)],
            outputRange: [0, 0, 1],
          }),
        }}>
        <TextL numberOfLines={1} style={styles.title}>
          {userInfo.hideAssets ? '******' : title}
        </TextL>
      </Animated.View>
    );
  }, [scrollY, title, userInfo.hideAssets]);

  const rightDom = useMemo(() => {
    return (
      <View style={styles.rightDomWrap}>
        <Touchable style={styles.svgWrap} onPress={onCopyAddress}>
          <Svg icon="copy" size={pTd(22)} color={defaultColors.font8} />
        </Touchable>
        <Touchable
          style={styles.svgWrap}
          onPress={async () => {
            if (!(await qrScanPermissionAndToast())) return;
            navigationService.navigate('QrScanner');
          }}>
          <Svg icon="scan" size={pTd(22)} color={defaultColors.font8} />
        </Touchable>
      </View>
    );
  }, [onCopyAddress, qrScanPermissionAndToast]);

  return (
    <View style={styles.container}>
      <View style={styles.titleWrap}>{titleDom}</View>
      {leftDom}
      {rightDom}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: defaultColors.white,
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
  accountNameWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountName: {
    color: defaultColors.neutralTertiaryText,
    opacity: 0.8,
    fontSize: pTd(14),
    lineHeight: pTd(20),
    height: pTd(20),
    marginLeft: pTd(6),
  },
  suggestIcon: {
    marginLeft: pTd(6),
    marginRight: pTd(6),
  },
  skeletonStyle: {
    backgroundColor: defaultColors.bg4,
    marginLeft: pTd(6),
  },
  titleWrap: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightDomWrap: {
    flexDirection: 'row',
    marginRight: pTd(8),
    marginLeft: pTd(8),
  },
  svgWrap: {
    padding: pTd(8),
  },
  title: {
    height: pTd(44),
    lineHeight: pTd(44),
    color: defaultColors.bg31,
    fontWeight: 'bold',
    ...fonts.mediumFont,
  },
});

export default DashBoardHeader;
