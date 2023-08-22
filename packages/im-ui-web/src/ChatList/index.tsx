import React from 'react';
import clsx from 'clsx';

import ChatItem from '../ChatItem';
import { IChatListProps, ChatListEvent } from '../type';
import LoadingMore from '../components/LoadMore';
import './index.less';

const ChannelList: React.FC<IChatListProps> = ({ dataSource, hasMore = false, loadMore, ...props }) => {
  const onClick: ChatListEvent = item => {
    if (props.onClick instanceof Function) props.onClick(item);
  };

  const onClickMute: ChatListEvent = item => {
    if (props.onClickMute instanceof Function) props.onClickMute(item);
  };

  const onClickPin: ChatListEvent = item => {
    if (props.onClickPin instanceof Function) props.onClickPin(item);
  };

  const onClickDelete: ChatListEvent = item => {
    if (props.onClickDelete instanceof Function) props.onClickDelete(item);
  };

  const onContextMenu: ChatListEvent = (item, index, event) => {
    event?.preventDefault();
    if (props.onContextMenu instanceof Function) props.onContextMenu(item, index, event);
  };

  return (
    <div className={clsx('portkey-chat-list', props.className)}>
      {dataSource.map((x, i: number) => (
        <ChatItem
          {...x}
          key={x.id}
          onContextMenu={(e: React.MouseEvent<HTMLElement>) => onContextMenu(x, i, e)}
          onClick={(e: React.MouseEvent<HTMLElement>) => onClick(x, i, e)}
          onClickPin={(e: React.MouseEvent<HTMLElement>) => onClickPin(x, i, e)}
          onClickMute={(e: React.MouseEvent<HTMLElement>) => onClickMute(x, i, e)}
          onClickDelete={(e: React.MouseEvent<HTMLElement>) => onClickDelete(x, i, e)}
        />
      ))}
      <LoadingMore hasMore={hasMore} loadMore={loadMore} className="load-more" />
    </div>
  );
};

export default ChannelList;
