import React, { useMemo } from 'react';
import clsx from 'clsx';
import { IMessage, MessagePositionEnum } from '../type';
import { formatTime } from '../utils';
import { RedPacketTextByMine, RedPacketTextByOthers } from '../constants';
import './index.less';

const RedPacketMessage: React.FC<IMessage> = (props) => {
  const { createAt } = props;
  const showDate = useMemo(
    () => (props.dateString ? props.dateString : formatTime(createAt)),
    [createAt, props.dateString],
  );
  const renderContainer = useMemo(() => {
    const redPacketText = props.position === MessagePositionEnum.right ? RedPacketTextByMine : RedPacketTextByOthers;
    return (
      <div className={clsx(['red-packet-body', 'flex', props.position])}>
        <div className="text-red-packet">
          {redPacketText}
          <span className="red-packet-date-hidden">{showDate}</span>
        </div>
        <div className="red-packet-date">{showDate}</div>
      </div>
    );
  }, [props.position, showDate]);
  return <div className="portkey-message-red-packet">{renderContainer}</div>;
};

export default RedPacketMessage;
