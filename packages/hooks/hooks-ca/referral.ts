import { useAppCASelector } from '.';
import { useMemo, useCallback } from 'react';
import { useCurrentNetwork } from '@portkey-wallet/hooks/hooks-ca/network';
import { useAppCommonDispatch } from '../index';
import { request } from '@portkey-wallet/api/api-did';
import { setViewReferralStatusLocal, setReferralLinkLocal } from '@portkey-wallet/store/store-ca/referral/slice';
import { ReferralStatusEnum } from '@portkey-wallet/store/store-ca/referral/type';
import { PORTKEY_PROJECT_CODE } from '@portkey-wallet/constants/constants-ca/wallet';

export const useReferralState = () => useAppCASelector(state => state.referral || {});

export function useReferral() {
  const dispatch = useAppCommonDispatch();
  const currentNetwork = useCurrentNetwork();
  const { viewReferralStatusMap, referralLinkMap } = useReferralState();

  const viewReferralStatus = useMemo(
    () => viewReferralStatusMap?.[currentNetwork],
    [currentNetwork, viewReferralStatusMap],
  );

  const referralLink = useMemo(() => referralLinkMap?.[currentNetwork], [currentNetwork, referralLinkMap]);

  const getViewReferralStatusStatus = useCallback(async () => {
    try {
      const { status } = await request.referral.getReferralRedDotsStatus();

      dispatch(
        setViewReferralStatusLocal({
          network: currentNetwork,
          value: status,
        }),
      );
    } catch (error) {
      console.log(error);
    }
  }, [currentNetwork, dispatch]);

  const getReferralLink = useCallback(async () => {
    try {
      const result = await request.referral.getReferralShortLink({
        params: {
          // todo: change projectCode
          projectCode: PORTKEY_PROJECT_CODE,
        },
      });

      dispatch(setReferralLinkLocal({ network: currentNetwork, value: result?.shortLink }));
    } catch (error) {
      console.log(error);
    }
  }, [currentNetwork, dispatch]);

  const setViewReferralStatusStatus = useCallback(async () => {
    dispatch(setViewReferralStatusLocal({ network: currentNetwork, value: ReferralStatusEnum.VIEWED }));

    try {
      await request.referral.setReferralRedDotsStatus();
    } catch (error) {
      console.log(error);
    }
  }, [currentNetwork, dispatch]);

  return {
    viewReferralStatus,
    referralLink,
    getViewReferralStatusStatus,
    getReferralLink,
    setViewReferralStatusStatus,
  };
}
