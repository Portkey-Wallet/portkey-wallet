import { RampType } from '@portkey-wallet/ramp';

export const MAX_UPDATE_TIME = 15;
export const initCryptoAmount = '400';

export const initPreviewData = {
  crypto: 'ELF',
  network: 'AELF-AELF',
  fiat: 'USD',
  country: 'US',
  amount: initCryptoAmount,
  side: RampType.BUY,
};
