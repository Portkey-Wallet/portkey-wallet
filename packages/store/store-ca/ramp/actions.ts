import { createAction } from '@reduxjs/toolkit';
import { IRampCryptoItem, IRampFiatItem, IRampInfo } from '@portkey-wallet/ramp';

export const setRampInfo = createAction<{
  info: IRampInfo;
}>('ramp/setRampInfo');

export const setRampEntry = createAction<{
  isRampShow: boolean;
  isBuySectionShow: boolean;
  isSellSectionShow: boolean;
}>('ramp/setRampEntry');

export const setBuyFiatList = createAction<{
  list: IRampFiatItem[];
}>('ramp/setBuyFiatList');

export const setBuyDefaultCrypto = createAction<{
  symbol: string;
  amount: string;
}>('ramp/setBuyDefaultCrypto');

export const setBuyDefaultFiat = createAction<{
  symbol: string;
  amount: string;
}>('ramp/setBuyDefaultFiat');

export const setSellCryptoList = createAction<{
  list: IRampCryptoItem[];
}>('ramp/setSellCryptoList');

export const setSellDefaultCrypto = createAction<{
  symbol: string;
  amount: string;
}>('ramp/setSellDefaultCrypto');

export const setSellDefaultFiat = createAction<{
  symbol: string;
  amount: string;
}>('ramp/setSellDefaultFiat');
