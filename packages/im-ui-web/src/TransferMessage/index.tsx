import React, { useMemo } from 'react';
import clsx from 'clsx';
import { IMessage } from '../type';
import { formatTime } from '../utils';
import { TransferTextByMine, TransferTextToMe, TransferTextToOther } from '../constants';
import { ParsedTransfer } from '@portkey-wallet/im';
import './index.less';

const TransferMessage: React.FC<IMessage> = (props) => {
  const { createAt, dateString, parsedContent, position, isGroup, myPortkeyId } = props;
  const { data } = (parsedContent as ParsedTransfer) || {};
  const showDateStr = useMemo(() => dateString || formatTime(createAt), [createAt, dateString]);
  const transferText = useMemo(() => {
    if (position === 'right') return TransferTextByMine;
    if (isGroup) {
      if (data?.toUserId === myPortkeyId) {
        return TransferTextToMe;
      } else {
        return TransferTextToOther;
      }
    } else {
      return TransferTextToMe;
    }
  }, [data?.toUserId, isGroup, myPortkeyId, position]);
  const renderContainer = useMemo(() => {
    return (
      <div className={clsx(['transfer-body', 'flex', position])}>
        <div className="text-transfer">
          {transferText}
          <span className="transfer-date-hidden">{showDateStr}</span>
        </div>
        <div className="transfer-date">{showDateStr}</div>
      </div>
    );
  }, [position, showDateStr, transferText]);
  return <div className="portkey-message-transfer">{renderContainer}</div>;
};

export default TransferMessage;
