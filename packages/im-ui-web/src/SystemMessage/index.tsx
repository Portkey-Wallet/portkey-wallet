import React, { useMemo } from 'react';
import clsx from 'clsx';
import { ISystemMessageProps } from '../type';
import './index.less';

const SystemMessage: React.FC<ISystemMessageProps> = (props) => {
  const showTime = useMemo(() => props?.subType === 'show-time', [props?.subType]);
  return (
    <div className="portkey-container-system flex">
      <div className={clsx(['portkey-system-text', showTime && 'system-time'])}>
        <span>{props.text}</span>
      </div>
    </div>
  );
};

export default SystemMessage;
