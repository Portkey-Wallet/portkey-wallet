import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Popover } from 'antd';
import clsx from 'clsx';
import Avatar from '../Avatar';
import UnreadTip from '../UnreadTip';
import CustomSvg from '../components/CustomSvg';
import { IChatItemProps } from '../type';
import { formatChatListSubTitle, formatChatListTime } from '../utils';
import PopoverMenuList from '../PopoverMenuList';
import { ChannelTypeEnum, MessageTypeEnum, ParsedRedPackage, ParsedTransfer } from '@portkey-wallet/im/types';
import { RED_PACKAGE_DEFAULT_MEMO } from '@portkey-wallet/constants/constants-ca/im';
import { RedPacketSubtitle, TransferSubtitle } from '../constants';
import './index.less';

const ChatItem: React.FC<IChatItemProps> = (props) => {
  const {
    lastPostAt = new Date().getTime(),
    unreadMessageCount = 0,
    myPortkeyId,
    onClickDelete,
    onClickMute,
    onClickPin,
    onClick,
  } = props;
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
        onClick: () => {
          hidePop();
          onClickPin?.(props);
        },
      },
      {
        key: 'mute',
        leftIcon: <CustomSvg type={props.mute ? 'UnMute' : 'Mute'} />,
        children: props.mute ? 'Unmute' : 'Mute',
        onClick: () => {
          hidePop();
          onClickMute?.(props);
        },
      },
      {
        key: 'delete',
        leftIcon: <CustomSvg type="Delete" />,
        children: 'Delete',
        onClick: () => {
          hidePop();
          onClickDelete?.(props);
        },
      },
    ],
    [hidePop, onClickDelete, onClickMute, onClickPin, props],
  );
  useEffect(() => {
    document.addEventListener('click', hidePop);
    return () => document.removeEventListener('click', hidePop);
  }, [hidePop]);

  const renderSubtitle = useMemo(() => {
    const subtitle = formatChatListSubTitle(props);
    const { lastMessageType } = props;
    if (lastMessageType !== MessageTypeEnum.REDPACKAGE_CARD && lastMessageType !== MessageTypeEnum.TRANSFER_CARD) {
      return subtitle;
    }
    const { mute, channelType, lastMessageContent } = props;
    const isGroup = channelType === ChannelTypeEnum.GROUP;
    let _showHighlight = !mute && unreadMessageCount > 0;
    let _tag = '';
    if (lastMessageType === MessageTypeEnum.REDPACKAGE_CARD) {
      const senderId = (lastMessageContent as ParsedRedPackage).data?.senderId;
      const fromMe = senderId === myPortkeyId;
      _showHighlight = _showHighlight && !fromMe;
      _tag = RedPacketSubtitle;
    }
    if (lastMessageType === MessageTypeEnum.TRANSFER_CARD) {
      if (isGroup) {
        const toUserId = (lastMessageContent as ParsedTransfer).data?.toUserId;
        const toMe = toUserId === myPortkeyId;
        _showHighlight = _showHighlight && toMe;
      } else {
        const senderId = (lastMessageContent as ParsedTransfer).data?.senderId;
        const fromMe = senderId === myPortkeyId;
        _showHighlight = _showHighlight && !fromMe;
      }
      _tag = TransferSubtitle;
    }
    return (
      <div className="transaction flex">
        <span className={clsx('transaction-tag', _showHighlight && 'transaction-tag-highlight')}>{_tag}</span>
        <span className="transaction-subtitle">{subtitle || RED_PACKAGE_DEFAULT_MEMO}</span>
      </div>
    );
  }, [myPortkeyId, props, unreadMessageCount]);

  return (
    <Popover
      key={`pop-${props.channelUuid}`}
      overlayClassName="portkey-chat-item-popover"
      placement="bottom"
      trigger="contextMenu"
      open={popVisible}
      onOpenChange={(visible: boolean) => setPopVisible(visible)}
      showArrow={false}
      content={<PopoverMenuList data={popList} />}>
      <div
        key={props.channelUuid}
        className={clsx('portkey-chat-item flex-column', props.className)}
        onClick={() => onClick?.(props)}>
        <div className={clsx('chat-item', 'flex', props.pin && 'chat-item-pin')}>
          <div key={'avatar'} className="chat-item-avatar flex-center">
            {props.channelType && [ChannelTypeEnum.GROUP, ChannelTypeEnum.P2P].includes(props.channelType) ? (
              <Avatar
                src={props.channelIcon}
                alt="portkey"
                letter={props.displayName}
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
                <span className="body-top-title-text">{props.displayName}</span>
                {props.mute === true && <CustomSvg type="Mute" />}
              </div>
              <div className="body-top-time">{props.dateString || formatChatListTime(`${lastPostAt}`)}</div>
            </div>

            <div className="body-bottom flex">
              <div className="body-bottom-title">{renderSubtitle}</div>
              <div className="body-bottom-status">
                {unreadMessageCount && unreadMessageCount > 0 ? (
                  <UnreadTip unread={unreadMessageCount} muted={props.mute} />
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
