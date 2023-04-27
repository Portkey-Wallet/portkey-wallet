import { NetworkType, ChainType } from '@portkey-wallet/types';

export const NetworkInfo = {
  apiUrl: 'https://did-portkey-test.portkey.finance',
  connectUrl: 'https://auth-portkey-test.portkey.finance',
  graphqlUrl: 'https://dapp-portkey-test.portkey.finance/Portkey_DID/PortKeyIndexerCASchema/graphql',
  isActive: true,
  name: 'aelf Testnet',
  networkType: 'TESTNET' as NetworkType,
  walletType: 'aelf' as ChainType,
};
