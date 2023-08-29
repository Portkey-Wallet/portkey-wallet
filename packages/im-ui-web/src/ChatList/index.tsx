import React, { useCallback } from 'react';
import clsx from 'clsx';
import ChatItem from '../ChatItem';
import { IChatListProps, ChatListEvent } from '../type';
import LoadingMore from '../components/LoadMore';
import './index.less';

const ChatList: React.FC<IChatListProps> = ({ dataSource, hasMore = false, loadMore, ...props }) => {
  const onClick: ChatListEvent = useCallback(
    (item) => {
      if (props.onClick instanceof Function) props.onClick(item);
    },
    [props],
  );

  const onClickMute: ChatListEvent = useCallback(
    (item) => {
      if (props.onClickMute instanceof Function) props.onClickMute(item);
    },
    [props],
  );

  const onClickPin: ChatListEvent = useCallback(
    (item) => {
      if (props.onClickPin instanceof Function) props.onClickPin(item);
    },
    [props],
  );

  const onClickDelete: ChatListEvent = useCallback(
    (item) => {
      if (props.onClickDelete instanceof Function) props.onClickDelete(item);
    },
    [props],
  );

  return (
    <div className={clsx('portkey-chat-list', props.className)}>
      {dataSource.map((x, i: number) => (
        <ChatItem
          {...x}
          key={x.id}
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

export default ChatList;
