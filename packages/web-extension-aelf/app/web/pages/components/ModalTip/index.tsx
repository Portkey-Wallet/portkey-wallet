import { Modal } from 'antd';
import CustomSvg from 'components/CustomSvg';
import './index.less';

interface ModalTipProps {
  onClose?: () => void;
  delay?: number;
  content?: string;
}
export default function ModalTip({ onClose, delay = 1000, content = 'successful' }: ModalTipProps) {
  setTimeout(() => {
    Modal.destroyAll();
    onClose && onClose();
  }, delay);

  const renderContent = (
    <div className="content flex-column-center">
      <CustomSvg type="SuccessBlue" />
      <div className="content-text">{content}</div>
    </div>
  );

  return Modal.success({
    className: 'success-modal-tip',
    centered: true,
    content: renderContent,
  });
}
