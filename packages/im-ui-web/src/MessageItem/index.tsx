import { Popover } from 'antd';
import React, { useRef } from 'react';
import clsx from 'clsx';

import PhotoMessage from '../PhotoMessage';
import TextMessage from '../TextMessage';
import SystemMessage from '../SystemMessage';
import PopoverMenuList from '../PopoverMenuList';
import CustomSvg from '../components/CustomSvg';
import { MessageBoxType } from '../type';
import './index.less';

const MessageItem: React.FC<MessageBoxType> = ({ styles, ...props }) => {
  const messageRef = useRef<HTMLDivElement>(null);

  // TODO
  const onClick = () => {
    // TODO
  };

  const popoverList = [
    {
      key: 'copy',
      leftIcon: <CustomSvg type="Copy" />,
      children: 'Copy',
      onClick: onClick,
    },
    {
      key: 'delete',
      leftIcon: <CustomSvg type="Delete" />,
      children: 'Delelte',
      onClick: onClick,
    },
  ];

  return (
    <div
      ref={messageRef}
      className={clsx('portkey-message-item', 'flex-column', props.className)}
      onClick={props.onClick}>
      {props.type === 'system' ? (
        <SystemMessage {...props} />
      ) : (
        <Popover
          overlayClassName="message-item-popover"
          placement="bottom"
          trigger="contextMenu"
          showArrow={false}
          // getPopupContainer={trigger => trigger.parentNode}
          content={<PopoverMenuList data={popoverList} />}>
          {props.type === 'text' && <TextMessage {...props} />}
          {props.type === 'photo' && <PhotoMessage {...props} />}
        </Popover>
      )}
    </div>
  );
};

export default MessageItem;
