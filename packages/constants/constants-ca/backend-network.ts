import { NetworkItem } from '@portkey-wallet/types/types-ca/network';

type BackEndNetworkType =
  | 'back-end-test1'
  | 'back-end-test2'
  | 'back-end-test1-ip'
  | 'back-end-test2-ip'
  | 'back-end-test3'
  | 'back-end-testnet'
  | 'back-end-mainnet';

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
    cmsUrl: 'http://192.168.66.62:8055/graphql',
    s3Url: 'https://portkey-cms-dev.s3.ap-northeast-1.amazonaws.com',
    portkeyFinanceUrl: 'https://portkey-website-dev.vercel.app/',
    imApiUrl: 'http://192.168.66.243:5007',
    imWsUrl: 'wss://testnet.relationlabs.ai/pk-sim/ws/',
    imS3Bucket: 'portkey-im-dev',
    eBridgeUrl: 'http://192.168.67.173:3000',
    eTransUrl: 'https://test.etrans.exchange',
  },
  'back-end-test2': {
    name: 'aelf Mainnet',
    walletType: 'aelf',
    networkType: 'MAIN',
    isActive: true,
    apiUrl: 'https://localtest-applesign2.portkey.finance',
    graphqlUrl: 'http://192.168.67.51:8083/AElfIndexer_DApp/PortKeyIndexerCASchema/graphql',
    connectUrl: 'http://192.168.67.51:8080',
    cmsUrl: 'http://192.168.66.62:8055/graphql',
    s3Url: 'https://portkey-cms-dev.s3.ap-northeast-1.amazonaws.com',
    portkeyFinanceUrl: 'https://portkey-website-dev.vercel.app/',
    imS3Bucket: 'portkey-im-dev',
    buyConfig: {
      ach: {
        appId: 'f83Is2y7L425rxl8',
        baseUrl: 'https://ramptest.alchemypay.org',
      },
    },
    eBridgeUrl: 'http://192.168.67.173:3000',
    eTransUrl: 'https://test.etrans.exchange',
  },
  'back-end-test1-ip': {
    name: 'aelf Testnet',
    walletType: 'aelf',
    networkType: 'TESTNET',
    isActive: true,
    apiUrl: 'http://192.168.66.240:5577',
    graphqlUrl: 'http://192.168.67.172:8083/AElfIndexer_DApp/PortKeyIndexerCASchema/graphql',
    connectUrl: 'http://192.168.66.240:8080',
    tokenClaimContractAddress: '2UM9eusxdRyCztbmMZadGXzwgwKfFdk8pF4ckw58D769ehaPSR',
    cmsUrl: 'http://192.168.66.62:8055/graphql',
    s3Url: 'https://portkey-cms-dev.s3.ap-northeast-1.amazonaws.com',
    portkeyFinanceUrl: 'https://portkey-website-dev.vercel.app/',
    imApiUrl: 'http://192.168.66.243:5007',
    imWsUrl: 'wss://testnet.relationlabs.ai/pk-sim/ws/',
    imS3Bucket: 'portkey-im-dev',
    eBridgeUrl: 'http://192.168.67.173:3000',
    eTransUrl: 'https://test.etrans.exchange',
  },
  'back-end-test2-ip': {
    name: 'aelf Mainnet',
    walletType: 'aelf',
    networkType: 'MAIN',
    isActive: true,
    apiUrl: 'http://192.168.67.51:5577',
    graphqlUrl: 'http://192.168.67.51:8083/AElfIndexer_DApp/PortKeyIndexerCASchema/graphql',
    connectUrl: 'http://192.168.67.51:8080',
    cmsUrl: 'http://192.168.66.62:8055/graphql',
    s3Url: 'https://portkey-cms-dev.s3.ap-northeast-1.amazonaws.com',
    portkeyFinanceUrl: 'https://portkey-website-dev.vercel.app/',
    imS3Bucket: 'portkey-im-dev',
    buyConfig: {
      ach: {
        appId: 'f83Is2y7L425rxl8',
        baseUrl: 'https://ramptest.alchemypay.org',
      },
    },
    eBridgeUrl: 'http://192.168.67.173:3000',
    eTransUrl: 'https://test.etrans.exchange',
  },
  'back-end-test3': {
    name: 'aelf Mainnet',
    walletType: 'aelf',
    networkType: 'MAIN',
    isActive: true,
    apiUrl: 'http://192.168.66.203:5001',
    graphqlUrl: 'http://192.168.66.203:8083/AElfIndexer_DApp/PortKeyIndexerCASchema/graphql',
    connectUrl: 'http://192.168.66.203:8001',
    cmsUrl: 'http://192.168.66.62:8055/graphql',
    s3Url: 'https://portkey-cms-dev.s3.ap-northeast-1.amazonaws.com',
    imS3Bucket: 'portkey-im-dev',
    portkeyFinanceUrl: 'https://portkey-website-dev.vercel.app/',
    buyConfig: {
      ach: {
        appId: 'f83Is2y7L425rxl8',
        baseUrl: 'https://ramptest.alchemypay.org',
      },
    },
    eBridgeUrl: 'http://192.168.67.173:3000',
    eTransUrl: 'https://test.etrans.exchange',
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
    cmsUrl: 'https://cms-test.portkey.finance/graphql',
    s3Url: 'https://portkey-cms-testnet.s3.ap-northeast-1.amazonaws.com',
    imS3Bucket: 'portkey-im-testnet',
    portkeyFinanceUrl: 'https://test.portkey.finance',
    eBridgeUrl: 'https://test.ebridge.exchange',
    eTransUrl: 'https://test.etrans.exchange',
  },
  'back-end-mainnet': {
    name: 'aelf Mainnet',
    walletType: 'aelf',
    networkType: 'MAIN',
    isActive: true,
    apiUrl: 'https://did-portkey.portkey.finance',
    graphqlUrl: 'https://dapp-portkey.portkey.finance/Portkey_DID/PortKeyIndexerCASchema/graphql',
    connectUrl: 'https://auth-portkey.portkey.finance',
    cmsUrl: 'https://cms.portkey.finance/graphql',
    s3Url: 'https://portkey-cms-mainnet.s3.ap-northeast-1.amazonaws.com',
    portkeyFinanceUrl: 'https://portkey.finance',
    buyConfig: {
      ach: {
        appId: 'P0e0l39jipsNYT46',
        baseUrl: 'https://ramp.alchemypay.org',
      },
    },
    imApiUrl: 'https://im.portkey.finance',
    imWsUrl: 'wss://diok8uqxgvc3.cloudfront.net/ws/',
    imS3Bucket: 'portkey-im',
    eBridgeUrl: 'https://ebridge.exchange',
    eTransUrl: 'https://etrans.exchange',
  },
};
