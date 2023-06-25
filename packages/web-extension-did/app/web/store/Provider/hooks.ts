import { OpacityType } from '@portkey-wallet/types';
import { useCallback, useMemo } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { setGlobalLoading } from 'store/reducers/user/slice';
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
export const usePayment = () => useAppSelector((state) => state.payment);
export const useDapp = () => useAppSelector((state) => state.dapp);
export const useLoading = () => {
  const { loadingInfo } = useAppSelector((state) => state.userInfo);
  const dispatch = useAppDispatch();
  const setLoading = useCallback(
    (isLoading: boolean | OpacityType, loadingText?: string, isEllipsis = true) =>
      dispatch(setGlobalLoading({ isLoading, loadingText, isEllipsis })),
    [dispatch],
  );
  return useMemo(() => ({ isLoading: !!loadingInfo.isLoading, setLoading }), [loadingInfo.isLoading, setLoading]);
};
