import React, { useCallback, useEffect } from 'react';
import Card from './Card';
import DashBoardTab from './DashBoardTab';
import SafeAreaBox from 'components/SafeAreaBox';
import { BGStyles } from 'assets/theme/styles';
import { RootStackName } from 'navigation';
import myEvents from 'utils/deviceEvent';
import useReportAnalyticsEvent from 'hooks/userExceptionMessage';
import { useEffectOnce } from '@portkey-wallet/hooks';
import { useReportingSignalR } from 'hooks/FCM';
import { useManagerExceedTipModal } from 'hooks/managerCheck';
import { useReferral } from '@portkey-wallet/hooks/hooks-ca/referral';

const DashBoard: React.FC<any> = ({ navigation }) => {
  const reportAnalyticsEvent = useReportAnalyticsEvent();
  const { getViewReferralStatusStatus, getReferralLink } = useReferral();
  const managerExceedTipModalCheck = useManagerExceedTipModal();
  useReportingSignalR();

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

  return (
    <SafeAreaBox edges={['top', 'right', 'left']} style={[BGStyles.bg5]}>
      <Card />
      <DashBoardTab />
    </SafeAreaBox>
  );
};

export default DashBoard;
