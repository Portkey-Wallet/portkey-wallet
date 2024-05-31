import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Animated } from 'react-native';
import { NestedScrollView, NestedScrollViewHeader } from '@sdcx/nested-scroll';
import Card from './Card';
import DashBoardTab from './DashBoardTab';
import { SetNewWalletNamePopup } from './SetNewWalletName/Popup';
import DashBoardHeader from './Header';
import SafeAreaBox from 'components/SafeAreaBox';
import { BGStyles } from 'assets/theme/styles';
import { RootStackName } from 'navigation';
import myEvents from 'utils/deviceEvent';
import useReportAnalyticsEvent from 'hooks/userExceptionMessage';
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

  return (
    <SafeAreaBox edges={['top', 'right', 'left']} style={[BGStyles.white]}>
      <DashBoardHeader scrollY={scrollY} title={title} />
      <SetNewWalletNamePopup />
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

export default DashBoard;
