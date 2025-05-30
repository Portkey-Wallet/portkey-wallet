import CustomSvg from 'components/CustomSvg';
import { useMemo } from 'react';
import ImageShow from '../ImageShow';
import { MessageType, MessageTypeEnum } from '@portkey-wallet/im';
import './index.less';

export interface IChatBoxPinnedMsgProps {
  msgCount: number;
  msgContent?: string;
  thumbImgUrl?: string;
  imgUrl?: string;
  msgType: MessageType;
  onViewMore?: () => void;
}

const ChatBoxPinnedMsg = ({
  msgCount,
  msgType,
  msgContent = '',
  onViewMore,
  thumbImgUrl = '',
  imgUrl = '',
}: IChatBoxPinnedMsgProps) => {
  const renderText = useMemo(
    () => (
      <>
        <div className="content-title">{`Pinned Message ${msgCount}`}</div>
        <div className="content-pin-msg">{msgContent}</div>
      </>
    ),
    [msgContent, msgCount],
  );
  const renderImage = useMemo(
    () => (
      <div className="image-content flex">
        <ImageShow src={thumbImgUrl || imgUrl} fallback={imgUrl} preview={false} />
        <div>
          <div className="content-title">{`Pinned Message ${msgCount}`}</div>
          <div className="content-pin-msg">Photo</div>
        </div>
      </div>
    ),
    [imgUrl, msgCount, thumbImgUrl],
  );
  return (
    <div className="chat-box-pinned-msg-container flex-between-center" onClick={onViewMore}>
      <div className="container-content">{msgType === MessageTypeEnum.TEXT ? renderText : renderImage}</div>
      <div className="container-right-icon">
        <CustomSvg type="TopPin" />
      </div>
    </div>
  );
};
export default ChatBoxPinnedMsg;
