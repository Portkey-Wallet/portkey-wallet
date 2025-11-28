import { createAction } from '@reduxjs/toolkit';
import { RedPackageConfigType } from '@portkey-wallet/im';
import { NetworkType } from '@portkey-wallet/types';

export const setRedPackageConfig = createAction<{
  network: NetworkType;
  value: RedPackageConfigType;
}>('cryptoGift/setRedPackageConfig');
