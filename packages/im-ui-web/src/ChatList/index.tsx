import React from 'react';
import clsx from 'clsx';
import ChatItem from '../ChatItem';
import { IChatListProps } from '../type';
import LoadingMore from '../components/LoadMore';
import './index.less';

const ChatList: React.FC<IChatListProps> = ({ dataSource, hasMore = false, loadMore, myPortkeyId, ...props }) => {
  return (
    <div className={clsx('portkey-chat-list', props.className)}>
      {dataSource.map((x) => (
        <ChatItem
          {...x}
          myPortkeyId={myPortkeyId}
          key={x.channelUuid}
          onClick={props.onClick}
          onClickPin={props.onClickPin}
          onClickMute={props.onClickMute}
          onClickDelete={props.onClickDelete}
        />
      ))}
      <LoadingMore hasMore={hasMore} loadMore={loadMore} className="load-more" />
    </div>
  );
};

export default ChatList;
