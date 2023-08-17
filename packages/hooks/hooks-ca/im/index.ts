import im from '@portkey-wallet/im';
import { useEffect, useState } from 'react';
import { useAppCASelector } from '../.';

export const useImState = () => useAppCASelector(state => state.im);

export const refreshMessageCount = async () => {
  const { data: messageCount } = await im.service.getUnreadCount();

  im.updateMessageCount(messageCount);
  return messageCount;
};

export const useUnreadCount = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const { unreadCount } = im.getMessageCount();
    setUnreadCount(unreadCount);

    const { remove } = im.registerMessageCountObserver(e => {
      setUnreadCount(e.unreadCount);
    });

    return remove;
  }, []);

  return unreadCount;
};

export * from './channelList';
export * from './channel';
