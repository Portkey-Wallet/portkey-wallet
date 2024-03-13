import { NetworkType } from 'packages/types';
import { createAction } from '@reduxjs/toolkit';
import { DappStoreItem } from './type';
import { SessionInfo } from 'packages/types/session';

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

export const resetDappList = createAction<NetworkType>('dapp/resetDappList');

export const resetDapp = createAction('dapp/resetDapp');

export const updateSessionInfo = createAction<{
  networkType: NetworkType;
  origin: string;
  sessionInfo?: SessionInfo;
}>('dapp/updateSessionInfo');
