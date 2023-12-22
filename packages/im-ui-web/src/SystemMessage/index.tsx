import React, { useMemo } from 'react';
import { ExtraMessageTypeEnum, MessageContentType } from '../type';
import { MessageTypeEnum, ParsedPinSys } from '@portkey-wallet/im/types';
import { PIN_OPERATION_TYPE_ENUM } from '@portkey-wallet/im/types/pin';
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
      const { userInfo, pinType, parsedContent: content, messageType } = parsedContent as ParsedPinSys;
      const msgContent = messageType === MessageTypeEnum.IMAGE ? 'Photo' : (content as string);
      if (pinType === PIN_OPERATION_TYPE_ENUM.Pin) {
        return (
          <div className="portkey-system-pin flex-center">
            <span className="pin-msg-user">{userInfo.name}</span>
            <span>{`pinned`}</span>
            <span className="pin-msg-content">{`"${msgContent}"`}</span>
          </div>
        );
      }
      if (pinType === PIN_OPERATION_TYPE_ENUM.UnPin) {
        return (
          <div className="portkey-system-pin flex-center">
            <span className="pin-msg-content">{`"${msgContent}"`}</span>
            <span>{`unpinned`}</span>
          </div>
        );
      }
      if (pinType === PIN_OPERATION_TYPE_ENUM.RemoveAll) {
        return <div className="portkey-system-pin flex-center">{`All X messages unpinned`}</div>;
      }
      return <>{pinType}</>;
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
