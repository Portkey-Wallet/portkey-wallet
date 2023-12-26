import { createAction } from '@reduxjs/toolkit';
import { IRampCryptoDefault, IRampCryptoItem, IRampFiatDefault, IRampFiatItem } from '@portkey-wallet/ramp';

export const setRampEntry = createAction<{
  isRampShow: boolean;
  isBuySectionShow: boolean;
  isSellSectionShow: boolean;
}>('ramp/setRampEntry');

export const setBuyFiatList = createAction<{
  list: IRampFiatItem[];
}>('ramp/setBuyFiatList');

export const setBuyDefaultFiat = createAction<{
  value: IRampFiatDefault;
}>('ramp/setBuyDefaultFiat');

export const setBuyDefaultCryptoList = createAction<{
  list: IRampCryptoItem[];
}>('ramp/setBuyDefaultCryptoList');

export const setBuyDefaultCrypto = createAction<{
  value: IRampCryptoDefault;
}>('ramp/setBuyDefaultCrypto');

export const setSellCryptoList = createAction<{
  list: IRampCryptoItem[];
}>('ramp/setSellCryptoList');

export const setSellDefaultCrypto = createAction<{
  value: IRampCryptoDefault;
}>('ramp/setSellDefaultCrypto');

export const setSellDefaultFiatList = createAction<{
  list: IRampFiatItem[];
}>('ramp/setSellDefaultFiatList');

export const setSellDefaultFiat = createAction<{
  value: IRampFiatDefault;
}>('ramp/setSellDefaultFiat');
