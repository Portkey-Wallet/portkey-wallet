import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Animated, View } from 'react-native';
import { NestedScrollView, NestedScrollViewHeader } from '@sdcx/nested-scroll';
import Card from './Card';
import DashBoardTab from './DashBoardTab';
import { showCopyUserAddress } from './CopyUserAddress';
import SafeAreaBox from 'components/SafeAreaBox';
import Touchable from 'components/Touchable';
import CustomHeader from 'components/CustomHeader';
import Svg from 'components/Svg';
import { TextL, TextM } from 'components/CommonText';
import CommonAvatar from 'components/CommonAvatar';
import { PortkeyLinearGradient } from 'components/PortkeyLinearGradient';
import { BGStyles } from 'assets/theme/styles';
import fonts from 'assets/theme/fonts';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { RootStackName } from 'navigation';
import myEvents from 'utils/deviceEvent';
import { pTd } from 'utils/unit';
import navigationService from 'utils/navigationService';
import useReportAnalyticsEvent from 'hooks/userExceptionMessage';
import { useQrScanPermissionAndToast } from 'hooks/useQrScan';
import { useEffectOnce } from '@portkey-wallet/hooks';
import { useReportingSignalR } from 'hooks/FCM';
import { useManagerExceedTipModal } from 'hooks/managerCheck';
import { useReferral } from '@portkey-wallet/hooks/hooks-ca/referral';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCurrentUserInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useAccountBalanceUSD } from '@portkey-wallet/hooks/hooks-ca/balances';
import { formatAmountUSDShow } from '@portkey-wallet/utils/converter';
import { Skeleton } from '@rneui/base';

const DashBoard: React.FC<any> = ({ navigation }) => {
  const isMainnet = useIsMainnet();
  const userInfo = useCurrentUserInfo();
  const reportAnalyticsEvent = useReportAnalyticsEvent();
  const { getViewReferralStatusStatus, getReferralLink } = useReferral();
  const managerExceedTipModalCheck = useManagerExceedTipModal();
  const qrScanPermissionAndToast = useQrScanPermissionAndToast();
  const accountBalanceUSD = useAccountBalanceUSD();
  useReportingSignalR();

  const [scrollY, setScrollY] = useState(new Animated.Value(0));

  const navToChat = useCallback(
    (tabName: RootStackName) => {
      if (navigation && navigation.jumpTo) {
        navigation.jumpTo(tabName);
      }
    },
    [navigation],
  );

  useEffectOnce(() => {
    reportAnalyticsEvent({ message: 'DashBoard' });
    managerExceedTipModalCheck();
    getViewReferralStatusStatus();
    getReferralLink();
  });

  // nav's to chat tab
  useEffect(() => {
    const listener = myEvents.navToBottomTab.addListener(({ tabName }) => navToChat(tabName));
    return () => listener.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCopyAddress = useCallback(() => {
    showCopyUserAddress();
  }, []);

  const leftDom = useMemo(() => {
    return (
      <Animated.View
        style={[
          {
            opacity: scrollY.interpolate({
              inputRange: [0, pTd(60), pTd(80)],
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
          <TextM style={styles.accountName}>{userInfo?.nickName}</TextM>
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
  }, [scrollY, userInfo?.avatar, userInfo?.nickName]);

  const title = useMemo(() => {
    return isMainnet ? formatAmountUSDShow(accountBalanceUSD) : 'Dev Mode';
  }, [isMainnet, accountBalanceUSD]);

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
          {title}
        </TextL>
      </Animated.View>
    );
  }, [scrollY, title]);

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
    <SafeAreaBox edges={['top', 'right', 'left']} style={[BGStyles.white]}>
      <CustomHeader titleDom={titleDom} rightDom={rightDom} leftDom={leftDom} />
      <NestedScrollView>
        {React.cloneElement(
          <NestedScrollViewHeader
            stickyHeaderBeginIndex={1}
            onScroll={({ nativeEvent }) => {
              const {
                contentOffset: { y },
              } = nativeEvent;
              setScrollY(new Animated.Value(y));
            }}
          />,
          { children: <Card title={title} /> },
        )}
        <DashBoardTab />
      </NestedScrollView>
    </SafeAreaBox>
  );
};

const styles = StyleSheet.create({
  leftDomWrap: {
    marginLeft: pTd(16),
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountName: {
    color: defaultColors.font11,
    opacity: 0.8,
    fontSize: pTd(14),
    lineHeight: pTd(20),
    height: pTd(20),
    marginLeft: pTd(6),
  },
  skeletonStyle: {
    backgroundColor: defaultColors.bg4,
    marginLeft: pTd(6),
  },
  rightDomWrap: {
    flexDirection: 'row',
    marginRight: pTd(8),
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

export default DashBoard;
