import { createAction } from '@reduxjs/toolkit';
import { ChannelList, UpdateChannelAttributeTypeEnum } from './type';
import { ChannelItem, Message } from 'packages/im';
import { NetworkType } from 'packages/types';

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

export const addChannel = createAction<{
  network: NetworkType;
  channel: ChannelItem;
}>('im/addChannel');

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
  id: string;
}>('im/deleteChannelMessage');

export const updateChannelMessageAttribute = createAction<{
  network: NetworkType;
  channelId: string;
  sendUuid: string;
  value: Partial<Message>;
}>('im/updateChannelMessageAttribute');

export const setRelationId = createAction<{
  network: NetworkType;
  relationId: string;
}>('im/setRelationId');

export const resetIm = createAction<NetworkType>('im/resetIm');

export const setRelationToken = createAction<{
  network: NetworkType;
  token: string;
}>('im/setRelationToken');
