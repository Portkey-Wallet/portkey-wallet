import { ButtonGroup, CommonButton } from '@portkey/did-ui-react';
// import BaseDrawer from 'components/BaseDrawer';
import BaseModal from 'components/BaseModal';
import { CustomSvgV3 } from 'components/CustomSvgV3';
import { useMemo } from 'react';

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
        <CustomSvgV3 type="close" onClick={onClose} />
      </div>
      <div className="tip-title">{title}</div>
      <div className="tip-content">{content}</div>
    </div>
  );
}

export type ButtonGroupType = 'row' | 'col';

// TODO-SA
export type CommonButtonType =
  | 'default'
  | 'primary'
  | 'ghost'
  | 'dashed'
  | 'link'
  | 'text'
  | 'outline'
  | 'primaryOutline'
  | 'danger';

export interface ISendModalTip extends ISendTipContent {
  open: boolean;
  buttons: {
    content: string;
    onClick: () => void;
    type: CommonButtonType;
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
  const [b1] = buttons;
  const renderButton = useMemo(() => {
    return buttons.length === 1 ? (
      <CommonButton type={b1.type} onClick={b1.onClick} block>
        {b1.content}
      </CommonButton>
    ) : (
      <ButtonGroup type={buttonGroupType} buttons={buttons} />
    );
  }, [b1, buttonGroupType, buttons]);
  return (
    <BaseModal centered footer={null} open={open}>
      <div className="send-modal-tip">
        <SendTipContent title={title} content={content} onClose={onClose} />
        <div className="send-modal-button">{renderButton}</div>
      </div>
    </BaseModal>

    // <BaseDrawer footer={null} open={open}>
    //   <div className="send-modal-tip">
    //     <SendTipContent title={title} content={content} onClose={onClose} />
    //     <div className="send-modal-button">{renderButton}</div>
    //   </div>
    // </BaseDrawer>
  );
}
