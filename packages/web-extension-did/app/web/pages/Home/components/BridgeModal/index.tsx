import { useCallback, useEffect, useMemo, useState } from 'react';
import AElf from 'aelf-sdk';
import clsx from 'clsx';
import { useDisclaimer } from '@portkey-wallet/hooks/hooks-ca/disclaimer';
import {
  EBRIDGE_DISCLAIMER_ARRAY,
  EBRIDGE_DISCLAIMER_TEXT,
  EBRIDGE_ORIGIN,
} from '@portkey-wallet/constants/constants-ca/ebridge';
import { Button, Modal, ModalProps, message } from 'antd';
import CustomSvg from 'components/CustomSvg';
import ImageDisplay from 'pages/components/ImageDisplay';
import { getFaviconUrl } from '@portkey-wallet/utils/dapp/browser';
import { useCommonState } from 'store/Provider/hooks';
import './index.less';

export interface IBridgeModalProps extends ModalProps {
  open: boolean;
  onClose: () => void;
}

const BridgeModal = ({ onClose, open, ...props }: IBridgeModalProps) => {
  const { signPrivacyPolicy } = useDisclaimer();
  const [read, setRead] = useState<boolean>(false);
  const [confirm, setConfirm] = useState<boolean>(false);
  const { isPrompt } = useCommonState();
  const observer = useMemo(
    () =>
      new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          setRead(true);
        }
      }),
    [],
  );

  const onConfirm = useCallback(async () => {
    try {
      const policyId = AElf.utils.sha256(EBRIDGE_DISCLAIMER_TEXT);
      await signPrivacyPolicy({ policyId, origin: EBRIDGE_ORIGIN });
      const openWinder = window.open(EBRIDGE_ORIGIN, '_blank');
      isPrompt && onClose();
      if (openWinder) {
        openWinder.opener = null;
      }
    } catch (error) {
      message.error('Failed sign');
      console.log('===signPrivacyPolicy error', error);
    }
  }, [isPrompt, onClose, signPrivacyPolicy]);

  useEffect(() => {
    const target = document.querySelector('#disclaimer-content-bottom');
    if (read) {
      observer.unobserve(target!);
    } else {
      observer.observe(target!);
    }
    return () => observer.unobserve(target!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [read]);
  return (
    <Modal
      {...props}
      open={open}
      wrapClassName={clsx(['bridge-disclaimer-modal', isPrompt && 'isPrompt'])}
      maskClosable={true}
      closable={false}
      centered={true}
      onCancel={onClose}
      footer={null}>
      <div className="bridge-modal flex-column">
        <div className="container flex-column">
          <CustomSvg type="Close2" onClick={onClose} />
          <div className="bridge-modal-header flex-center">Disclaimer</div>
          <div className={clsx(['bridge-modal-content', 'flex-column', isPrompt && 'isPrompt'])}>
            <div className="bridge-detail flex-center">
              <ImageDisplay
                defaultHeight={24}
                className="icon"
                src={getFaviconUrl(EBRIDGE_ORIGIN)}
                backupSrc="DappDefault"
              />
              <span className="origin">{EBRIDGE_ORIGIN}</span>
            </div>
            <div className="bridge-title">
              You will be redirected to eBridge, a third-party cross-chain bridge on aelf.
            </div>
            <div className="disclaimer-content flex-column">
              {EBRIDGE_DISCLAIMER_ARRAY.map((ele, index) => (
                <div key={index} className={`content-${ele.type}`}>
                  {ele.content}
                  {index === EBRIDGE_DISCLAIMER_ARRAY.length - 1 && <span id="disclaimer-content-bottom"></span>}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="footer">
          <div className="bridge-modal-footer flex-column">
            <div className="flex radio-container">
              {read ? (
                <div className="enabled-container" onClick={() => setConfirm(!confirm)}>
                  {confirm ? <CustomSvg type="RadioSelect" /> : <CustomSvg type="RadioUnSelect" />}
                </div>
              ) : (
                <div className="disable-pointer">
                  <CustomSvg type="RadioUnSelect" />
                </div>
              )}
              <div className="agree-text">I have read and agree to these terms.</div>
            </div>
            <Button type="primary" className="disclaimer-btn" disabled={!confirm} onClick={onConfirm}>
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default BridgeModal;
