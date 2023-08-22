import React, { useMemo } from 'react';
import { Popover } from 'antd';
import { useCopyToClipboard } from 'react-use';
import './index.less';

import clsx from 'clsx';
import { ITextMessageProps } from '../type';
import { formatTime } from '../utils';
import PopoverMenuList from '../PopoverMenuList';
import CustomSvg from '../components/CustomSvg';

const TextMessage: React.FC<ITextMessageProps> = props => {
  const showDate = useMemo(() => (props.dateString ? props.dateString : formatTime(props.date as any)), []);
  const [, setCopied] = useCopyToClipboard();

  const popoverList = [
    {
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
      onClick: () => props?.onDelete?.(`${props.id}`),
    },
  ];
  return (
    <div className={clsx(['portkey-message-text', 'flex', props.position])}>
      <Popover
        overlayClassName={clsx(['message-item-popover', props.position])}
        placement={props.position === 'left' ? 'right' : 'left'}
        trigger="contextMenu"
        showArrow={false}
        content={<PopoverMenuList data={popoverList} />}>
        <div className={clsx(['text-body', 'flex', props.position])}>
          <div className="text-text">
            <span className={clsx([props.type === 'bookmark' && 'text-link'])}>{props.text}</span>
            <span className="text-date-hidden">{showDate}</span>
          </div>
          <div className="text-date">{showDate}</div>
        </div>
      </Popover>
    </div>
  );
};

export default TextMessage;
