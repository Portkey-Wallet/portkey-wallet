import { createAsyncThunk, createAction } from '@reduxjs/toolkit';
import { ChannelList, IMStateType } from './type';
import { ChannelItem } from '@portkey-wallet/im';
import { NetworkType } from '@portkey-wallet/types';

export const setChannelList = createAction<{
  network: NetworkType;
  channelList: ChannelList;
}>('im/setChannelList');

export const nextChannelList = createAction<{
  network: NetworkType;
  channelList: ChannelList;
}>('im/nextChannelList');

export const setHasNext = createAction<{
  network: NetworkType;
  hasNext: boolean;
}>('im/setHasNext');

export const resetIm = createAction<NetworkType>('im/resetIm');
