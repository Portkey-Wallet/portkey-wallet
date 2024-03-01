import { useCallback, useState } from 'react';
import clsx from 'clsx';
import { useDisclaimer } from '@portkey-wallet/hooks/hooks-ca/disclaimer';
import { Button, ModalProps } from 'antd';
import CustomSvg from 'components/CustomSvg';
import { useCommonState, useLoading } from 'store/Provider/hooks';
import CustomPromptModal from 'pages/components/CustomPromptModal';
import {
  EBRIDGE_DISCLAIMER_ARRAY,
  EBRIDGE_DISCLAIMER_TEXT_SHARE256_POLICY_ID,
} from '@portkey-wallet/constants/constants-ca/ebridge';
import { SvgType } from 'components/CustomSvg';
import singleMessage from 'utils/singleMessage';
import './index.less';

export interface IDisclaimerProps {
  originUrl: string;
  targetUrl: string;
  originTitle: string;
  titleText: string;
  agreeText?: string;
  confirmText?: string;
  dappIcon: SvgType;
}

export const initDisclaimerData: IDisclaimerProps = {
  originUrl: '',
  targetUrl: '',
  originTitle: '',
  titleText: '',
  dappIcon: 'BridgeFavicon',
};

export interface IDisclaimerModalProps extends IDisclaimerProps, ModalProps {
  open: boolean;
  onClose: () => void;
  onCloseDepositModal?: () => void;
}

const DisclaimerModal = ({
  onClose,
  onCloseDepositModal,
  open,
  originUrl,
  targetUrl,
  originTitle,
  titleText,
  dappIcon = 'BridgeFavicon',
  agreeText = 'I have read and agree to the terms.',
  confirmText = 'Continue',
  ...props
}: IDisclaimerModalProps) => {
  const { signPrivacyPolicy } = useDisclaimer();
  const [confirm, setConfirm] = useState<boolean>(false);
  const { isPrompt } = useCommonState();
  const { setLoading } = useLoading();

  const onConfirm = useCallback(async () => {
    try {
      setLoading(true);
      await signPrivacyPolicy({ policyId: EBRIDGE_DISCLAIMER_TEXT_SHARE256_POLICY_ID, origin: originUrl });
      const openWinder = window.open(targetUrl, '_blank');
      if (isPrompt) {
        onClose();
        onCloseDepositModal?.();
      }
      if (openWinder) {
        openWinder.opener = null;
      }
      setConfirm(false);
    } catch (error) {
      singleMessage.error('Failed sign');
      console.log('===signPrivacyPolicy error', error);
    } finally {
      setLoading(false);
    }
  }, [isPrompt, onClose, originUrl, setLoading, signPrivacyPolicy, onCloseDepositModal, targetUrl]);

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
              <CustomSvg type={dappIcon} />
              <span className="origin">{originTitle}</span>
            </div>
            <div className="disclaimer-title">{titleText}</div>
            <div className="disclaimer-content flex-column" id="disclaimer-content">
              {EBRIDGE_DISCLAIMER_ARRAY.map((ele, index) => (
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
