import React, { useMemo } from 'react';
import clsx from 'clsx';
import ImageMessage from '../ImageMessage';
import TextMessage from '../TextMessage';
import SystemMessage from '../SystemMessage';
import RedPacketMessage from '../RedPacketMessage';
import { IMessage, MessageContentType } from '../type';
import Avatar from '../Avatar';
import { MessageType, MessageTypeEnum } from '@portkey-wallet/im';
import './index.less';

export const supportSysMsgType: MessageType[] = [MessageTypeEnum.PIN_SYS, MessageTypeEnum.SYS];

const MessageItem: React.FC<MessageContentType> = (props) => {
  const { className, fromAvatar, fromName, type } = props;
  const positionClassName = useMemo(
    () => (supportSysMsgType.includes(type) ? 'center' : props.position),
    [props.position, type],
  );
  return (
    <div key={props.key} className={clsx('portkey-message-item', 'flex', positionClassName, className)}>
      {!supportSysMsgType.includes(type) && props.showAvatar && (
        <Avatar {...props} src={fromAvatar} onClick={(e: React.MouseEvent<HTMLElement>) => props?.onClickAvatar?.(e)} />
      )}
      {supportSysMsgType.includes(type) && <SystemMessage {...props} />}
      {type === MessageTypeEnum.TEXT && (
        <div className="flex-column">
          {props.showAvatar && <div className="message-item-form-name">{fromName}</div>}
          <TextMessage {...(props as IMessage)} />
        </div>
      )}
      {type === MessageTypeEnum.IMAGE && (
        <div>
          {props.showAvatar && <div className="message-item-form-name">{fromName}</div>}
          <ImageMessage {...(props as IMessage)} />
        </div>
      )}
      {type === MessageTypeEnum.REDPACKAGE_CARD && (
        <div className="flex-column">
          {props.showAvatar && <div className="message-item-form-name">{fromName}</div>}
          <RedPacketMessage {...(props as IMessage)} />
        </div>
      )}
    </div>
  );
};

export default MessageItem;
