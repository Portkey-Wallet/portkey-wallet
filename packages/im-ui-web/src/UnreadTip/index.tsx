import React from 'react';
import clsx from 'clsx';
import { ZERO } from '../utils';
import { IUnreadTipProps } from '../type';
import './index.less';

const UnreadTip: React.FC<IUnreadTipProps> = ({ unread, muted, bgColorString }) => {
  return (
    <div
      className={clsx(['portkey-unread-tip', 'flex-center', muted && 'muted'])}
      style={{ background: bgColorString }}>
      {ZERO.plus(unread).isGreaterThanOrEqualTo(100) ? '99+' : unread}
    </div>
  );
};
export default UnreadTip;
