import ImageShow from '../ImageShow';
import { useMemo } from 'react';
import clsx from 'clsx';
import { MessageTypeEnum } from '@portkey-wallet/im/types';
import './index.less';

export interface IRepliedMsgProps {
  position: string;
  msgType: MessageTypeEnum.IMAGE | MessageTypeEnum.TEXT;
  msgContent?: string;
  thumbImgUrl?: string;
  imgUrl?: string;
  from?: string;
}

export default function RepliedMsg({ msgType, from, msgContent, position, thumbImgUrl, imgUrl }: IRepliedMsgProps) {
  const renderText = useMemo(
    () => (
      <>
        <div className="container-title">{from}</div>
        <div className={clsx('container-desc', !from && 'hide-msg')}>{msgContent}</div>
      </>
    ),
    [from, msgContent],
  );
  const renderImage = useMemo(
    () => (
      <div className="reply-message-image flex-row-center">
        <ImageShow src={thumbImgUrl || imgUrl || ''} fallback={imgUrl} preview={false} />
        <div>
          <div className="container-title">{from}</div>
          <div className="container-desc">Photo</div>
        </div>
      </div>
    ),
    [from, imgUrl, thumbImgUrl],
  );

  return (
    <div className="reply-message-body">
      <div className={clsx('reply-message-container flex', position)}>
        <div className="container-left"></div>
        <div className="container-content">{msgType === MessageTypeEnum.TEXT ? renderText : renderImage}</div>
      </div>
    </div>
  );
}
