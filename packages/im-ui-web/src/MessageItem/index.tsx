import React, { useRef } from 'react';
import clsx from 'clsx';

import ImageMessage from '../ImageMessage';
import TextMessage from '../TextMessage';
import SystemMessage from '../SystemMessage';
import { MessageBoxType } from '../type';
import './index.less';

const MessageItem: React.FC<MessageBoxType> = ({ styles, ...props }) => {
  const messageRef = useRef<HTMLDivElement>(null);

  return (
    <div
      key={props.key}
      style={{ position: 'relative' }}
      ref={messageRef}
      className={clsx('portkey-message-item', 'flex-column', props.className)}
      onClick={props.onClick}>
      {props.type === 'system' ? (
        <SystemMessage {...props} />
      ) : (
        <>
          {props.type === 'text' && <TextMessage {...props} />}
          {props.type === 'image' && <ImageMessage {...props} />}
        </>
      )}
    </div>
  );
};

export default MessageItem;
