import { OpacityType } from '@portkey-wallet/types';
import { useCallback, useMemo } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { LoadingInfoType, setLoading } from '@portkey/did-ui-react';
import type { RootState, AppDispatch } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useWalletInfo = () => useAppSelector((state) => state.wallet);
export const useLoginInfo = () => useAppSelector((state) => state.loginCache);
export const useContact = () => useAppSelector((state) => state.contact);

export const useTokenBalance = () => useAppSelector((state) => state.tokenBalance);
export const useUserInfo = () => useAppSelector((state) => state.userInfo);
export const useGuardiansInfo = () => useAppSelector((state) => state.guardians);
export const useTokenInfo = () => useAppSelector((state) => state.tokenManagement);
export const useAssetInfo = () => useAppSelector((state) => state.assets);
export const useCustomModal = () => useAppSelector((state) => state.modal);
export const useMiscState = () => useAppSelector((state) => state.misc);
export const useCommonState = () => useAppSelector((state) => state.common);
export const useDapp = () => useAppSelector((state) => state.dapp);
export const useDiscover = () => useAppSelector((state) => state.discover);
export const useLoading = () => {
  const _setLoading = useCallback(
    (isLoading: boolean | OpacityType, loadingInfo?: LoadingInfoType) => setLoading(isLoading, loadingInfo),
    [],
  );
  return useMemo(() => ({ setLoading: _setLoading }), [_setLoading]);
};
