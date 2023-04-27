import { ChainType, NetworkType } from '@portkey-wallet/types';

/**
 * @for useGetChainInfo
 */
export const AELFChainInfo = {
  chainId: 'AELF',
  chainName: 'AELF',
  endPoint: 'http://192.168.66.61:8000',
  explorerUrl: 'http://192.168.66.61:8000',
  caContractAddress: '2nyC8hqq3pGnRu8gJzCsTaxXB6snfGxmL2viimKXgEfYWGtjEh',
  defaultToken: {
    name: 'AELF',
    address: 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
    imageUrl: 'https://portkey-did.s3.ap-northeast-1.amazonaws.com/img/aelf_token_logo.png',
    symbol: 'ELF',
    decimals: '8',
  },
  lastModifyTime: '2023-03-29T08:58:25.5132315Z',
  id: 'AELF',
};

/**
 * @for useCurrentWallet
 * @param currentNetwork
 * @returns
 */
export const currentWallet = (currentNetwork: NetworkType) => {
  return {
    walletInfo: {
      caHash: '0x9876543210abcdef',
      address: '2ZpT...3Udb',
      BIP44Path: "m/44'/1616'/0'/0/0",
      AESEncryptPrivateKey: 'U6Fs...OxA',
      AESEncryptMnemonic: 'U6Fs...zHss',
    },
    chainList: undefined,
    chainInfo: { MAIN: [{ chainId: 'AELF' } as any] },
    walletAvatar: 'master6',
    walletType: 'aelf' as ChainType,
    walletName: 'Wallet k',
    currentNetwork: currentNetwork,
  };
};
