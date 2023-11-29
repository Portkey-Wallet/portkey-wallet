import { useCallback, useState } from 'react';
import clsx from 'clsx';
import { useDisclaimer } from '@portkey-wallet/hooks/hooks-ca/disclaimer';
import { DisclaimerArrayType, ETRANS_DISCLAIMER_ARRAY } from '@portkey-wallet/constants/constants-ca/etrans';
import { Button, ModalProps, message } from 'antd';
import CustomSvg from 'components/CustomSvg';
import { useCommonState, useLoading } from 'store/Provider/hooks';
import CustomPromptModal from 'pages/components/CustomPromptModal';
import './index.less';

export interface IDisclaimerProps {
  disclaimerArr?: DisclaimerArrayType;
  policyId: string;
  originUrl: string;
  originTitle: string;
  titleText: string;
  agreeText?: string;
  confirmText?: string;
}

export interface IDisclaimerModalProps extends IDisclaimerProps, ModalProps {
  open: boolean;
  onClose: () => void;
}

const DisclaimerModal = ({
  onClose,
  open,
  policyId,
  originUrl,
  originTitle,
  titleText,
  disclaimerArr = ETRANS_DISCLAIMER_ARRAY,
  agreeText = 'I have read and agree to these terms.',
  confirmText = 'confirm',
  ...props
}: IDisclaimerModalProps) => {
  const { signPrivacyPolicy } = useDisclaimer();
  const [confirm, setConfirm] = useState<boolean>(false);
  const { isPrompt } = useCommonState();
  const { setLoading } = useLoading();

  const onConfirm = useCallback(async () => {
    try {
      setLoading(true);
      await signPrivacyPolicy({ policyId, origin: originUrl });
      const openWinder = window.open(originUrl, '_blank');
      isPrompt && onClose();
      if (openWinder) {
        openWinder.opener = null;
      }
    } catch (error) {
      message.error('Failed sign');
      console.log('===signPrivacyPolicy error', error);
    } finally {
      setLoading(false);
    }
  }, [isPrompt, onClose, originUrl, policyId, setLoading, signPrivacyPolicy]);

  const handleClose = useCallback(() => {
    setConfirm(false);
    onClose();
  }, [onClose]);

  return (
    <CustomPromptModal
      {...props}
      destroyOnClose
      open={open}
      wrapClassName={clsx(['disclaimer-modal-wrapper', isPrompt && 'isPrompt'])}
      onClose={handleClose}>
      <div className="disclaimer-modal flex-column">
        <div className="container flex-column">
          <CustomSvg type="Close2" onClick={handleClose} />
          <div className="disclaimer-modal-header flex-center">Disclaimer</div>
          <div className={clsx(['disclaimer-modal-content', 'flex-column', isPrompt && 'isPrompt'])}>
            <div className="disclaimer-detail flex-row-center">
              <CustomSvg type="BridgeFavicon" />
              <span className="origin">{originTitle}</span>
            </div>
            <div className="disclaimer-title">{titleText}</div>
            <div className="disclaimer-content flex-column" id="disclaimer-content">
              {disclaimerArr.map((ele, index) => (
                <div key={index} className={`content-${ele.type}`}>
                  {ele.content}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="footer">
          <div className="disclaimer-modal-footer flex-column">
            <div className="flex radio-container">
              <div className="click-container" onClick={() => setConfirm(!confirm)}>
                {confirm ? <CustomSvg type="RadioSelect" /> : <CustomSvg type="RadioUnSelect" />}
              </div>
              <div className="agree-text">{agreeText}</div>
            </div>
            <Button type="primary" className="disclaimer-btn" disabled={!confirm} onClick={onConfirm}>
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </CustomPromptModal>
  );
};

export default DisclaimerModal;
