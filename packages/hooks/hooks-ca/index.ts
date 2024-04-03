import { useCallback } from 'react';
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { CACommonState } from '@portkey-wallet/types/types-ca/store';
import { useAppCommonDispatch } from '../index';
import { resetRecent } from '@portkey-wallet/store/store-ca/recent/slice';
import { resetActivity } from '@portkey-wallet/store/store-ca/activity/slice';
import { resetContact } from '@portkey-wallet/store/store-ca/contact/actions';
import { resetGuardiansState } from '@portkey-wallet/store/store-ca/guardians/actions';
import { resetReferral } from '@portkey-wallet/store/store-ca/referral/slice';
import { useOtherNetworkLogged, useWallet } from './wallet';
import { resetTokenInfo } from '@portkey-wallet/store/store-ca/tokenManagement/action';
import {
  clearAccountAssetsInfo,
  clearAccountNftCollectionInfo,
  clearAccountTokenInfo,
  resetAssets,
} from '@portkey-wallet/store/store-ca/assets/slice';
import { resetTokenManagement } from '@portkey-wallet/store/store-ca/tokenManagement/slice';
import { resetCaInfo, resetCurrentUserInfoAction, resetWallet } from '@portkey-wallet/store/store-ca/wallet/actions';
import { resetNetwork } from '@portkey-wallet/store/network/actions';
import { resetSettings } from '@portkey-wallet/store/settings/slice';

export const useAppCASelector: TypedUseSelectorHook<CACommonState> = useSelector;

export function useResetStore() {
  const dispatch = useAppCommonDispatch();
  return useCallback(() => {
    dispatch(resetRecent());
    dispatch(resetActivity());
    dispatch(resetGuardiansState());
    dispatch(resetContact());
    dispatch(resetReferral());
  }, [dispatch]);
}

export function useLogoutResetStore() {
  const dispatch = useAppCommonDispatch();
  const otherNetworkLogged = useOtherNetworkLogged();
  const { currentNetwork } = useWallet();
  return useCallback(() => {
    if (otherNetworkLogged) {
      dispatch(resetCurrentUserInfoAction(currentNetwork));
      dispatch(resetTokenInfo(currentNetwork));
      dispatch(clearAccountTokenInfo(currentNetwork));
      dispatch(clearAccountAssetsInfo(currentNetwork));
      dispatch(clearAccountNftCollectionInfo(currentNetwork));
      dispatch(resetCaInfo(currentNetwork));
    } else {
      dispatch(resetTokenManagement());
      dispatch(resetAssets());
      dispatch(resetWallet());
      dispatch(resetNetwork());
      dispatch(resetSettings());
    }
  }, [currentNetwork, dispatch, otherNetworkLogged]);
}
