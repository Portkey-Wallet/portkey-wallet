import { useAppCASelector } from '.';
import { useMemo, useCallback } from 'react';
import { useCurrentNetwork } from '@portkey-wallet/hooks/hooks-ca/network';
import { useAppCommonDispatch } from '../index';
import { request } from '@portkey-wallet/api/api-did';
import {
  fetchViewReferralStatusAsync,
  fetchReferralLinkAsync,
  setViewReferralStatusLocal,
} from '@portkey-wallet/store/store-ca/referral/slice';

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

  const getViewReferralStatusStatus = useCallback(() => {
    dispatch(fetchViewReferralStatusAsync(currentNetwork));
  }, [currentNetwork, dispatch]);

  const getReferralLink = useCallback(() => {
    dispatch(fetchReferralLinkAsync(currentNetwork));
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
