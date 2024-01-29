import { useCurrentWallet } from './wallet';
import { useMemo } from 'react';
import { NetworkList } from '@portkey-wallet/constants/constants-ca/network';
import { useAppCASelector } from '.';

export function useNetworkList() {
  return NetworkList;
}

export function useCurrentNetwork() {
  const { currentNetwork } = useCurrentWallet();
  return useMemo(() => currentNetwork, [currentNetwork]);
}

export function useCurrentNetworkInfo() {
  const currentNetwork = useCurrentNetwork();
  const networkList = useNetworkList();
  return useMemo(
    () => networkList.find(item => item.networkType === currentNetwork) || networkList[0],
    [currentNetwork, networkList],
  );
}

export function useCurrentApiUrl() {
  const currentNetworkInfo = useCurrentNetworkInfo();
  return useMemo(() => currentNetworkInfo.apiUrl, [currentNetworkInfo.apiUrl]);
}

export function useVerifierList() {
  const { verifierMap } = useAppCASelector(state => state.guardians);
  return useMemo(() => (verifierMap ? Object.values(verifierMap) : []), [verifierMap]);
}

export function useIsMainnet() {
  const currentNetwork = useCurrentNetwork();
  return useMemo(() => currentNetwork === 'MAINNET', [currentNetwork]);
}

export function useIsIMServiceExist() {
  const { imApiUrl, imWsUrl, imS3Bucket } = useCurrentNetworkInfo();
  return useMemo(() => !!imApiUrl && !!imWsUrl && !!imS3Bucket, [imApiUrl, imWsUrl, imS3Bucket]);
}
