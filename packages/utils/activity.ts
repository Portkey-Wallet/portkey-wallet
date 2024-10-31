import { MAIN_CHAIN, MAIN_CHAIN_ID, SIDE_CHAIN, TEST_NET } from '@portkey-wallet/constants/constants-ca/activity';

export function transNetworkText(chainId: string, isTestnet: boolean, displayChainName?: string): string {
  if (displayChainName) {
    return `${displayChainName} ${isTestnet ? ' ' + TEST_NET : ''}`;
  }
  return `aelf ${chainId === MAIN_CHAIN_ID ? MAIN_CHAIN : SIDE_CHAIN} ${isTestnet ? ' ' + TEST_NET : ''}`;
}

export function transNetworkTextWithAllChain(
  chainId: string,
  isTestnet: boolean,
  chainName?: string,
  displayChainName?: string,
): string {
  if (chainName?.toLocaleLowerCase() === 'aelf') {
    // aelf chain
    return transNetworkText(chainId, isTestnet, displayChainName);
  }
  // other chain
  return chainName || '';
}

export function getCurrentActivityMapKey(chainId: string | undefined, symbol: string | undefined) {
  if (!chainId && !symbol) {
    return 'TOTAL';
  } else {
    return `${chainId}_${symbol}`;
  }
}
