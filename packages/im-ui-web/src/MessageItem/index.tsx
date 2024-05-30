import React, { useMemo } from 'react';
import clsx from 'clsx';
import ImageMessage from '../ImageMessage';
import TextMessage from '../TextMessage';
import SystemMessage from '../SystemMessage';
import RedPacketMessage from '../RedPacketMessage';
import { IMessage, MessageContentType } from '../type';
import Avatar from '../Avatar';
import { MessageTypeEnum } from '@portkey-wallet/im';
import { SupportSysMsgType } from '../constants';
import TransferMessage from '../TransferMessage';
import './index.less';

const MessageItem: React.FC<MessageContentType> = ({ className, ...props }) => {
  const { fromAvatar, fromName, type, showAvatar = false, hideAvatar } = props;
  const positionClassName = useMemo(
    () => (SupportSysMsgType.includes(type) ? 'center' : props.position),
    [props.position, type],
  );
  const renderFromName = useMemo(() => {
    // const isOwner = SupportCommonMsgType.includes(type) ? (props as IMessage).isOwner : false;
    return (
      <div className="message-item-form-name flex-row-center">
        <div className="form-name-text">{fromName}</div>
        {/* {isOwner && <div className="admin-icon">Owner</div>} */}
      </div>
    );
  }, [fromName]);
  return (
    <div
      key={props.key}
      className={clsx('portkey-message-item', 'flex', positionClassName, className, hideAvatar && 'hidden-avatar')}>
      {showAvatar && <Avatar {...props} src={fromAvatar} onClick={() => props?.onClickAvatar?.(props)} />}
      {SupportSysMsgType.includes(type) && <SystemMessage {...props} />}
      {type === MessageTypeEnum.TEXT && (
        <div className="flex-column">
          {showAvatar && renderFromName}
          <TextMessage {...(props as IMessage)} />
        </div>
      )}
      {type === MessageTypeEnum.IMAGE && (
        <div>
          {showAvatar && renderFromName}
          <ImageMessage {...(props as IMessage)} />
        </div>
      )}
      {type === MessageTypeEnum.REDPACKAGE_CARD && (
        <div className="flex-column">
          {showAvatar && renderFromName}
          <RedPacketMessage {...(props as IMessage)} />
        </div>
      )}
      {type === MessageTypeEnum.TRANSFER_CARD && (
        <div className="flex-column">
          {showAvatar && renderFromName}
          <TransferMessage {...(props as IMessage)} />
        </div>
      )}
    </div>
  );
};

export default MessageItem;
