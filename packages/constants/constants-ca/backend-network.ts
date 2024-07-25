import { NetworkItem } from '@portkey-wallet/types/types-ca/network';

type BackEndNetworkType =
  | 'back-end-test1'
  | 'back-end-test2'
  | 'back-end-test1-ip'
  | 'back-end-test2-ip'
  | 'back-end-test3'
  | 'back-end-test3-v2'
  | 'back-end-test4'
  | 'back-end-test4-v2'
  | 'back-end-testnet-v2'
  | 'back-end-testnet'
  | 'back-end-mainnet-v2'
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
    portkeyOpenLoginUrl: 'https://openlogin-test.portkey.finance/',
    imApiUrl: 'http://192.168.66.243:5007',
    imWsUrl: 'wss://testnet.relationlabs.ai/pk-sim/ws/',
    imS3Bucket: 'portkey-im-dev',
    eBridgeUrl: 'http://192.168.67.173:3000',
  },
  'back-end-test2': {
    name: 'aelf Mainnet',
    walletType: 'aelf',
    networkType: 'MAINNET',
    isActive: true,
    apiUrl: 'https://localtest-applesign2.portkey.finance',
    graphqlUrl: 'http://192.168.67.51:8083/AElfIndexer_DApp/PortKeyIndexerCASchema/graphql',
    connectUrl: 'http://192.168.67.51:8080',
    cmsUrl: 'http://192.168.66.62:8055/graphql',
    s3Url: 'https://portkey-cms-dev.s3.ap-northeast-1.amazonaws.com',
    portkeyFinanceUrl: 'https://portkey-website-dev.vercel.app/',
    portkeyOpenLoginUrl: 'https://openlogin-test.portkey.finance/',
    imS3Bucket: 'portkey-im-dev',
    eBridgeUrl: 'http://192.168.67.173:3000',
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
    portkeyOpenLoginUrl: 'https://openlogin-test.portkey.finance/',
    imApiUrl: 'http://192.168.66.243:5007',
    imWsUrl: 'wss://testnet.relationlabs.ai/pk-sim/ws/',
    imS3Bucket: 'portkey-im-dev',
    eBridgeUrl: 'http://192.168.67.173:3000',
  },
  'back-end-test2-ip': {
    name: 'aelf Mainnet',
    walletType: 'aelf',
    networkType: 'MAINNET',
    isActive: true,
    apiUrl: 'http://192.168.67.51:5577',
    graphqlUrl: 'http://192.168.67.51:8083/AElfIndexer_DApp/PortKeyIndexerCASchema/graphql',
    connectUrl: 'http://192.168.67.51:8080',
    cmsUrl: 'http://192.168.66.62:8055/graphql',
    s3Url: 'https://portkey-cms-dev.s3.ap-northeast-1.amazonaws.com',
    portkeyFinanceUrl: 'https://portkey-website-dev.vercel.app/',
    portkeyOpenLoginUrl: 'https://openlogin-test.portkey.finance/',
    imS3Bucket: 'portkey-im-dev',
    eBridgeUrl: 'http://192.168.67.173:3000',
  },
  'back-end-test3': {
    name: 'aelf Mainnet',
    walletType: 'aelf',
    networkType: 'MAINNET',
    isActive: true,
    apiUrl: 'http://192.168.66.203:5001',
    graphqlUrl: 'http://192.168.66.203:8083/AElfIndexer_DApp/PortKeyIndexerCASchema/graphql',
    connectUrl: 'http://192.168.66.203:8001',
    cmsUrl: 'http://192.168.66.62:8055/graphql',
    s3Url: 'https://portkey-cms-dev.s3.ap-northeast-1.amazonaws.com',
    imS3Bucket: 'portkey-im-dev',
    portkeyFinanceUrl: 'https://portkey-website-dev.vercel.app/',
    eBridgeUrl: 'http://192.168.67.235:3000',
    portkeyOpenLoginUrl: 'https://openlogin-test.portkey.finance/',
    buyConfig: {
      ach: {
        appId: 'f83Is2y7L425rxl8',
        baseUrl: 'https://ramptest.alchemypay.org',
      },
    },
  },
  'back-end-test3-v2': {
    name: 'aelf Testnet',
    walletType: 'aelf',
    networkType: 'TESTNET',
    isActive: true,
    apiUrl: 'http://192.168.67.127:5001',
    domain: 'https://test3-applesign-v2.portkey.finance',
    graphqlUrl: 'http://192.168.67.99:8083/AElfIndexer_DApp/PortKeyIndexerCASchema/graphql',
    connectUrl: 'http://192.168.67.127:8080',
    cmsUrl: 'http://192.168.66.62:3005/graphql',
    s3Url: 'https://portkey-cms-dev.s3.ap-northeast-1.amazonaws.com',
    imS3Bucket: 'portkey-im-dev',
    referralUrl: 'http://192.168.67.51:3100',
    portkeyFinanceUrl: 'https://portkey-website-dev.vercel.app/',
    portkeyOpenLoginUrl: 'https://openlogin-test.portkey.finance/',
  },
  'back-end-test4': {
    name: 'aelf Mainnet',
    walletType: 'aelf',
    networkType: 'MAINNET',
    isActive: true,
    apiUrl: 'http://192.168.67.179:5001',
    graphqlUrl: 'http://192.168.67.67:8083/AElfIndexer_DApp/PortKeyIndexerCASchema/graphql',
    connectUrl: 'http://192.168.67.179:8001',
    cmsUrl: 'http://192.168.66.62:8055/graphql',
    s3Url: 'https://portkey-cms-dev.s3.ap-northeast-1.amazonaws.com',
    imS3Bucket: 'portkey-im-dev',
    portkeyFinanceUrl: 'https://portkey-website-dev.vercel.app/',
    portkeyOpenLoginUrl: 'https://openlogin-test.portkey.finance/',
    buyConfig: {
      ach: {
        appId: 'f83Is2y7L425rxl8',
        baseUrl: 'https://ramptest.alchemypay.org',
      },
    },
    eBridgeUrl: 'http://192.168.67.235:3000',
  },
  'back-end-test4-v2': {
    name: 'aelf Mainnet',
    walletType: 'aelf',
    networkType: 'MAINNET',
    isActive: true,
    apiUrl: 'http://192.168.66.117:5577',
    domain: 'https://test4-applesign-v2.portkey.finance',
    graphqlUrl: 'http://192.168.67.214:8083/AElfIndexer_DApp/PortKeyIndexerCASchema/graphql',
    connectUrl: 'http://192.168.66.117:8080',
    cmsUrl: 'http://192.168.66.62:3005/graphql',
    s3Url: 'https://portkey-cms-dev.s3.ap-northeast-1.amazonaws.com',
    imApiUrl: 'http://192.168.66.117:5007',
    imWsUrl: 'ws://192.168.66.117:19903/ws',
    imS3Bucket: 'portkey-im-dev',
    referralUrl: 'http://192.168.67.51:3100',
    portkeyFinanceUrl: 'https://portkey-website-dev.vercel.app/',
    eBridgeUrl: 'http://192.168.67.235:3000',
    portkeyOpenLoginUrl: 'https://openlogin-test.portkey.finance/',
  },
  'back-end-testnet-v2': {
    name: 'aelf Testnet',
    walletType: 'aelf',
    networkType: 'TESTNET',
    isActive: true,
    apiUrl: 'https://aa-portkey-test.portkey.finance',
    graphqlUrl: 'https://dapp-aa-portkey-test.portkey.finance/Portkey_V2_DID/PortKeyIndexerCASchema/graphql',
    connectUrl: 'https://auth-aa-portkey-test.portkey.finance',
    tokenClaimContractAddress: '233wFn5JbyD4i8R5Me4cW4z6edfFGRn5bpWnGuY8fjR7b2kRsD',
    cmsUrl: 'https://cms-test-aa.portkey.finance/graphql',
    s3Url: 'https://portkey-cms-testnet.s3.ap-northeast-1.amazonaws.com',
    imS3Bucket: 'portkey-im-testnet',
    imApiUrl: 'https://im-api-test.portkey.finance',
    imWsUrl: 'wss://im-api-test.portkey.finance/message/ws/',
    referralUrl: 'https://test-referral.portkey.finance',
    cryptoGiftUrl: 'https://test-cryptogift.portkey.finance',
    portkeyFinanceUrl: 'https://portkey.finance/',
    portkeyOpenLoginUrl: 'https://openlogin.portkey.finance/',
    eBridgeUrl: 'https://test.ebridge.exchange',
    eTransferCA: {
      AELF: '4xWFvoLvi5anZERDuJvzfMoZsb6WZLATEzqzCVe8sQnCp2XGS',
      tDVW: '2AgU8BfyKyrxUrmskVCUukw63Wk96MVfVoJzDDbwKszafioCN1',
    },
    eTransferUrl: 'https://test-app.etransfer.exchange',
    awakenUrl: 'https://test-app.awaken.finance',
    schrodingerUrl: 'https://schrodingerai.com',
    eForestUrl: 'https://test.eforest.finance',
    sgrSchrodingerUrl: 'https://cat.schrodingerai.com',
    tomorrowDAOUrl: 'https://test.tmrwdao.com',
    hamsterUrl: 'https://test-hamster.beangotown.com',
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
    imApiUrl: 'https://im-api-test.portkey.finance',
    imWsUrl: 'wss://im-api-test.portkey.finance/message/ws/',
    portkeyFinanceUrl: 'https://test.portkey.finance',
    portkeyOpenLoginUrl: 'https://openlogin.portkey.finance/',
    eBridgeUrl: 'https://test.ebridge.exchange',
    eTransferUrl: 'https://test-app.etransfer.exchange',
    eTransferCA: {
      AELF: '4xWFvoLvi5anZERDuJvzfMoZsb6WZLATEzqzCVe8sQnCp2XGS',
      tDVW: '2AgU8BfyKyrxUrmskVCUukw63Wk96MVfVoJzDDbwKszafioCN1',
    },
    awakenUrl: 'https://test-app.awaken.finance',
    schrodingerUrl: 'https://schrodingerai.com',
    sgrSchrodingerUrl: 'https://cat.schrodingerai.com',
    tomorrowDAOUrl: 'https://test.tmrwdao.com',
    hamsterUrl: 'https://test-hamster.beangotown.com',
  },
  'back-end-mainnet': {
    name: 'aelf Mainnet',
    walletType: 'aelf',
    networkType: 'MAINNET',
    isActive: true,
    apiUrl: 'https://did-portkey.portkey.finance',
    graphqlUrl: 'https://dapp-portkey.portkey.finance/Portkey_DID/PortKeyIndexerCASchema/graphql',
    connectUrl: 'https://auth-portkey.portkey.finance',
    cmsUrl: 'https://cms.portkey.finance/graphql',
    s3Url: 'https://portkey-cms-mainnet.s3.ap-northeast-1.amazonaws.com',
    portkeyFinanceUrl: 'https://portkey.finance',
    portkeyOpenLoginUrl: 'https://openlogin.portkey.finance/',
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
    eTransferCA: {
      AELF: '2w13DqbuuiadvaSY2ZyKi2UoXg354zfHLM3kwRKKy85cViw4ZF',
      tDVV: 'x4CTSuM8typUbpdfxRZDTqYVa42RdxrwwPkXX7WUJHeRmzE6k',
    },
    eTransferUrl: 'https://app.etransfer.exchange',
    awakenUrl: 'https://app.awaken.finance',
    schrodingerUrl: 'https://schrodingernft.ai/',
    sgrSchrodingerUrl: 'https://cat.schrodingernft.ai/',
    tomorrowDAOUrl: 'https://tmrwdao.com',
    hamsterUrl: 'https://hamster.beangotown.com',
  },
  'back-end-mainnet-v2': {
    name: 'aelf Mainnet',
    walletType: 'aelf',
    networkType: 'MAINNET',
    isActive: true,
    apiUrl: 'https://aa-portkey.portkey.finance',
    graphqlUrl: 'https://dapp-aa-portkey.portkey.finance/Portkey_V2_DID/PortKeyIndexerCASchema/graphql',
    connectUrl: 'https://auth-aa-portkey.portkey.finance',
    cmsUrl: 'https://cms-aa.portkey.finance/graphql',
    s3Url: 'https://portkey-cms-mainnet.s3.ap-northeast-1.amazonaws.com',
    referralUrl: 'https://referral.portkey.finance',
    cryptoGiftUrl: 'https://cryptogift.portkey.finance',
    portkeyFinanceUrl: 'https://portkey.finance',
    portkeyOpenLoginUrl: 'https://openlogin.portkey.finance/',
    buyConfig: {
      ach: {
        appId: 'P0e0l39jipsNYT46',
        baseUrl: 'https://ramp.alchemypay.org',
      },
    },
    imApiUrl: 'https://im-api.portkey.finance',
    imWsUrl: 'wss://im-socket.portkey.finance/ws/',
    imS3Bucket: 'portkey-im',
    eBridgeUrl: 'https://ebridge.exchange',
    eTransferUrl: 'https://app.etransfer.exchange',
    eTransferCA: {
      AELF: '2w13DqbuuiadvaSY2ZyKi2UoXg354zfHLM3kwRKKy85cViw4ZF',
      tDVV: 'x4CTSuM8typUbpdfxRZDTqYVa42RdxrwwPkXX7WUJHeRmzE6k',
    },
    awakenUrl: 'https://app.awaken.finance',
    schrodingerUrl: 'https://schrodingernft.ai',
    eForestUrl: 'https://www.eforest.finance',
    sgrSchrodingerUrl: 'https://cat.schrodingernft.ai',
    tomorrowDAOUrl: 'https://tmrwdao.com',
    hamsterUrl: 'https://hamster.beangotown.com',
  },
};
