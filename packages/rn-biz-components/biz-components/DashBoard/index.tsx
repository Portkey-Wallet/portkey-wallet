import React, { useCallback, useEffect } from 'react';
import Card from './Card';
import DashBoardTab from './DashBoardTab';
import SafeAreaBox from '@portkey-wallet/rn-components/components/SafeAreaBox';
import { BGStyles } from '@portkey-wallet/rn-base/assets/theme/styles';
// import { RootStackName } from 'navigation';
import myEvents from '@portkey-wallet/rn-base/utils/deviceEvent';
import useReportAnalyticsEvent from '@portkey-wallet/rn-base/hooks/userExceptionMessage';
import { useEffectOnce } from '@portkey-wallet/hooks';
import { useReportingSignalR } from '@portkey-wallet/rn-base/hooks/FCM';
import { useManagerExceedTipModal } from '@portkey-wallet/rn-base/hooks/managerCheck';
import { useReferral } from '@portkey-wallet/hooks/hooks-ca/referral';

const DashBoard: React.FC<any> = ({ navigation }) => {
  const reportAnalyticsEvent = useReportAnalyticsEvent();
  const { getViewReferralStatusStatus, getReferralLink } = useReferral();
  const managerExceedTipModalCheck = useManagerExceedTipModal();
  useReportingSignalR();

  const navToChat = useCallback(
    (tabName: any) => {
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
  }, []);

  return (
    <SafeAreaBox edges={['top', 'right', 'left']} style={[BGStyles.bg5]}>
      <Card />
      <DashBoardTab />
    </SafeAreaBox>
  );
};

export default DashBoard;
