import ImageShow from '../ImageShow';
import { useMemo } from 'react';
import clsx from 'clsx';
import './index.less';

export interface IRepliedMsgProps {
  position: 'left' | 'right';
  msgType: 'text' | 'image';
  msgContent: string;
  from: string;
}

export default function RepliedMsg({ msgType }: IRepliedMsgProps) {
  const renderText = useMemo(
    () => (
      <>
        <div className="container-title">Guo</div>
        <div className="container-desc">
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
          <div className="container-title">Guo</div>
          <div className="container-desc">Photo</div>
        </div>
      </div>
    ),
    [],
  );

  return (
    <div className="reply-message-body">
      <div className={clsx('reply-message-container flex', 'right')}>
        <div className="container-left"></div>
        <div className="container-content">{msgType === 'text' ? renderText : renderImage}</div>
      </div>
    </div>
  );
}
