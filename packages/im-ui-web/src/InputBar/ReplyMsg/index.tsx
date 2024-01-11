import { useMemo } from 'react';
import ImageShow from '../../components/ImageShow';
import CustomSvg from '../../components/CustomSvg';
import { IInputReplyMsgProps } from '../../type';
import { MessageTypeEnum } from '@portkey-wallet/im/types';
import './index.less';

export default function ReplyMsg({
  msgType,
  msgContent = '',
  toName,
  thumbImgUrl = '',
  imgUrl = '',
  onCloseReply,
}: IInputReplyMsgProps) {
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
        <ImageShow src={thumbImgUrl || imgUrl} fallback={imgUrl} preview={false} />
        <div>
          <div className="container-title">{`Reply to ${toName}`}</div>
          <div className="container-content">Photo</div>
        </div>
      </div>
    ),
    [imgUrl, thumbImgUrl, toName],
  );

  return (
    <div className="input-bar-reply-message-body flex-between-center">
      <div className="reply-message-container">{msgType === MessageTypeEnum.TEXT ? renderText : renderImage}</div>
      <CustomSvg type="Close2" onClick={onCloseReply} />
    </div>
  );
}
