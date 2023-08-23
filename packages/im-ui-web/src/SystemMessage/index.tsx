import React from 'react';

import { ISystemMessageProps } from '../type';
import './index.less';

const SystemMessage: React.FC<ISystemMessageProps> = props => {
  return (
    <div className="portkey-container-system flex">
      <div className="portkey-system-text">
        <span>{props.text}</span>
      </div>
    </div>
  );
};

export default SystemMessage;
