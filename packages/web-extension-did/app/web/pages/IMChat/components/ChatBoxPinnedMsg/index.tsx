import CustomSvg from 'components/CustomSvg';
import { useMemo } from 'react';
import ImageShow from '../ImageShow';
import './index.less';

export interface IChatBoxPinnedMsgProps {
  msgCount: number;
  msgType: 'text' | 'image';
  showClose?: boolean;
  onViewMore?: () => void;
  onClose?: () => void;
  children?: React.ReactNode;
}

const ChatBoxPinnedMsg = ({ msgCount = 3, msgType, onViewMore }: IChatBoxPinnedMsgProps) => {
  const renderText = useMemo(
    () => (
      <>
        <div className="content-title">{`Pinned Message ${msgCount}`}</div>
        <div className="content-pin-msg">Hi, Do you want to buy or sell some tokens? Buy tokens?</div>
      </>
    ),
    [msgCount],
  );
  const renderImage = useMemo(
    () => (
      <div className="image-content flex">
        <ImageShow src="https://lmg.jj20.com/up/allimg/4k/s/02/210924233115O14-0-lp.jpg" />
        <div>
          <div className="content-title">{`Pinned Message ${msgCount}`}</div>
          <div className="content-pin-msg">Photo</div>
        </div>
      </div>
    ),
    [msgCount],
  );
  return (
    <div className="chat-box-pinned-msg-container flex-between-center">
      <div className="container-content">{msgType === 'text' ? renderText : renderImage}</div>
      <div className="container-right-icon">
        <CustomSvg type="TopPin" onClick={onViewMore} />
      </div>
    </div>
  );
};
export default ChatBoxPinnedMsg;
