import { ChainType, NetworkType } from '@portkey-wallet/types';

/**
 * @for useGetChainInfo
 */
export const AELFChainInfo = {
  chainId: 'AELF',
  chainName: 'AELF',
  endPoint: 'http://...:8000',
  explorerUrl: 'http://...:8000',
  caContractAddress: '2nyC...tjEh',
  defaultToken: {
    name: 'AELF',
    address: 'JRmB...oAaE',
    imageUrl: 'https://.../img/aelf_token_logo.png',
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
      caHash: '0x9...def',
      address: '2Zp...3Udb',
      BIP44Path: "m/44'/0/0",
      AESEncryptPrivateKey: 'U6F...OxA',
      AESEncryptMnemonic: 'U6F...zHss',
    },
    chainList: undefined,
    chainInfo: { MAINNET: [{ chainId: 'AELF' } as any] },
    walletAvatar: 'master6',
    walletType: 'aelf' as ChainType,
    walletName: 'Wallet k',
    currentNetwork: currentNetwork,
  };
};
