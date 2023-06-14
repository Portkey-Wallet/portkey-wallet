import { useCallback } from 'react';
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { CACommonState } from '@portkey-wallet/types/types-ca/store';
import { useAppCommonDispatch } from '../index';
import { resetAssets } from '@portkey-wallet/store/store-ca/assets/slice';
import { resetRecent } from '@portkey-wallet/store/store-ca/recent/slice';
import { resetActivity } from '@portkey-wallet/store/store-ca/activity/slice';
import { resetContact } from '@portkey-wallet/store/store-ca/contact/actions';
import { resetGuardiansState } from '@portkey-wallet/store/store-ca/guardians/actions';
import { resetPayment } from '@portkey-wallet/store/store-ca/payment/actions';

export const useAppCASelector: TypedUseSelectorHook<CACommonState> = useSelector;

export function useResetStore() {
  const dispatch = useAppCommonDispatch();
  return useCallback(() => {
    dispatch(resetAssets());
    dispatch(resetRecent());
    dispatch(resetActivity());
    dispatch(resetGuardiansState());
    dispatch(resetContact());
    dispatch(resetPayment());
  }, [dispatch]);
}
