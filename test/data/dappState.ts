import { IDappStoreState } from '@portkey-wallet/store/store-ca/dapp/type';

export const DappState: { dapp: IDappStoreState } = {
  dapp: {
    dappMap: {
      MAINNET: [
        {
          origin: 'href',
          name: 'browser1',
          icon: 'https://xxx/main',
        },
      ],
      TESTNET: [
        {
          origin: 'href',
          name: 'browser2',
          icon: 'https://xxx/test',
        },
      ],
    },
  },
};
