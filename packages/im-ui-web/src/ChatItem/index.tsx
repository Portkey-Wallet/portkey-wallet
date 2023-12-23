import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Popover } from 'antd';
import clsx from 'clsx';
import Avatar from '../Avatar';
import UnreadTip from '../UnreadTip';
import CustomSvg from '../components/CustomSvg';
import { IChatItemProps } from '../type';
import { formatChatListTime } from '../utils';
import PopoverMenuList from '../PopoverMenuList';
import { ChannelTypeEnum, MessageTypeEnum } from '@portkey-wallet/im/types';
import { RED_PACKAGE_DEFAULT_MEMO } from '@portkey-wallet/constants/constants-ca/im';
import './index.less';

const ChatItem: React.FC<IChatItemProps> = ({
  date = new Date().getTime(),
  unread = 0,
  alt = 'portkey',
  showMute = true,
  showLetter = false,
  onClickDelete,
  onClickMute,
  onClickPin,
  ...props
}) => {
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      props.onClick?.(e);
    },
    [props],
  );
  const hidePop = useCallback(() => {
    setPopVisible(false);
  }, []);
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
    [hidePop, onClickDelete, onClickMute, onClickPin, props.muted, props.pin],
  );
  useEffect(() => {
    document.addEventListener('click', hidePop);
    return () => document.removeEventListener('click', hidePop);
  }, [hidePop]);

  const renderSubtitle = useMemo(() => {
    const { subtitle, muted, isOwner, lastMessageType } = props;
    const showRedPacket = lastMessageType === MessageTypeEnum.REDPACKAGE_CARD;
    const showRedPacketHighlight = !muted && !isOwner && unread > 0;
    if (showRedPacket) {
      return (
        <div className="red-packet flex">
          <span
            className={clsx(
              'red-packet-tag',
              showRedPacketHighlight && 'red-packet-tag-highlight',
            )}>{`[Crypto Box]`}</span>
          <span className="red-packet-subtitle">{subtitle || RED_PACKAGE_DEFAULT_MEMO}</span>
        </div>
      );
    }
    return subtitle;
  }, [props, unread]);

  return (
    <Popover
      key={`pop-${props.id}`}
      overlayClassName="portkey-chat-item-popover"
      placement="bottom"
      trigger="contextMenu"
      open={popVisible}
      onOpenChange={(visible: boolean) => setPopVisible(visible)}
      showArrow={false}
      content={<PopoverMenuList data={popList} />}>
      <div key={props.id} className={clsx('portkey-chat-item flex-column', props.className)} onClick={handleClick}>
        <div className={clsx('chat-item', 'flex', props.pin && 'chat-item-pin')}>
          <div key={'avatar'} className="chat-item-avatar flex-center">
            {props.channelType && [ChannelTypeEnum.GROUP, ChannelTypeEnum.P2P].includes(props.channelType) ? (
              <Avatar
                src={props.avatar}
                alt={alt}
                showLetter={showLetter}
                letter={props.letter}
                isGroupAvatar={props.channelType === ChannelTypeEnum.GROUP}
              />
            ) : (
              <div className="flex-center avatar-unknown">
                <CustomSvg type="Unknown" />
              </div>
            )}
          </div>
          <div key={'chat-item-body'} className="chat-item-body flex-column">
            <div className="body-top flex-row-center">
              <div className="body-top-title flex">
                <span className="body-top-title-text">{props.title}</span>
                {showMute && props.muted === true && <CustomSvg type="Mute" />}
              </div>
              <div className="body-top-time">{props.dateString || formatChatListTime(`${date}`)}</div>
            </div>

            <div className="body-bottom flex">
              <div className="body-bottom-title">{renderSubtitle}</div>
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

export default ChatItem;
