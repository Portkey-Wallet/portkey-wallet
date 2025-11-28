import { MiscState as IMiscState } from '@portkey-wallet/store/store-ca/misc/types';

export const MiscState: { misc: IMiscState } = {
  misc: {
    phoneCountryCodeListChainMap: {
      MAINNET: [
        { country: 'China', code: '86', iso: 'CN' },
        { country: 'Denmark', code: '45', iso: 'DK' },
        { country: 'France', code: '33', iso: 'FR' },
        { country: 'Hong Kong', code: '852', iso: 'HK' },
        { country: 'Mexico', code: '52', iso: 'MX' },
        { country: 'Singapore', code: '65', iso: 'SG' },
        { country: 'United Kingdom', code: '44', iso: 'GB' },
        { country: 'United States', code: '1', iso: 'US' },
      ],
      TESTNET: [
        { country: 'China', code: '86', iso: 'CN' },
        { country: 'Denmark', code: '45', iso: 'DK' },
        { country: 'France', code: '33', iso: 'FR' },
        { country: 'Hong Kong', code: '852', iso: 'HK' },
        { country: 'Mexico', code: '52', iso: 'MX' },
        { country: 'Singapore', code: '65', iso: 'SG' },
        { country: 'United Kingdom', code: '44', iso: 'GB' },
        { country: 'United States', code: '1', iso: 'US' },
      ],
    },
    defaultPhoneCountryCode: { country: 'Singapore', code: '65', iso: 'SG' },
    localPhoneCountryCode: { country: 'United States', code: '1', iso: 'US' },
  },
};
