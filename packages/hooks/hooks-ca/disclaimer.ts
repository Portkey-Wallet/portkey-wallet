import { request } from '@portkey-wallet/api/api-did';
import { useCallback, useMemo } from 'react';
import { useCurrentWalletInfo, useWallet } from './wallet';
import { useAppCASelector, useAppCommonDispatch } from '..';
import { addDisclaimerConfirmedDapp } from '@portkey-wallet/store/store-ca/discover/slice';

export const useDisclaimer = () => {
  const { caHash, address } = useCurrentWalletInfo();
  const { currentNetwork } = useWallet();
  const dispatch = useAppCommonDispatch();

  const { disclaimerConfirmedMap: confirmedMap } = useAppCASelector(state => state.discover);

  const defaultParams = useMemo(
    () => ({
      policyVersion: '1',
      caHash,
      // TODO: change url
      origin: 'https://www.ebridge.exchange',
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
        console.log(error);
      }
    },
    [caHash, currentNetwork, defaultParams, dispatch],
  );

  const checkDappIsConfirmed = useCallback(
    (dappDomain: string): boolean => {
      if (!confirmedMap?.[currentNetwork]) return false;
      if (confirmedMap[currentNetwork]?.has(dappDomain)) return true;
      return false;
    },
    [currentNetwork, confirmedMap],
  );

  return { signPrivacyPolicy, checkDappIsConfirmed };
};
