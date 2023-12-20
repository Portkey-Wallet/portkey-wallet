import { useMemo } from 'react';
import ImageShow from '../../components/ImageShow';
import CustomSvg from '../../components/CustomSvg';
import './index.less';

export interface IReplyMsgProps {
  msgType: 'text' | 'image';
  msgContent: string;
  toName: string;
}

export default function ReplyMsg({ msgType }: IReplyMsgProps) {
  const renderText = useMemo(
    () => (
      <>
        <div className="container-title">Reply to Guo</div>
        <div className="container-content">
          Hi, Do you want to buy or sell some tokens? Buy tokens want to buy or sell?
        </div>
      </>
    ),
    [],
  );
  const renderImage = useMemo(
    () => (
      <div className="reply-message-image flex-row-center">
        {/* <ImageShow src="httfdfdps://lmg.jj20.com/up/allimg/4k/s/02/210924233115O14-0-lp.jpg" /> */}
        <ImageShow src="https://lmg.jj20.com/up/allimg/4k/s/02/210924233115O14-0-lp.jpg" />
        <div>
          <div className="container-title">Reply to Guo</div>
          <div className="container-content">Photo</div>
        </div>
      </div>
    ),
    [],
  );

  return (
    <div className="input-bar-reply-message-body flex-between-center">
      <div className="reply-message-container">{msgType === 'text' ? renderText : renderImage}</div>
      <CustomSvg type="Close" />
    </div>
  );
}
