import React from 'react';
import clsx from 'clsx';
import ChatItem from '../ChatItem';
import { IChatListProps } from '../type';
import LoadingMore from '../components/LoadMore';
import './index.less';

const ChatList: React.FC<IChatListProps> = ({ dataSource, hasMore = false, loadMore, ...props }) => {
  return (
    <div className={clsx('portkey-chat-list', props.className)}>
      {dataSource.map((x, i: number) => (
        <ChatItem
          {...x}
          key={x.id}
          onClick={(e: React.MouseEvent<HTMLElement>) => props.onClick?.(x, i, e)}
          onClickPin={(e: React.MouseEvent<HTMLElement>) => props.onClickPin?.(x, i, e)}
          onClickMute={(e: React.MouseEvent<HTMLElement>) => props.onClickMute?.(x, i, e)}
          onClickDelete={(e: React.MouseEvent<HTMLElement>) => props.onClickDelete?.(x, i, e)}
        />
      ))}
      <LoadingMore hasMore={hasMore} loadMore={loadMore} className="load-more" />
    </div>
  );
};

export default ChatList;
