import { TESTNET } from '@portkey-wallet/constants/constants-ca/activity';
import { useMemo } from 'react';
import { useWalletInfo } from 'store/Provider/hooks';

export function useIsTestnet(): boolean {
  const { currentNetwork } = useWalletInfo();
  return useMemo(() => currentNetwork === TESTNET, [currentNetwork]);
}
