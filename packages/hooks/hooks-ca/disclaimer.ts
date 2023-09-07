import { request } from '@portkey-wallet/api/api-did';
import { useCallback, useMemo } from 'react';
import { useCurrentWalletInfo, useWallet } from './wallet';
import { useAppDispatch } from 'store/hooks';
import { useAppCASelector } from './index';
import { addDisclaimerConfirmedDapp } from '@portkey-wallet/store/store-ca/discover/slice';
import { useCurrentNetworkInfo } from './network';

export const useDiscover = () => useAppCASelector(state => state.discover);

export const useDisclaimer = () => {
  const { caHash, address } = useCurrentWalletInfo();
  const { currentNetwork } = useWallet();
  const dispatch = useAppDispatch();
  const { eBridgeUrl } = useCurrentNetworkInfo();
  const { disclaimerConfirmedMap: confirmedMap } = useDiscover();

  const defaultParams = useMemo(
    () => ({
      policyVersion: '1',
      caHash,
      origin: eBridgeUrl,
      scene: 1001, // location
      managerAddress: address,
      policyId: '',
    }),
    [address, caHash, eBridgeUrl],
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
