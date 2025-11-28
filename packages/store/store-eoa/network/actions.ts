import { NetworkType } from '@portkey-wallet/types';
import { IChainItemType } from '@portkey-wallet/types/types-eoa/chain';
import { createAction } from '@reduxjs/toolkit';

export const setCurrentNetwork = createAction<{
  currentNetwork: NetworkType;
}>('network/setCurrentNetwork');

export const setChainList = createAction<{
  network: NetworkType;
  chainList: IChainItemType[];
}>('network/setChainList');
