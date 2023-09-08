import { useCallback, useEffect, useState } from 'react';
import AElf from 'aelf-sdk';
import clsx from 'clsx';
import { useDisclaimer } from '@portkey-wallet/hooks/hooks-ca/disclaimer';
import { EBRIDGE_DISCLAIMER_ARRAY, EBRIDGE_DISCLAIMER_TEXT } from '@portkey-wallet/constants/constants-ca/ebridge';
import { Button, Modal, ModalProps, message } from 'antd';
import CustomSvg from 'components/CustomSvg';
import ImageDisplay from 'pages/components/ImageDisplay';
import { getFaviconUrl } from '@portkey-wallet/utils/dapp/browser';
import { useCommonState, useLoading } from 'store/Provider/hooks';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { sleep } from '@portkey-wallet/utils';
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
  const { eBridgeUrl = '' } = useCurrentNetworkInfo();
  const { setLoading } = useLoading();

  const onConfirm = useCallback(async () => {
    try {
      setLoading(true);
      const policyId = AElf.utils.sha256(EBRIDGE_DISCLAIMER_TEXT);
      await signPrivacyPolicy({ policyId, origin: eBridgeUrl });
      const openWinder = window.open(eBridgeUrl, '_blank');
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
  }, [eBridgeUrl, isPrompt, onClose, setLoading, signPrivacyPolicy]);

  const handleDisclaimerScroll = useCallback(() => {
    if (!read) {
      const ele = document.querySelector('#disclaimer-content');
      if (ele) {
        const _isBottom = ele?.scrollHeight - ele?.scrollTop === ele?.clientHeight;
        if (_isBottom) {
          setRead(true);
          ele.removeEventListener('scroll', handleDisclaimerScroll);
        }
      }
    }
  }, [read]);

  const test = useCallback(async () => {
    if (open) {
      await sleep(200);
      const modalTarget = document.querySelector('#disclaimer-content');
      if (modalTarget) {
        modalTarget.addEventListener('scroll', handleDisclaimerScroll);
      }
    }
  }, [handleDisclaimerScroll, open]);

  useEffect(() => {
    test();
    return () => {
      const modalTarget = document.querySelector('#disclaimer-content');
      if (modalTarget) {
        modalTarget.removeEventListener('scroll', handleDisclaimerScroll);
      }
    };
  }, [handleDisclaimerScroll, read, open, test]);
  return (
    <Modal
      {...props}
      destroyOnClose
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
                src={getFaviconUrl(eBridgeUrl)}
                backupSrc="DappDefault"
              />
              <span className="origin">{eBridgeUrl}</span>
            </div>
            <div className="bridge-title">
              You will be redirected to eBridge, a third-party cross-chain bridge on aelf.
            </div>
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
