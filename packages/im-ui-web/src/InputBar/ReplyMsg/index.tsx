import { useMemo } from 'react';
import ImageShow from '../../components/ImageShow';
import CustomSvg from '../../components/CustomSvg';
import { IInputReplyMsgProps } from '../../type';
import { MessageTypeEnum } from '@portkey-wallet/im/types';
import './index.less';

export default function ReplyMsg({ msgType, msgContent, toName, onCloseReply }: IInputReplyMsgProps) {
  const renderText = useMemo(
    () => (
      <>
        <div className="container-title">{`Reply to ${toName}`}</div>
        <div className="container-content">{msgContent}</div>
      </>
    ),
    [msgContent, toName],
  );
  const renderImage = useMemo(
    () => (
      <div className="reply-message-image flex-row-center">
        <ImageShow src={msgContent} />
        <div>
          <div className="container-title">{`Reply to ${toName}`}</div>
          <div className="container-content">Photo</div>
        </div>
      </div>
    ),
    [msgContent, toName],
  );

  return (
    <div className="input-bar-reply-message-body flex-between-center">
      <div className="reply-message-container">{msgType === MessageTypeEnum.TEXT ? renderText : renderImage}</div>
      <CustomSvg type="Close" onClick={onCloseReply} />
    </div>
  );
}
