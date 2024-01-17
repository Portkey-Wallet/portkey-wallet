import { useAppCASelector } from '.';
import { useMemo, useCallback } from 'react';
import { useCurrentNetwork } from '@portkey-wallet/hooks/hooks-ca/network';
import { useAppCommonDispatch } from '../index';
import { request } from '@portkey-wallet/api/api-did';
import { setViewReferralStatusLocal, setReferralLinkLocal } from '@portkey-wallet/store/store-ca/referral/slice';
import { RedDotsType } from '@portkey-wallet/store/store-ca/referral/type';

export const useReferralState = () => useAppCASelector(state => state.referral);

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
    const redDotsStatusArr = await request.referral.getReferralRedDotsStatus();

    dispatch(
      setViewReferralStatusLocal({
        network: currentNetwork,
        value: redDotsStatusArr?.find(
          (item: { type: RedDotsType; status: string | number }) => item?.type === RedDotsType.REFERRAL,
        )?.status,
      }),
    );
  }, [currentNetwork, dispatch]);

  const getReferralLink = useCallback(async () => {
    const result = await request.referral.getReferralShortLink({
      params: {
        // todo: change projectCode
        projectCode: '0',
      },
    });

    dispatch(setReferralLinkLocal({ network: currentNetwork, value: result?.shortLink }));
  }, [currentNetwork, dispatch]);

  const setViewReferralStatusStatus = useCallback(() => {
    dispatch(setViewReferralStatusLocal(currentNetwork));
    return request.referral.setReferralRedDotsStatus();
  }, [currentNetwork, dispatch]);

  return {
    viewReferralStatus,
    referralLink,
    getViewReferralStatusStatus,
    getReferralLink,
    setViewReferralStatusStatus,
  };
}
