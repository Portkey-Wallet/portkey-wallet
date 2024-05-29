import { useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import { useCurrentWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useSetNewWalletName } from '@portkey-wallet/hooks/hooks-ca/walletName';
import { handleErrorMessage } from '@portkey-wallet/utils';
import singleMessage from 'utils/singleMessage';
import './index.less';

const SET_NEW_WALLET_NAME_MODAL_WIDTH = 320;

export default function SetNewWalletNameModal() {
  const {
    walletInfo: { caHash, originChainId },
  } = useCurrentWallet();
  const { shouldShowSetNewWalletNameModal, handleSetNewWalletName, handleCancelSetNewWalletNameModal } =
    useSetNewWalletName();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (shouldShowSetNewWalletNameModal) {
      setIsOpen(true);
    }
  }, [shouldShowSetNewWalletNameModal]);

  const handleConfirm = () => {
    handleSetNewWalletName({ caHash, chainId: originChainId }).catch((error) => {
      const msg = handleErrorMessage(error);
      singleMessage.error(msg);
    });
    setIsOpen(false);
  };

  const handleCancel = () => {
    handleCancelSetNewWalletNameModal({ caHash, chainId: originChainId }).catch((error) => {
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
        <div className="modal-title">Set your new wallet name</div>
        <div className="modal-content">
          <p>{`Portkey's latest support for using login account as wallet name in one click makes your identity more
          recognizable.`}</p>
          <p>{`Do you want to use login account as your new wallet name?`}</p>
        </div>
        <div className="modal-footer flex-column">
          <Button type="primary" onClick={handleConfirm}>
            Set New Wallet Name
          </Button>
          <Button onClick={handleCancel}>Cancel</Button>
        </div>
      </div>
    </Modal>
  );
}
