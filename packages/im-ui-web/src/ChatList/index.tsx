import React, { useMemo } from 'react';
import clsx from 'clsx';
import { Popover } from 'antd';

import ChatItem from '../ChatItem';
import { IChatListProps, ChatListEvent, IChatItemProps } from '../type';
import LoadingMore from '../components/LoadMore';
import PopoverMenuList from '../PopoverMenuList';

import CustomSvg from '../components/CustomSvg';
import './index.less';

const ChannelList: React.FC<IChatListProps> = ({ dataSource, hasMore = false, loadMore, ...props }) => {
  const isShowPopover = useMemo(() => props.onClickDelete || props.onClickMute || props.onClickPin, []);

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

  const getPopList = (x: IChatItemProps) => [
    props.onClickPin && {
      key: 'pin',
      leftIcon: <CustomSvg type={x.pin ? 'UnPin' : 'Pin'} />,
      children: x.pin ? 'Unpin' : 'Pin',
      onClick: () => onClickPin(x),
    },
    props.onClickMute && {
      key: 'mute',
      leftIcon: <CustomSvg type={x.muted ? 'UnMute' : 'Mute'} />,
      children: x.muted ? 'Unmute' : 'Mute',
      onClick: () => onClickMute(x),
    },
    props.onClickDelete && {
      key: 'delete',
      leftIcon: <CustomSvg type="Delete" />,
      children: 'Delete',
      onClick: () => onClickDelete(x),
    },
  ];

  return (
    <div className={clsx('portkey-chat-list', props.className)}>
      {dataSource.map((x, i: number) =>
        isShowPopover ? (
          <Popover
            key={x.id}
            overlayClassName="chat-item-popover"
            placement="bottom"
            trigger="contextMenu"
            showArrow={false}
            content={<PopoverMenuList data={getPopList(x) as any} />}>
            <ChatItem
              {...x}
              key={x.id}
              onContextMenu={(e: React.MouseEvent<HTMLElement>) => onContextMenu(x, i, e)}
              onClick={(e: React.MouseEvent<HTMLElement>) => onClick(x, i, e)}
              onClickPin={(e: React.MouseEvent<HTMLElement>) => onClickPin(x, i, e)}
              onClickMute={(e: React.MouseEvent<HTMLElement>) => onClickMute(x, i, e)}
              onClickDelete={(e: React.MouseEvent<HTMLElement>) => onClickDelete(x, i, e)}
            />
          </Popover>
        ) : (
          <ChatItem
            {...x}
            key={x.id}
            onContextMenu={(e: React.MouseEvent<HTMLElement>) => onContextMenu(x, i, e)}
            onClick={(e: React.MouseEvent<HTMLElement>) => onClick(x, i, e)}
            onClickPin={(e: React.MouseEvent<HTMLElement>) => onClickPin(x, i, e)}
            onClickMute={(e: React.MouseEvent<HTMLElement>) => onClickMute(x, i, e)}
            onClickDelete={(e: React.MouseEvent<HTMLElement>) => onClickDelete(x, i, e)}
          />
        ),
      )}
      <LoadingMore hasMore={hasMore} loadMore={loadMore} className="load-more" />
    </div>
  );
};

export default ChannelList;
