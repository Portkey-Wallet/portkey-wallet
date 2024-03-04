import { useCallback, useState } from 'react';
import { Button, ModalProps } from 'antd';
import CustomSvg from 'components/CustomSvg';
import CustomPromptModal from 'pages/components/CustomPromptModal';
import {
  RECEIVE_SIDE_CHAIN_TOKEN_TIP_TITLE,
  RECEIVE_SIDE_CHAIN_TOKEN_TIP_CONTENT,
  RECEIVE_SIDE_CHAIN_TOKEN_TIP_MODAL_REMEMBER_TEXT,
  RECEIVE_SIDE_CHAIN_TOKEN_TIP_MODAL_BUTTON_TEXT,
} from '@portkey-wallet/constants/constants-ca/send';
import { useSideChainTokenReceiveTipSetting } from '@portkey-wallet/hooks/hooks-ca/misc';
import './index.less';

export interface IReceiveTipModalProps extends ModalProps {
  open: boolean;
  onClose: () => void;
}

const ReceiveTipModal = ({ open, onClose, ...props }: IReceiveTipModalProps) => {
  const [confirm, setConfirm] = useState<boolean>(false);
  const { cancelSideChainTokenReceiveTip } = useSideChainTokenReceiveTipSetting();

  const handleClose = useCallback(() => {
    setConfirm(false);
    onClose();
  }, [onClose]);

  const handleConfirm = useCallback(() => {
    if (confirm) {
      cancelSideChainTokenReceiveTip();
    }
    onClose();
  }, [cancelSideChainTokenReceiveTip, confirm, onClose]);

  return (
    <CustomPromptModal
      {...props}
      destroyOnClose
      maskClosable={false}
      open={open}
      wrapClassName="receive-modal-wrapper"
      onClose={handleClose}>
      <div className="receive-modal flex-column">
        <div className="container flex-column">
          <div className="receive-modal-header flex-center">{RECEIVE_SIDE_CHAIN_TOKEN_TIP_TITLE}</div>
          <div className="receive-modal-content flex-column">
            {RECEIVE_SIDE_CHAIN_TOKEN_TIP_CONTENT.map((item, i) => (
              <div key={i} className="content-item">
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="footer">
          <div className="receive-modal-footer flex-column">
            <div className="flex radio-container">
              <div className="click-container" onClick={() => setConfirm(!confirm)}>
                {confirm ? <CustomSvg type="RadioSelect" /> : <CustomSvg type="RadioUnSelect" />}
              </div>
              <div className="remember-text">{RECEIVE_SIDE_CHAIN_TOKEN_TIP_MODAL_REMEMBER_TEXT}</div>
            </div>
            <Button type="primary" className="receive-btn" onClick={handleConfirm}>
              {RECEIVE_SIDE_CHAIN_TOKEN_TIP_MODAL_BUTTON_TEXT}
            </Button>
          </div>
        </div>
      </div>
    </CustomPromptModal>
  );
};

export default ReceiveTipModal;
