import { Popover } from 'antd';
import React, { useRef } from 'react';
import clsx from 'clsx';
import { useCopyToClipboard } from 'react-use';

import PhotoMessage from '../PhotoMessage';
import TextMessage from '../TextMessage';
import SystemMessage from '../SystemMessage';
import PopoverMenuList from '../PopoverMenuList';
import CustomSvg from '../components/CustomSvg';
import { MessageBoxType } from '../type';
import './index.less';

const MessageItem: React.FC<MessageBoxType> = ({ styles, onDelete, ...props }) => {
  const messageRef = useRef<HTMLDivElement>(null);
  const [, setCopied] = useCopyToClipboard();

  const popoverList = [
    props.type === 'text' && {
      key: 'copy',
      leftIcon: <CustomSvg type="Copy" />,
      children: 'Copy',
      onClick: () => {
        setCopied(props.text);
      },
    },
    {
      key: 'delete',
      leftIcon: <CustomSvg type="Delete" />,
      children: 'Delelte',
      onClick: onDelete,
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
          content={<PopoverMenuList data={popoverList as any} />}>
          {props.type === 'text' && <TextMessage {...props} />}
          {props.type === 'photo' && <PhotoMessage {...props} />}
        </Popover>
      )}
    </div>
  );
};

export default MessageItem;
