import { createAction } from '@reduxjs/toolkit';
import { ChannelList, UpdateChannelAttributeTypeEnum } from './type';
import {
  ChannelInfo,
  ChannelItem,
  ChannelMemberInfo,
  Message,
  RedPackageConfigType,
  RedPackageStatusInfo,
} from '@portkey-wallet/im';
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

export const updateChannelRedPackageAttribute = createAction<{
  network: NetworkType;
  channelId: string;
  id: string;
  value: RedPackageStatusInfo;
}>('im/updateChannelRedPackageAttribute');

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

export const updateChannelMessageRedPackageAttribute = createAction<{
  network: NetworkType;
  channelId: string;
  id: string;
  value: RedPackageStatusInfo;
}>('im/updateChannelMessageRedPackageAttribute');

export const setRelationId = createAction<{
  network: NetworkType;
  relationId: string;
}>('im/setRelationId');

export const setRelationToken = createAction<{
  network: NetworkType;
  token: string;
}>('im/setRelationToken');

export const setGroupInfo = createAction<{
  network: NetworkType;
  groupInfo: ChannelInfo;
}>('im/setGroupInfo');

export const addChannelMembers = createAction<{
  network: NetworkType;
  channelId: string;
  memberInfos: ChannelMemberInfo[];
}>('im/addChannelMembers');

export const removeChannelMembers = createAction<{
  network: NetworkType;
  channelId: string;
  members: string[];
}>('im/removeChannelMembers');

export const transferChannelOwner = createAction<{
  network: NetworkType;
  channelId: string;
  relationId: string;
}>('im/transferChannelOwner');

export const updateGroupInfo = createAction<{
  network: NetworkType;
  channelId: string;
  value: Partial<ChannelInfo>;
}>('im/updateGroupInfo');

export const updateGroupInfoMembersInfo = createAction<{
  network: NetworkType;
  channelId: string;
  isInit: boolean;
  value: Pick<ChannelInfo, 'members' | 'totalCount'>;
}>('im/updateGroupInfoMembersInfo');

export const setPinList = createAction<{
  network: NetworkType;
  channelId: string;
  list: Message[];
  fetchTime: number;
}>('im/setPinList');

export const nextPinList = createAction<{
  network: NetworkType;
  channelId: string;
  list: Message[];
  fetchTime: number;
}>('im/nextPinList');

export const cleanALLChannelMessagePin = createAction<{
  network: NetworkType;
  channelId: string;
}>('im/cleanALLChannelMessagePin');

export const setLastPinMessage = createAction<{
  network: NetworkType;
  channelId: string;
  message: Message | undefined;
  fetchTime: number;
}>('im/setLastPinMessage');
export const setRedPackageConfig = createAction<{
  network: NetworkType;
  value: RedPackageConfigType;
}>('im/setRedPackageConfig');

export const resetIm = createAction<NetworkType>('im/resetIm');
