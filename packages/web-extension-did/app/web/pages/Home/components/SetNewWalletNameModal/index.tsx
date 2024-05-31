import { useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import { useSetNewWalletName } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { handleErrorMessage } from '@portkey-wallet/utils';
import singleMessage from 'utils/singleMessage';
import './index.less';

const SET_NEW_WALLET_NAME_MODAL_WIDTH = 320;

export default function SetNewWalletNameModal() {
  const { shouldShowSetNewWalletNameModal, handleSetNewWalletName, handleCancelSetNewWalletNameModal } =
    useSetNewWalletName();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (shouldShowSetNewWalletNameModal) {
      setIsOpen(true);
    }
  }, [shouldShowSetNewWalletNameModal]);

  const handleConfirm = async () => {
    await handleSetNewWalletName().catch((error) => {
      const msg = handleErrorMessage(error);
      singleMessage.error(msg);
    });
    setIsOpen(false);
  };

  const handleCancel = async () => {
    await handleCancelSetNewWalletNameModal().catch((error) => {
      const msg = handleErrorMessage(error);
      singleMessage.error(msg);
    });
    setIsOpen(false);
  };

  return (
    <Modal
      wrapClassName="set-new-waller-name-modal"
      width={SET_NEW_WALLET_NAME_MODAL_WIDTH}
      closable={false}
      maskClosable
      centered
      destroyOnClose
      footer={null}
      open={isOpen}
      onCancel={handleCancel}>
      <div>
        <div className="modal-title">Set a Name for Your Wallet</div>
        <div className="modal-content">
          You can set your login account as your wallet name to make your wallet customised and recongnisable.
        </div>
        <div className="modal-footer flex-column">
          <Button type="primary" onClick={handleConfirm}>
            Use Login Account as Name
          </Button>
          <Button onClick={handleCancel}>Cancel</Button>
        </div>
      </div>
    </Modal>
  );
}
