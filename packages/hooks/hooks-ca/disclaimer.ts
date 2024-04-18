import { request } from '@portkey-wallet/api/api-did';
import { useCallback, useMemo } from 'react';
import { useCurrentWalletInfo, useWallet } from './wallet';
import { useAppCASelector, useAppCommonDispatch } from '../index';
import { addDisclaimerConfirmedDapp } from '@portkey-wallet/store/store-ca/discover/slice';
import { DEFAULT_OBJ } from '@portkey-wallet/constants';

export const useDiscover = () => useAppCASelector(state => state.discover || DEFAULT_OBJ);

export const useDisclaimer = () => {
  const { caHash, address } = useCurrentWalletInfo();
  const { currentNetwork } = useWallet();
  const { disclaimerConfirmedMap } = useDiscover();
  const dispatch = useAppCommonDispatch();

  const defaultParams = useMemo(
    () => ({
      policyVersion: '1',
      caHash,
      scene: 1001, // location
      managerAddress: address,
      policyId: '',
    }),
    [address, caHash],
  );

  const signPrivacyPolicy = useCallback(
    async (params: {
      policyVersion?: string;
      caHash?: string;
      origin: string;
      scene?: number;
      managerAddress?: string;
      policyId: string;
    }) => {
      if (!caHash) return;
      try {
        await request.privacy.privacyPolicy({
          params: {
            ...defaultParams,
            ...params,
          },
        });
        dispatch(
          addDisclaimerConfirmedDapp({
            networkType: currentNetwork,
            dappDomain: params?.origin || '',
          }),
        );
      } catch (error) {
        console.log('signPrivacyPolicy error', error);
      }
    },
    [caHash, currentNetwork, defaultParams, dispatch],
  );

  const checkDappIsConfirmed = useCallback(
    (dappDomain: string): boolean => !!disclaimerConfirmedMap?.[currentNetwork]?.includes?.(dappDomain),
    [currentNetwork, disclaimerConfirmedMap],
  );

  return { signPrivacyPolicy, checkDappIsConfirmed };
};
