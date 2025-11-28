import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { EOACommonState } from '../../types/types-eoa/store';
import { useAppCommonDispatch } from '../index';
import { useCallback } from 'react';
import { changeNftSectionUiType } from '@portkey-wallet/store/store-eoa/assets/slice';
import { resetContact } from '@portkey-wallet/store/store-eoa/contact/actions';
import { useCurrentNetwork } from './network';

export const useAppEOASelector: TypedUseSelectorHook<EOACommonState> = useSelector;

export function useNFTSection() {
  const dispatch = useAppCommonDispatch();
  const { nftSectionUiType } = useAppEOASelector(state => state.assets);
  const changeNFTSectionMode = useCallback(
    (value: 'Collections' | 'NFTs') => {
      dispatch(changeNftSectionUiType(value));
    },
    [dispatch],
  );
  return {
    nftSectionUiType,
    changeNFTSectionMode,
  };
}

export function useResetStore() {
  const dispatch = useAppCommonDispatch();
  const currentNetwork = useCurrentNetwork();

  return useCallback(() => {
    // dispatch(resetActivity());
    // dispatch(resetGuardiansState());
    dispatch(
      resetContact({
        network: currentNetwork,
      }),
    );
    // dispatch(resetReferral());
  }, [currentNetwork, dispatch]);
}
