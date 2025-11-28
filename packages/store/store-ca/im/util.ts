import { ChannelList } from './type';

export const formatChannelList = (channelList: ChannelList): ChannelList => {
  const pinList: ChannelList['list'] = [];
  const normalList: ChannelList['list'] = [];

  const channelUuidMap = new Map<string, boolean>();
  channelList.list = channelList.list.filter(channelItem => {
    if (channelUuidMap.has(channelItem.channelUuid)) return false;
    channelUuidMap.set(channelItem.channelUuid, true);
    return true;
  });

  channelList.list.forEach(channelItem => {
    if (channelItem.pin) pinList.push(channelItem);
    else normalList.push(channelItem);
  });
  const now = Date.now();

  pinList.sort(
    (a, b) =>
      (Math.max(Number(b.pinAt), Number(b.lastPostAt)) || now) -
      (Math.max(Number(a.pinAt), Number(a.lastPostAt)) || now),
  );
  normalList.sort((a, b) => Number(b.lastPostAt || now) - Number(a.lastPostAt || now));

  return {
    ...channelList,
    list: [...pinList, ...normalList],
  };
};
