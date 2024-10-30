// import {ENV_PROJECT_ID} from '@env';
import { IProviderMetadata } from '@walletconnect/modal-react-native';

// const providerMetadata: IProviderMetadata = {
//   name: 'Modal with Ethers',
//   description: 'RN example using Ethers 5 by Reown',
//   url: 'https://reown.com/appkit',
//   icons: ['https://avatars.githubusercontent.com/u/179229932'],
//   redirect: {
//     native: 'wcmetherssample://',
//   },
// };

const providerMetadata: IProviderMetadata = {
  name: 'Portkey Wallet',
  description: 'Your first AA wallet for Web2 to Web3 migration',
  url: 'https://portkey.finance/',
  icons: [
    'https://play-lh.googleusercontent.com/YYFh-iAZmZdx9incotkWK9BbnPNIftZk9aHKm3qlWlsmU0nofS-lge0i9-Gy0Oj_ohM=w480-h960-rw',
  ],
  redirect: {
    native: 'com.portkey.finance://',
    universal: 'https://portkey.finance/',
  },
};

const sessionParams = {
  namespaces: {
    eip155: {
      methods: ['eth_sendTransaction', 'personal_sign'],
      chains: ['eip155:1'],
      events: ['chainChanged', 'accountsChanged'],
      rpcMap: {},
    },
  },
};

export default {
  providerMetadata,
  sessionParams,
};
