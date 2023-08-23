import React, { useEffect, useMemo, useState } from 'react';
import { Popover } from 'antd';
import clsx from 'clsx';

import Avatar from '../Avatar';
import UnreadTip from '../UnreadTip';
import CustomSvg from '../components/CustomSvg';
import { IChatItemProps } from '../type';
import { formatChatListTime } from '../utils';
import PopoverMenuList from '../PopoverMenuList';
import './index.less';

const ChannelItem: React.FC<IChatItemProps> = ({
  date = new Date().getTime(),
  unread = 0,
  alt = 'portkey',
  showMute = true,
  onClickDelete,
  onClickMute,
  onClickPin,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    props.onClick?.(e);
  };
  const [popVisible, setPopVisible] = useState(false);

  const popList = useMemo(
    () => [
      {
        key: 'pin',
        leftIcon: <CustomSvg type={props.pin ? 'UnPin' : 'Pin'} />,
        children: props.pin ? 'Unpin' : 'Pin',
        onClick: (e: any) => {
          hidePop();
          onClickPin?.(e);
        },
      },
      {
        key: 'mute',
        leftIcon: <CustomSvg type={props.muted ? 'UnMute' : 'Mute'} />,
        children: props.muted ? 'Unmute' : 'Mute',
        onClick: (e: any) => {
          hidePop();
          onClickMute?.(e);
        },
      },
      {
        key: 'delete',
        leftIcon: <CustomSvg type="Delete" />,
        children: 'Delete',
        onClick: (e: any) => {
          hidePop();
          onClickDelete?.(e);
        },
      },
    ],
    [onClickDelete, onClickMute, onClickPin, props.muted, props.pin],
  );
  const hidePop = () => {
    setPopVisible(false);
  };
  useEffect(() => {
    document.addEventListener('click', hidePop);
    return () => document.removeEventListener('click', hidePop);
  }, []);

  return (
    <Popover
      key={`pop-${props.id}`}
      overlayClassName="chat-item-popover"
      placement="bottom"
      trigger="contextMenu"
      open={popVisible}
      onOpenChange={(visible) => setPopVisible(visible)}
      showArrow={false}
      content={<PopoverMenuList data={popList} />}>
      <div
        key={props.id}
        className={clsx('portkey-chat-item flex-column', props.className)}
        onClick={handleClick}
        // onContextMenu={props.onContextMenu}
      >
        <div className={clsx('chat-item', 'flex', props.pin && 'chat-item-pin')}>
          <div key={'avatar'} className="chat-item-avatar flex-center">
            <Avatar src={props.avatar} alt={alt} letterItem={props.letterItem} />
          </div>
          <div key={'chat-item-body'} className="chat-item-body flex-column">
            <div className="body-top flex">
              <div className="body-top-title flex">
                <span className="body-top-title-text">{props.title}</span>
                {showMute && props.muted === true && <CustomSvg type="Mute" />}
              </div>
              <div className="body--top-time">{props.dateString || formatChatListTime(`${date}`)}</div>
            </div>

            <div className="body-bottom flex">
              <div className="body-bottom-title">{props.subtitle}</div>
              <div className="body-bottom-status">
                {unread && unread > 0 ? (
                  <UnreadTip unread={unread} muted={showMute && props.muted} />
                ) : props.pin ? (
                  <CustomSvg type="Pin" />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Popover>
  );
};

export default ChannelItem;
