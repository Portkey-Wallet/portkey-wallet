import { ChannelList } from './type';

export const formatChannelList = (channelList: ChannelList): ChannelList => {
  const pinList: ChannelList['list'] = [];
  const normalList: ChannelList['list'] = [];

  channelList.list.forEach(channelItem => {
    if (channelItem.pin) pinList.push(channelItem);
    else normalList.push(channelItem);
  });

  pinList.sort((a, b) => Number(b.lastPostAt) - Number(a.lastPostAt));
  normalList.sort((a, b) => Number(b.lastPostAt) - Number(a.lastPostAt));

  return {
    ...channelList,
    list: [...pinList, ...normalList],
  };
};
