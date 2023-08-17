import React from 'react';
import './index.less';

import { ISystemMessageProps } from '../type';

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
