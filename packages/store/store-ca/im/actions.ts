import { createAction } from '@reduxjs/toolkit';
import { ChannelList, UpdateChannelAttributeTypeEnum } from './type';
import { ChannelItem, Message } from '@portkey-wallet/im';
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

export const updateChannelAttribute = createAction<{
  network: NetworkType;
  channelId: string;
  value: Partial<ChannelItem>;
  type?: UpdateChannelAttributeTypeEnum;
}>('im/updateChannelAttribute');

export const removeChannel = createAction<{
  network: NetworkType;
  channelId: string;
}>('im/removeChannel');

export const addChannelMessage = createAction<{
  network: NetworkType;
  channelId: string;
  message: Message;
}>('im/addChannelMessage');

export const nextChannelMessageList = createAction<{
  network: NetworkType;
  channelId: string;
  list: Message[];
}>('im/nextChannelMessageList');

export const setChannelMessageList = createAction<{
  network: NetworkType;
  channelId: string;
  list: Message[];
}>('im/setChannelMessageList');

export const deleteChannelMessage = createAction<{
  network: NetworkType;
  channelId: string;
  sendUuid: string;
}>('im/deleteChannelMessage');

export const resetIm = createAction<NetworkType>('im/resetIm');
