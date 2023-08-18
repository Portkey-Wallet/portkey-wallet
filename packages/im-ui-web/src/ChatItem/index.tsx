import React from 'react';
import clsx from 'clsx';

import Avatar from '../Avatar';
import UnreadTip from '../UnreadTip';
import CustomSvg from '../components/CustomSvg';

import { IChatItemProps } from '../type';
import { formatChatListTime } from '../utils';

import './index.less';

const ChannelItem: React.FC<IChatItemProps> = ({
  date = new Date().getTime(),
  unread = 0,
  alt = 'avatar',
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
  // TODO
  // const isShowPop = useMemo(() => onClickDelete || onClickMute || onClickPin, []);

  return (
    <div
      key={props.id}
      className={clsx('portkey-chat-item flex-column', props.className)}
      onClick={handleClick}
      onContextMenu={props.onContextMenu}>
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
            {props.customStatusComponents !== undefined ? props.customStatusComponents.map(Item => <Item />) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelItem;
