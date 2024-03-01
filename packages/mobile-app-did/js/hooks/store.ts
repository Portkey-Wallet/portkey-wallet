import { useAppSelector } from 'store/hooks';

export const useUser = () => useAppSelector(state => state.user);

export const useCredentials = () => useAppSelector(state => state.user.credentials);

export const useSettings = () => useAppSelector(state => state.settings);

export const useGuardiansInfo = () => useAppSelector(state => state.guardians);

export const usePin = () => useAppSelector(state => state.user.credentials?.pin);

export const useMisc = () => useAppSelector(state => state.misc);
