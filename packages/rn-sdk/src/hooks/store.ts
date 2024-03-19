import { useRnSDKSelector } from 'store';

export const useUser = () => useRnSDKSelector(state => state.user);

export const useCredentials = () => useRnSDKSelector(state => state.user.credentials);

export const useSettings = () => useRnSDKSelector(state => state.settings);

export const useGuardiansInfo = () => useRnSDKSelector(state => state.guardians);

export const usePin = () => useRnSDKSelector(state => state.user.credentials?.pin);

// export const useMisc = () => useRnSDKSelector(state => state.misc);
