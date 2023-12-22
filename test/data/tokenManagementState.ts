import { TokenState } from '@portkey-wallet/types/types-ca/token';

export const TokenManagementState: { tokenManagement: TokenState } = {
  tokenManagement: {
    tokenDataShowInMarket: [
      {
        address: 'JRm...oAaE',
        chainId: 'AELF',
        decimals: 8,
        id: '439...1ac5',
        isAdded: true,
        isDefault: true,
        name: 'ELF',
        symbol: 'ELF',
        tokenName: 'ELF',
      },
      {
        address: '7Rz...XuGX',
        chainId: 'tDVV',
        decimals: 8,
        id: 'e5f...f1b1',
        isAdded: true,
        isDefault: true,
        name: 'ELF',
        symbol: 'ELF',
        tokenName: 'ELF',
      },
      {
        address: '7Rz...XuGX',
        chainId: 'tDVV',
        decimals: 8,
        id: 'e70...4bf1',
        isAdded: false,
        isDefault: false,
        name: 'READ',
        symbol: 'READ',
        tokenName: 'READ',
      },
    ],
    isFetching: false,
    maxResultCount: 1000,
    skipCount: 0,
    totalRecordCount: 0,
    symbolImages: { ELF: 'https://localhost/aelf/Mainchain_aelf.png' },
  },
};
