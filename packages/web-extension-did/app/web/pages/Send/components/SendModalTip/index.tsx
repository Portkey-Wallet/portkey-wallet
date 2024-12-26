import { CommonModal } from '@portkey/did-ui-react';
import { CustomSvgV3 } from 'components/CustomSvgV3';
import { useMemo } from 'react';
import { Button } from 'antd';
import clsx from 'clsx';
import './index.less';

export interface ISendTipContent {
  title: string;
  content: string;
  onClose: () => void;
}

export function SendTipContent({ title, content, onClose }: ISendTipContent) {
  return (
    <div className="send-modal-content flex-column">
      <div className="tip-icon flex-between-center">
        <CustomSvgV3 type="error" />
        <CustomSvgV3 type="close thin" onClick={onClose} />
      </div>
      <div className="tip-title">{title}</div>
      <div className="tip-content">{content}</div>
    </div>
  );
}

export type ButtonGroupType = 'row' | 'col';
export type ButtonType = 'primary' | 'default';

export interface ISendModalTip extends ISendTipContent {
  open: boolean;
  buttons: {
    content: string;
    onClick: () => void;
    type: ButtonType;
  }[];
  buttonGroupType?: ButtonGroupType;
}

export default function SendModalTip({
  open,
  buttons,
  title,
  content,
  onClose,
  buttonGroupType = 'row',
}: ISendModalTip) {
  const [b1, b2] = buttons;
  const renderButton = useMemo(() => {
    return buttons.length === 1 ? (
      <Button type={b1.type} onClick={b1.onClick} block>
        {b1.content}
      </Button>
    ) : (
      <div className={clsx(buttonGroupType === 'row' ? 'flex' : 'flex-column', 'gap-16')}>
        <Button type={b1.type} onClick={b1.onClick} block>
          {b1.content}
        </Button>
        <Button type={b2.type} onClick={b2.onClick} block>
          {b2.content}
        </Button>
      </div>
    );
  }, [b1.content, b1.onClick, b1.type, b2.content, b2.onClick, b2.type, buttonGroupType, buttons.length]);
  return (
    <CommonModal open={open}>
      <div className="send-modal-tip">
        <SendTipContent title={title} content={content} onClose={onClose} />
        <div className="send-modal-button">{renderButton}</div>
      </div>
    </CommonModal>
  );
}
