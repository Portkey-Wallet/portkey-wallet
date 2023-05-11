import { MAIN_CHAIN, MAIN_CHAIN_ID, SIDE_CHAIN, TEST_NET } from '@portkey-wallet/constants/constants-ca/activity';

export function transNetworkText(chainId: string, isTestnet: boolean): string {
  return `${chainId === MAIN_CHAIN_ID ? MAIN_CHAIN : SIDE_CHAIN} ${chainId}${isTestnet ? ' ' + TEST_NET : ''}`;
}

export function getCurrentActivityMapKey(chainId: string | undefined, symbol: string | undefined) {
  if (!chainId && !symbol) {
    return 'TOTAL';
  } else {
    return `${chainId}_${symbol}`;
  }
}
