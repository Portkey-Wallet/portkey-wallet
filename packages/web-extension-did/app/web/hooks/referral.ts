import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { useReferral } from '@portkey-wallet/hooks/hooks-ca/referral';
import { useCallback } from 'react';

export const useClickReferral = () => {
  const { setViewReferralStatusStatus, referralLink } = useReferral();
  const currentNetworkInfo = useCurrentNetworkInfo();
  return useCallback(() => {
    setViewReferralStatusStatus();
    const url = `${currentNetworkInfo?.referralUrl}/referral?shortLink=${referralLink}`;
    const openWinder = window.open(url, '_blank');
    if (openWinder) {
      openWinder.opener = null;
    }
  }, [currentNetworkInfo.referralUrl, referralLink, setViewReferralStatusStatus]);
};
