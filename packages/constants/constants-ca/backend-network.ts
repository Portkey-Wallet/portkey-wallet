import { NetworkItem } from '@portkey-wallet/types/types-ca/network';

type BackEndNetworkType = 'back-end-test1' | 'back-end-test2' | 'back-end-testnet' | 'back-end-mainnet';

export const BackEndNetWorkMap: {
  [key in BackEndNetworkType]: NetworkItem;
} = {
  'back-end-test1': {
    name: 'aelf Testnet',
    walletType: 'aelf',
    networkType: 'TESTNET',
    isActive: true,
    apiUrl: 'https://localtest-applesign.portkey.finance',
    graphqlUrl: 'http://192.168.67.172:8083/AElfIndexer_DApp/PortKeyIndexerCASchema/graphql',
    connectUrl: 'http://192.168.66.240:8080',
    tokenClaimContractAddress: '2UM9eusxdRyCztbmMZadGXzwgwKfFdk8pF4ckw58D769ehaPSR',
  },
  'back-end-test2': {
    name: 'aelf Mainnet',
    walletType: 'aelf',
    networkType: 'MAIN',
    isActive: true,
    apiUrl: 'https://localtest-applesign2.portkey.finance',
    graphqlUrl: 'http://192.168.67.51:8083/AElfIndexer_DApp/PortKeyIndexerCASchema/graphql',
    connectUrl: 'http://192.168.67.51:8080',
  },
  'back-end-testnet': {
    name: 'aelf Testnet',
    walletType: 'aelf',
    networkType: 'TESTNET',
    isActive: true,
    apiUrl: 'https://did-portkey-test.portkey.finance',
    graphqlUrl: 'https://dapp-portkey-test.portkey.finance/Portkey_DID/PortKeyIndexerCASchema/graphql',
    connectUrl: 'https://auth-portkey-test.portkey.finance',
    tokenClaimContractAddress: '233wFn5JbyD4i8R5Me4cW4z6edfFGRn5bpWnGuY8fjR7b2kRsD',
  },
  'back-end-mainnet': {
    name: 'aelf Mainnet',
    walletType: 'aelf',
    networkType: 'MAIN',
    isActive: true,
    apiUrl: 'https://did-portkey.portkey.finance',
    graphqlUrl: 'https://dapp-portkey.portkey.finance/Portkey_DID/PortKeyIndexerCASchema/graphql',
    connectUrl: 'https://auth-portkey.portkey.finance',
  },
};
