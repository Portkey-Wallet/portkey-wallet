import { NetworkType } from '@portkey-wallet/types';
import { createAction } from '@reduxjs/toolkit';

export const updateAwakenGasFee = createAction<{
  network: NetworkType;
  gasFee: string;
}>('awaken/updateAwakenGasFee');

export const updateAwakenUserSlippageTolerance = createAction<{
  network: NetworkType;
  userSlippageTolerance: string;
}>('awaken/updateAwakenUserSlippageTolerance');

export const updateAwakenUserExpiration = createAction<{
  network: NetworkType;
  userExpiration: string;
}>('awaken/updateAwakenUserExpiration');

export const updateAwakenTokenPrices = createAction<{
  network: NetworkType;
  val: Record<string, string>;
}>('awaken/updateAwakenTokenPrices');
