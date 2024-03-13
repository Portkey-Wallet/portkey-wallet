import { NetworkItem } from 'packages/types/types-ca/network';

export const NetworkList: NetworkItem[] = [
  {
    name: 'aelf Mainnet',
    walletType: 'aelf',
    networkType: 'MAINNET',
    apiUrl: '',
    graphqlUrl: '',
    connectUrl: '',
  },
  {
    name: 'aelf Testnet',
    walletType: 'aelf',
    networkType: 'TESTNET',
    isActive: true,
    apiUrl: 'http://192.168.67.51:5577',
    graphqlUrl: 'http://192.168.67.51:8083/AElfIndexer_DApp/PortKeyIndexerCASchema/graphql',
    connectUrl: 'http://192.168.67.51:8080',
  },
];

export const DefaultChainId = 'AELF';

export const OfficialWebsite = 'https://portkey.finance';

export const ThirdParty = `https://openlogin-test.portkey.finance`;
