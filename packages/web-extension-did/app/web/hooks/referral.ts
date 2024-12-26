import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { useReferral } from '@portkey-wallet/hooks/hooks-ca/referral';
import { useCallback } from 'react';
import googleAnalytics from 'utils/googleAnalytics';
import singleMessage from 'utils/singleMessage';

export const useClickReferral = (setReferralStatus = true) => {
  const { setViewReferralStatusStatus, referralLink } = useReferral();
  const currentNetworkInfo = useCurrentNetworkInfo();
  return useCallback(() => {
    if (!referralLink) {
      singleMessage.info('Please check your internet connection and try again.');
      return;
    }
    googleAnalytics.referralEnterClickEvent();
    setReferralStatus && setViewReferralStatusStatus();
    const url = `${currentNetworkInfo?.referralUrl}/referral?shortLink=${encodeURIComponent(referralLink)}`;
    const openWinder = window.open(url, '_blank');
    if (openWinder) {
      openWinder.opener = null;
    }
  }, [currentNetworkInfo?.referralUrl, referralLink, setReferralStatus, setViewReferralStatusStatus]);
};
