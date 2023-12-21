import CustomSvg from 'components/CustomSvg';
import { useMemo } from 'react';
import ImageShow from '../ImageShow';
import './index.less';
import { MessageType, MessageTypeEnum } from '@portkey-wallet/im';

export interface IChatBoxPinnedMsgProps {
  msgCount: number;
  msgContent: string;
  msgType: MessageType;
  onViewMore?: () => void;
}

const ChatBoxPinnedMsg = ({ msgCount, msgType, msgContent, onViewMore }: IChatBoxPinnedMsgProps) => {
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
        <ImageShow src={msgContent} />
        <div>
          <div className="content-title">{`Pinned Message ${msgCount}`}</div>
          <div className="content-pin-msg">Photo</div>
        </div>
      </div>
    ),
    [msgContent, msgCount],
  );
  return (
    <div className="chat-box-pinned-msg-container flex-between-center">
      <div className="container-content">{msgType === MessageTypeEnum.TEXT ? renderText : renderImage}</div>
      <div className="container-right-icon">
        <CustomSvg type="TopPin" onClick={onViewMore} />
      </div>
    </div>
  );
};
export default ChatBoxPinnedMsg;
