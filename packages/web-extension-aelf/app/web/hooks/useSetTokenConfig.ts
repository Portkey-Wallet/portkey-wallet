import { useRefreshTokenConfig } from '@portkey-wallet/hooks/hooks-ca/api';
import { useCallback } from 'react';
import { initDidReactSDKToken } from 'store/Provider/initConfig';
import { getPin } from 'utils/getSeed';

export const useSetTokenConfig = () => {
  const refreshToken = useRefreshTokenConfig();
  return useCallback(
    async (password?: string) => {
      const pin = await getPin();
      const token = await refreshToken(password ?? pin);
      initDidReactSDKToken(token);
    },
    [refreshToken],
  );
};
