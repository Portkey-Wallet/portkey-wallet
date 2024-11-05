import { NetworkType } from '@portkey-wallet/types';
import { createAction } from '@reduxjs/toolkit';

export const updateAwakenGasFee = createAction<{
  network: NetworkType;
  gasFee: string;
}>('awaken/updateAwakenGasFee');
