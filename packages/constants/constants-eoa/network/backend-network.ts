import { NetworkItem } from '@portkey-wallet/types/types-eoa/network';

type BackEndNetworkType = 'back-end-testnet' | 'back-end-mainnet';

// TODO: eoa update networkConfig
export const BackEndNetWorkMap: {
  [key in BackEndNetworkType]: NetworkItem;
} = {
  'back-end-testnet': {
    name: 'aelf Testnet',
    walletType: 'aelf',
    networkType: 'TESTNET',
    isActive: true,
    apiUrl: 'https://eoa-portkey-test.portkey.finance',
    graphqlUrl: 'https://dapp-aa-portkey-test.portkey.finance/aefinder-v2/api/app/graphql/portkey',
    tokenClaimContractAddress: '233wFn5JbyD4i8R5Me4cW4z6edfFGRn5bpWnGuY8fjR7b2kRsD',
    cmsUrl: 'https://cms-test-aa.portkey.finance/graphql',
    s3Url: 'https://portkey-cms-testnet.s3.ap-northeast-1.amazonaws.com',
    referralUrl: 'https://test-referral.portkey.finance',
    cryptoGiftUrl: 'https://test-cryptogift.portkey.finance',
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
    cryptoGiftTgUrl: 'https://t.me/PortkeyTestnet_Bot/crypto_gift',
  },

  'back-end-mainnet': {
    name: 'aelf Mainnet',
    walletType: 'aelf',
    networkType: 'MAINNET',
    isActive: true,
    apiUrl: 'https://aa-portkey.portkey.finance',
    graphqlUrl: 'https://dapp-aa-portkey.portkey.finance/aefinder-v2/api/app/graphql/portkey',
    cmsUrl: 'https://cms-aa.portkey.finance/graphql',
    s3Url: 'https://portkey-cms-mainnet.s3.ap-northeast-1.amazonaws.com',
    referralUrl: 'https://referral.portkey.finance',
    cryptoGiftUrl: 'https://cryptogift.portkey.finance',
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
    cryptoGiftTgUrl: 'https://t.me/PortkeyMainnet_Bot/crypto_gift',
  },
};
