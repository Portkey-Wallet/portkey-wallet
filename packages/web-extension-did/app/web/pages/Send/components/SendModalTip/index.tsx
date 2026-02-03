import { CommonModal } from '@portkey/did-ui-react';
import { CustomSvgV3 } from 'components/CustomSvgV3';
import { ReactNode, useMemo } from 'react';
import { Button } from 'antd';
import clsx from 'clsx';
import './index.less';

export interface ISendTipContent {
  title: string;
  content: ReactNode;
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
  const renderButton = useMemo(() => {
    if (buttons.length === 1) {
      const b1 = buttons[0];
      return (
        <Button type={b1.type} onClick={b1.onClick} block>
          {b1.content}
        </Button>
      );
    }
    return (
      <div className={clsx(buttonGroupType === 'row' ? 'flex' : 'flex-column', 'gap-16')}>
        {buttons.map((btn, index) => (
          <Button key={index} type={btn.type} onClick={btn.onClick} block>
            {btn.content}
          </Button>
        ))}
      </div>
    );
  }, [buttonGroupType, buttons]);
  return (
    <CommonModal open={open}>
      <div className="send-modal-tip">
        <SendTipContent title={title} content={content} onClose={onClose} />
        <div className="send-modal-button">{renderButton}</div>
      </div>
    </CommonModal>
  );
}
