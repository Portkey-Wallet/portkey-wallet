import { NetworkType } from '@portkey-wallet/types';

export const NETWORK_CONFIG: {
  [key in NetworkType]: {
    name: string;
    nameEn: string;
    url: string;
  };
} = {
  MAIN: {
    name: 'Mainnet',
    nameEn: 'MAIN',
    url: 'https://app-wallet-api.aelf.io',
  },
  TESTNET: {
    name: 'Testnet',
    nameEn: 'TESTNET',
    url: 'https://wallet-app-api-test.aelf.io',
  },
} as const;
