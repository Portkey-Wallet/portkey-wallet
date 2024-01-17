import { useReferral } from '@portkey-wallet/hooks/hooks-ca/referral';
import { useCallback } from 'react';

export const useClickReferral = () => {
  const { setViewReferralStatusStatus, referralLink } = useReferral();

  return useCallback(() => {
    setViewReferralStatusStatus();
    // TODO url
    const openWinder = window.open(referralLink, '_blank');
    if (openWinder) {
      openWinder.opener = null;
    }
  }, [referralLink, setViewReferralStatusStatus]);
};
