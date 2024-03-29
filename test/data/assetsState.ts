import { AssetsStateType } from '@portkey-wallet/store/store-ca/assets/slice';

export const AssetsState: { assets: AssetsStateType } = {
  assets: {
    accountToken: {
      isFetching: true,
      skipCount: 8,
      maxResultCount: 10,
      accountTokenList: [
        {
          address: '',
          name: '',
          chainId: 'AELF',
          symbol: 'ELF',
          price: 0.29558,
          balance: '34858795000',
          decimals: 8,
          balanceInUsd: '103.035626261',
          tokenContractAddress: 'JRm...oAaE',
          imageUrl: 'https://localhost/aelf/Mainchain_aelf.png',
        },
        {
          address: '',
          name: '',
          chainId: 'tDVV',
          symbol: 'ELF',
          price: 0.29558,
          balance: '2895000000',
          decimals: 8,
          balanceInUsd: '8.557041',
          tokenContractAddress: '7Rz...XuGX',
          imageUrl: 'https://localhost/aelf/Mainchain_aelf.png',
        },
        {
          address: '',
          name: '',
          chainId: 'tDVV',
          symbol: 'CPU',
          price: 0,
          balance: '0',
          decimals: 8,
          balanceInUsd: '0',
          tokenContractAddress: '7Rz...XuGX',
        },
      ],
      totalRecordCount: 3,
    },
    accountNFT: { isFetching: false, skipCount: 0, maxResultCount: 10, accountNFTList: [], totalRecordCount: 0 },
    accountAssets: {
      isFetching: false,
      skipCount: 31,
      maxResultCount: 1000,
      accountAssetsList: [
        {
          chainId: 'AELF',
          symbol: 'ELF',
          address: '2A6...xHzh',
          tokenInfo: {
            id: '01',
            balance: '34858795000',
            decimals: '8',
            balanceInUsd: '103.1757586169',
            tokenContractAddress: 'JRm...oAaE',
          },
        },
        {
          chainId: 'tDVV',
          symbol: 'ELF',
          address: '27g...UfVX',
          tokenInfo: {
            id: '02',
            balance: '2895000000',
            decimals: '8',
            balanceInUsd: '8.5686789',
            tokenContractAddress: '7Rz...XuGX',
          },
        },
        {
          chainId: 'AELF',
          symbol: 'NIUNIU-01',
          address: '2A6...xHzh',
          // nftInfo: {
          //   imageUrl: 'https://localhost/Untitled/144xAUTO/3.jpg',
          //   alias: 'NIUNIU-01',
          //   tokenId: '01',
          //   balance: '10',
          //   tokenContractAddress: 'JRm...oAaE',
          // },
        },
      ],
      totalRecordCount: 3,
    },
    tokenPrices: { isFetching: false, tokenPriceObject: { ELF: 0.294964 } },
    accountBalance: '111.59',
  },
};
