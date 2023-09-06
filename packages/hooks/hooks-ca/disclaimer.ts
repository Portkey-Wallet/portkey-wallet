import { request } from '@portkey-wallet/api/api-did';
import { useCallback, useMemo } from 'react';
import { useCurrentWalletInfo } from './wallet';

export const useDisclaimer = () => {
  const { caHash, address } = useCurrentWalletInfo();

  const defaultParams = useMemo(
    () => ({
      policyVersion: '1',
      caHash,
      // TODO: change url
      origin: 'https://www.ebridge.exchange',
      scene: 1001,
      managerAddress: address,
      policyId: '',
    }),
    [address, caHash],
  );

  const signPrivacyPolicy = useCallback(
    (params?: {
      policyVersion?: String;
      caHash?: String;
      origin?: String;
      scene?: number;
      managerAddress?: string;
      policyId: string;
    }) => {
      if (!caHash) return;

      return request.privacy.privacyPolicy({
        params: {
          ...defaultParams,
          ...params,
        },
      });
    },
    [caHash, defaultParams],
  );

  return signPrivacyPolicy;
};
