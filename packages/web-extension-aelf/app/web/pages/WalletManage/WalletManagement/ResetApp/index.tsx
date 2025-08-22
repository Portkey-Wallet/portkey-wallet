import React, { useState, useCallback } from 'react';
import { useNavigateState } from 'hooks/router';
import { useAppDispatch } from 'store/Provider/hooks';
import { useWalletListState } from '@portkey-wallet/hooks/hooks-eoa/wallet';
import { DrawerOrModal } from 'components/DrawerOrModal/DrawerOrModalV2';
import CommonHeader from 'components/CommonHeader';
import { CustomSvgV3 } from 'components/CustomSvgV3';
import { CommonButton } from '@portkey/did-ui-react';
import { resetWallet } from '@portkey-wallet/store/store-eoa/wallet/actions';
import { resetDapp } from '@portkey-wallet/store/store-eoa/dapp/actions';
import BackupAddressOverlay from '../AddressDetail/BackupAddressOverlay';
import './index.less';
import { UnlockOverlay } from '../../../components/UnlockModal';
import { LOCAL_AVATARS } from 'assets/images/avatars/avatars';
import { useAddressBackupModal } from '../AddressBackup/useAddressBackupModal';
import { useCommonState } from 'store/Provider/hooks';
import InternalMessage from 'messages/InternalMessage';
import { PortkeyMessageTypes } from 'messages/InternalMessageTypes';
import SWEventController from 'controllers/SWEventController';

export const ResetApp: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigateState();
  const walletList = useWalletListState();
  const { isPrompt } = useCommonState();

  const { backupModal, setBackupModal, handleView, handleBackupContinue } = useAddressBackupModal();

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [unlockOverlayOpen, setUnlockOverlayOpen] = useState(false);

  const handleResetApp = useCallback(() => {
    setConfirmModalOpen(true);
  }, []);

  const handleConfirmReset = useCallback(() => {
    SWEventController.dispatchEvent({ eventName: 'accountsChanged', data: {} });
    setTimeout(() => {
      setConfirmModalOpen(false);
      setUnlockOverlayOpen(false);
      dispatch(resetDapp());
      dispatch(resetWallet());
      if (isPrompt) {
        navigate('/register');
      } else {
        InternalMessage.payload(PortkeyMessageTypes.REGISTER_WALLET).send();
      }
    }, 100);
  }, [dispatch, navigate]);

  return (
    <div className="reset-app-page">
      <CommonHeader
        className="my-header"
        title=""
        onLeftBack={() => {
          navigate('/wallet/manage', {
            state: {
              showManaging: true,
            },
          });
        }}
        onLeftBackShowClose={false}
      />
      <div className="reset-app-title">Ensure your wallet is backed up</div>
      <div className="reset-app-desc">
        Each wallet has a seed phrase or private key, which is crucial for recovery. View and back them up:
      </div>
      <div className="reset-app-wallet-list">
        {walletList.map((wallet, idx) => {
          const account = wallet.accountList[0];
          return (
            <div className="reset-app-wallet-card" key={wallet.key || idx}>
              <div className="reset-app-wallet-info">
                <div className="reset-app-wallet-avatar">
                  <img
                    className="reset-app-wallet-avatar-img"
                    src={LOCAL_AVATARS[account.icon || 'avatar_1']}
                    alt="avatar"
                  />
                </div>
                <div>
                  <div className="reset-app-wallet-name">{account.name}</div>
                  <div className="reset-app-wallet-type">
                    {wallet.AESEncryptMnemonic ? 'Seed phrase' : 'Private key'}
                  </div>
                </div>
              </div>
              <CommonButton
                className="reset-app-view-btn"
                type="primary"
                size="small"
                onClick={() => handleView(wallet, account)}>
                View
              </CommonButton>
            </div>
          );
        })}
      </div>
      <div className="reset-app-footer">
        <CommonButton className="reset-app-reset-btn" type="outline" danger block onClick={handleResetApp}>
          Reset app
        </CommonButton>
      </div>
      {/* 备份弹窗 */}
      <BackupAddressOverlay
        open={backupModal.open}
        type={backupModal.type}
        walletToBeBackup={backupModal.wallet}
        accountToBeBackup={backupModal.account}
        onContinue={() => handleBackupContinue({})}
        onClose={() => setBackupModal((prev) => ({ ...prev, open: false }))}
      />
      {/* 确认重置弹窗 */}
      <DrawerOrModal
        open={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        className="reset-app-confirm-modal"
        title={<CustomSvgV3 type="error" className="reset-app-confirm-modal-title-icon" />}
        content={
          <div className="reset-app-confirm-content">
            <div className="reset-app-confirm-modal-title">Confirm the reset</div>
            <div className="reset-app-confirm-message">
              If you haven&#39;t saved your seed phrase or private key, resetting the app may result in permanent loss
              of access to your wallet and assets.
            </div>
            {/*<CommonButton type="primary" danger block className="reset-app-confirm-btn" onClick={handleConfirmReset}>*/}
            <CommonButton
              type="primary"
              danger
              block
              className="reset-app-confirm-btn"
              onClick={() => {
                setUnlockOverlayOpen(true);
              }}>
              Reset app
            </CommonButton>
            <CommonButton
              type="outline"
              block
              className="reset-app-cancel-btn"
              onClick={() => setConfirmModalOpen(false)}>
              Cancel
            </CommonButton>
          </div>
        }
      />
      <UnlockOverlay
        open={unlockOverlayOpen}
        onClose={() => setUnlockOverlayOpen(false)}
        onUnLockHandler={handleConfirmReset}
      />
    </div>
  );
};
