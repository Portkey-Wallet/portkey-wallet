import { NetworkType } from '@portkey-wallet/types';
import { createAction } from '@reduxjs/toolkit';
import { DappStoreItem } from './type';

export const addDapp = createAction<{
  networkType: NetworkType;
  dapp: DappStoreItem;
}>('dapp/addDapp');

export const removeDapp = createAction<{
  networkType: NetworkType;
  origin: string;
}>('dapp/removeDapp');

export const updateDapp = createAction<{
  networkType: NetworkType;
  origin: string;
  dapp: DappStoreItem;
}>('dapp/updateDapp');

export const resetDappList = createAction('dapp/resetDappList');
