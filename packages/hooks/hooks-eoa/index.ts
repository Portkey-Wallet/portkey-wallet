import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { EOACommonState } from '../../types/types-eoa/store';
import { useAppCommonDispatch } from '../index';
import { useCallback } from 'react';
import { changeNftSectionUiType } from '@portkey-wallet/store/store-eoa/assets/slice';

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
