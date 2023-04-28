import { useCurrentWallet } from './wallet';
import { useMemo } from 'react';
import { NetworkList } from '@portkey-wallet/constants/constants-ca/network';
import { useAppCASelector } from '.';

export function useNetworkList() {
  return NetworkList;
}

export function useCurrentNetworkInfo() {
  const { currentNetwork } = useCurrentWallet();
  const networkList = useNetworkList();
  return useMemo(
    () => networkList.find(item => item.networkType === currentNetwork) || networkList[0],
    [currentNetwork, networkList],
  );
}

export function useCurrentApiUrl() {
  const currentNetwork = useCurrentNetworkInfo();
  return useMemo(() => currentNetwork.apiUrl, [currentNetwork.apiUrl]);
}

export function useVerifierList() {
  const { verifierMap } = useAppCASelector(state => state.guardians);
  return useMemo(() => (verifierMap ? Object.values(verifierMap) : []), [verifierMap]);
}

export function useIsTestnet() {
  const currentNetwork = useCurrentNetworkInfo();
  return useMemo(() => currentNetwork.networkType === 'TESTNET', [currentNetwork]);
}

export function useIsMainnet() {
  const currentNetwork = useCurrentNetworkInfo();
  return useMemo(() => currentNetwork.networkType === 'MAIN', [currentNetwork]);
}
