import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Popover } from 'antd';
import clsx from 'clsx';
import { IRedPacketMessageProps } from '../type';
import { formatTime } from '../utils';
import PopoverMenuList from '../PopoverMenuList';
import CustomSvg from '../components/CustomSvg';
import { RedPacketTextByMine, RedPacketTextByOthers } from '../constants';
import './index.less';

const RedPacketMessage: React.FC<IRedPacketMessageProps> = (props) => {
  const showDate = useMemo(
    () => (props.dateString ? props.dateString : formatTime(props.date as any)),
    [props.date, props.dateString],
  );
  const [popVisible, setPopVisible] = useState(false);
  const hidePop = useCallback(() => {
    setPopVisible(false);
  }, []);
  const popoverList = useMemo(
    () => [
      {
        key: 'delete',
        leftIcon: <CustomSvg type="Delete" />,
        children: 'Delete',
        onClick: (e: React.MouseEvent<HTMLElement>) => props?.onDeleteMsg?.(e),
      },
    ],
    [props],
  );
  const renderContainer = useMemo(() => {
    const redPacketText = props.position === 'right' ? RedPacketTextByMine : RedPacketTextByOthers;
    return (
      <div className={clsx(['red-packet-body', 'flex', props.position])}>
        <div className="text-red-packet">
          {redPacketText}
          <span className="text-red-packet-hidden">{showDate}</span>
        </div>
        <div className="red-packet-date">{showDate}</div>
      </div>
    );
  }, [props.position, showDate]);
  useEffect(() => {
    document.addEventListener('click', hidePop);
    return () => document.removeEventListener('click', hidePop);
  }, [hidePop]);
  return (
    <div className="portkey-message-red-packet">
      {props.position === 'right' ? (
        <Popover
          open={popVisible}
          overlayClassName={clsx(['message-red-packet-popover', props.position])}
          placement="bottom"
          trigger="contextMenu"
          onOpenChange={(visible) => setPopVisible(visible)}
          showArrow={false}
          content={<PopoverMenuList data={popoverList} />}>
          {renderContainer}
        </Popover>
      ) : (
        renderContainer
      )}
    </div>
  );
};

export default RedPacketMessage;
