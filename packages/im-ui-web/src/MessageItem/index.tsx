import React, { useMemo } from 'react';
import clsx from 'clsx';
import ImageMessage from '../ImageMessage';
import TextMessage from '../TextMessage';
import SystemMessage from '../SystemMessage';
import { MessageType } from '../type';
import Avatar from '../Avatar';
import './index.less';

const MessageItem: React.FC<MessageType> = ({ className, ...props }) => {
  const customClass = useMemo(
    () => (props.type === 'system' ? 'center' : props.position),
    [props.position, props.type],
  );
  return (
    <div key={props.key} className={clsx('portkey-message-item', 'flex', customClass, className)}>
      {props.type !== 'system' && props.showAvatar && (
        <Avatar {...props} onClick={(e: React.MouseEvent<HTMLElement>) => props?.onClickAvatar?.(e)} />
      )}
      {props.type === 'system' && <SystemMessage {...props} />}
      {props.type === 'text' && (
        <div className="flex-column">
          {props.showAvatar && <div className="message-item-form-name">{props.title}</div>}
          <TextMessage {...props} />
        </div>
      )}
      {props.type === 'image' && (
        <div>
          {props.showAvatar && <div className="message-item-form-name">{props.title}</div>}
          <ImageMessage {...props} />
        </div>
      )}
    </div>
  );
};

export default MessageItem;
