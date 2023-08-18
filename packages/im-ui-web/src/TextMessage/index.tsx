import React, { useMemo } from 'react';
import './index.less';

import clsx from 'clsx';
import { ITextMessageProps } from '../type';
import { formatTime } from '../utils';

const TextMessage: React.FC<ITextMessageProps> = props => {
  const showDate = useMemo(() => (props.dateString ? props.dateString : formatTime(props.date as any)), []);
  return (
    <div className={clsx(['portkey-message-text', 'flex', props.position])}>
      <div className={clsx(['text-body', 'flex', props.position])}>
        <div className="text-text">
          <span className={clsx([props.type === 'bookmark' && 'text-link'])}>{props.text}</span>
          <span className="text-date-hidden">{showDate}</span>
        </div>
        <div className="text-date">{showDate}</div>
      </div>
    </div>
  );
};

export default TextMessage;
