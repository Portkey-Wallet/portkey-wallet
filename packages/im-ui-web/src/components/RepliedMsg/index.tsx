import ImageShow from '../ImageShow';
import { useMemo } from 'react';
import clsx from 'clsx';
import { MessageTypeEnum } from '@portkey-wallet/im/types';
import './index.less';

export interface IRepliedMsgProps {
  position: string;
  msgType?: MessageTypeEnum.IMAGE | MessageTypeEnum.TEXT;
  msgContent?: string;
  from?: string;
}

export default function RepliedMsg({ msgType, from, msgContent, position }: IRepliedMsgProps) {
  const renderDefault = useMemo(
    () => (
      <>
        <div className="container-desc hide-msg">The message has been hidden.</div>
      </>
    ),
    [],
  );
  const renderText = useMemo(
    () => (
      <>
        <div className="container-title">{from}</div>
        <div className="container-desc">{msgContent}</div>
      </>
    ),
    [from, msgContent],
  );
  const renderImage = useMemo(
    () => (
      <div className="reply-message-image flex-row-center">
        <ImageShow src={msgContent!} />
        <div>
          <div className="container-title">{from}</div>
          <div className="container-desc">Photo</div>
        </div>
      </div>
    ),
    [from, msgContent],
  );
  const renderContent = useMemo(() => {
    if (!msgType) {
      return renderDefault;
    }
    return msgType === MessageTypeEnum.TEXT ? renderText : renderImage;
  }, [msgType, renderDefault, renderImage, renderText]);

  return (
    <div className="reply-message-body">
      <div className={clsx('reply-message-container flex', position)}>
        <div className="container-left"></div>
        <div className="container-content">{renderContent}</div>
      </div>
    </div>
  );
}
