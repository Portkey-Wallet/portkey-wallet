import { Button } from 'antd';
import clsx from 'clsx';
import { useMemo } from 'react';
import './index.less';

export type ButtonGroupType = 'row' | 'col';
export type ButtonType = 'primary' | 'default';
export interface IModalContent {
  title: string;
  content: string;
  buttons?: {
    content: string;
    onClick: () => void;
    type: ButtonType;
  }[];
  buttonGroupType?: ButtonGroupType;
}

export default function ModalContent({ title, content, buttonGroupType, buttons = [] }: IModalContent) {
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
    <div className="modal-content flex-column">
      <div className="tip-title">{title}</div>
      <div className="tip-content">{content}</div>
      <div className="modal-button-wrap">{renderButton}</div>
    </div>
  );
}
