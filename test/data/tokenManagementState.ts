import { TokenState } from '@portkey-wallet/types/types-ca/token';

export const TokenManagementState: { tokenManagement: TokenState } = {
  tokenManagement: {
    tokenDataShowInMarket: [
      {
        address: 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
        chainId: 'AELF',
        decimals: 8,
        id: '439a0f0f-c411-4227-bc96-ad802a1a1ac5',
        isAdded: true,
        isDefault: true,
        name: 'ELF',
        symbol: 'ELF',
        tokenName: 'ELF',
      },
      {
        address: '7RzVGiuVWkvL4VfVHdZfQF2Tri3sgLe9U991bohHFfSRZXuGX',
        chainId: 'tDVV',
        decimals: 8,
        id: 'e5f20635-9c71-4480-bb7d-0891507ef1b1',
        isAdded: true,
        isDefault: true,
        name: 'ELF',
        symbol: 'ELF',
        tokenName: 'ELF',
      },
      {
        address: '7RzVGiuVWkvL4VfVHdZfQF2Tri3sgLe9U991bohHFfSRZXuGX',
        chainId: 'tDVV',
        decimals: 8,
        id: 'e701d725-8ba6-4283-8968-f31289c54bf1',
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
    symbolImages: { ELF: 'https://portkey-did.s3.ap-northeast-1.amazonaws.com/img/aelf/Mainchain_aelf.png' },
  },
};
