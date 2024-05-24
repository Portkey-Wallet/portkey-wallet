import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Animated } from 'react-native';
import { NestedScrollView, NestedScrollViewHeader } from '@sdcx/nested-scroll';
import Card from './Card';
import DashBoardTab from './DashBoardTab';
import SafeAreaBox from 'components/SafeAreaBox';
import Touchable from 'components/Touchable';
import CustomHeader from 'components/CustomHeader';
import Svg from 'components/Svg';
import { TextL } from 'components/CommonText';
import { BGStyles } from 'assets/theme/styles';
import fonts from 'assets/theme/fonts';
import { defaultColors } from 'assets/theme';
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
import { useAccountBalanceUSD } from '@portkey-wallet/hooks/hooks-ca/balances';
import { formatAmountUSDShow } from '@portkey-wallet/utils/converter';

const DashBoard: React.FC<any> = ({ navigation }) => {
  const isMainnet = useIsMainnet();
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
      <Touchable
        style={styles.svgWrap}
        onPress={async () => {
          if (!(await qrScanPermissionAndToast())) return;
          navigationService.navigate('QrScanner');
        }}>
        <Svg icon="scan" size={pTd(22)} color={defaultColors.font8} />
      </Touchable>
    );
  }, [qrScanPermissionAndToast]);

  return (
    <SafeAreaBox edges={['top', 'right', 'left']} style={[BGStyles.white]}>
      <CustomHeader titleDom={titleDom} rightDom={rightDom} />
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
  svgWrap: {
    padding: pTd(16),
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
