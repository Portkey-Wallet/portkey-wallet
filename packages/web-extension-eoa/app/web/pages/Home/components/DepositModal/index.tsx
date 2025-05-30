import { ModalProps } from 'antd';
import CustomPromptModal from 'pages/components/CustomPromptModal';
import DepositList, { IDepositListProps } from '../DepositList';
import './index.less';

interface IDepositModalProps extends IDepositListProps, ModalProps {
  onClose: () => void;
}

export default function DepositModal({ onClose, onClickBridge, onClickETrans, ...props }: IDepositModalProps) {
  return (
    <CustomPromptModal
      destroyOnClose
      {...props}
      wrapClassName="deposit-modal"
      maskClosable={true}
      closable={false}
      centered={true}
      onClose={onClose}
      footer={null}>
      <DepositList onClose={onClose} onClickBridge={onClickBridge} onClickETrans={onClickETrans} />
    </CustomPromptModal>
  );
}
