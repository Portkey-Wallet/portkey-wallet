import { useCallback } from 'react';
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { CACommonState } from '@portkey-wallet/types/types-ca/store';
import { useAppCommonDispatch } from '../index';
import { resetAssets } from '@portkey-wallet/store/store-ca/assets/slice';
import { resetRecent } from '@portkey-wallet/store/store-ca/recent/slice';
import { resetActivity } from '@portkey-wallet/store/store-ca/activity/slice';
import { resetContact } from '@portkey-wallet/store/store-ca/contact/actions';
import { resetGuardiansState } from '@portkey-wallet/store/store-ca/guardians/actions';
import { resetTokenManagement } from '@portkey-wallet/store/store-ca/tokenManagement/slice';
import { resetHasShowUploadV2WaringModal } from '@portkey-wallet/store/settings/slice';
import { resetRamp } from '@portkey-wallet/store/store-ca/ramp/slice';

export const useAppCASelector: TypedUseSelectorHook<CACommonState> = useSelector;

export function useResetStore() {
  const dispatch = useAppCommonDispatch();
  return useCallback(() => {
    dispatch(resetTokenManagement());
    dispatch(resetAssets());
    dispatch(resetRecent());
    dispatch(resetActivity());
    dispatch(resetGuardiansState());
    dispatch(resetContact());
    dispatch(resetHasShowUploadV2WaringModal());
    dispatch(resetRamp());
  }, [dispatch]);
}
