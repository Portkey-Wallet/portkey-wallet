import { NetworkType, ChainType } from '@portkey-wallet/types';

export const TestnetNetworkInfo = {
  apiUrl: 'https://localhost',
  connectUrl: 'https://localhost',
  graphqlUrl: 'https://localhost/graphql',
  isActive: true,
  name: 'aelf Testnet',
  networkType: 'TESTNET' as NetworkType,
  walletType: 'aelf' as ChainType,
};

export const MainnetNetworkInfo = {
  apiUrl: 'https://localhost/main',
  connectUrl: 'https://localhost/main',
  graphqlUrl: 'https://localhost/graphql/main',
  isActive: true,
  name: 'aelf Mainnet',
  networkType: 'MAINNET' as NetworkType,
  walletType: 'aelf' as ChainType,
};
