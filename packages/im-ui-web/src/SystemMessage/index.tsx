import React, { useMemo } from 'react';
import { ExtraMessageTypeEnum, MessageContentType } from '../type';
import { MessageTypeEnum, ParsedPinSys } from '@portkey-wallet/im/types';
import { formatPinSysMessageToStr } from '@portkey-wallet/utils/chat';
import './index.less';

const SystemMessage: React.FC<MessageContentType> = (props) => {
  const { type, subType, parsedContent } = props;

  const renderContent = useMemo(() => {
    if (subType === ExtraMessageTypeEnum['DATE-SYS-MSG']) {
      return (
        <div className="portkey-system-date">
          <div>{parsedContent as string}</div>
        </div>
      );
    }
    if (type === MessageTypeEnum.PIN_SYS) {
      const pinSysContent = formatPinSysMessageToStr(parsedContent as ParsedPinSys);
      return (
        <div className="portkey-system-pin">
          <div>{pinSysContent}</div>
        </div>
      );
    }
    return (
      <div className="portkey-system-default">
        <div>{parsedContent as string}</div>
      </div>
    );
  }, [parsedContent, subType, type]);

  return <div className="portkey-container-system flex">{renderContent}</div>;
};

export default SystemMessage;
