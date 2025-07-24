import React, { useState, useCallback } from 'react';
import { useNavigateState } from 'hooks/router';
import { useAppDispatch } from 'store/Provider/hooks';
import { useWalletListState } from '@portkey-wallet/hooks/hooks-eoa/wallet';
import { DrawerOrModal } from 'components/DrawerOrModal/DrawerOrModalV2';
import { CommonButton } from '@portkey/did-ui-react';
import BackupAddressOverlay, { BackupType } from '../AddressDetail/BackupAddressOverlay';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { TWalletInfo, TAccountInfo } from '@portkey-wallet/types/types-eoa/wallet';
import './index.less';

// TODO: replace with real actions
// const resetWallet = () => {
//   console.log('reset wallet');
// };
// const resetDapp = () => {
//   console.log('reset dapp');
// };
const useCheckSecurityLock = () => (cb: () => void) => cb();

export const ResetApp: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigateState();
  const walletList = useWalletListState();
  const checkSecurityLock = useCheckSecurityLock();

  const [backupModal, setBackupModal] = useState<{
    open: boolean;
    type: BackupType;
    wallet?: TWalletInfo;
    account?: TAccountInfo;
  }>({ open: false, type: 'seed phrase', wallet: undefined, account: undefined });

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const handleView = useCallback((wallet: TWalletInfo, account: TAccountInfo) => {
    setBackupModal({
      open: true,
      type: wallet.AESEncryptMnemonic ? 'seed phrase' : 'private key',
      wallet,
      account,
    });
    console.log('handleView click: ', backupModal);
  }, []);

  const handleBackupContinue = useCallback(() => {
    setBackupModal((prev) => ({ ...prev, open: false }));
    // TODO: 跳转到备份页面并安全校验
  }, []);

  const handleResetApp = useCallback(() => {
    setConfirmModalOpen(true);
  }, []);

  const handleConfirmReset = useCallback(() => {
    setConfirmModalOpen(false);
    // checkSecurityLock(() => {
    //   // dispatch(resetDapp());
    //   // dispatch(resetWallet());
    //   // TODO: 跳转到登录/注册页或首页
    //   navigate('/');
    // });
  }, [checkSecurityLock, dispatch, navigate]);

  return (
    <div className="reset-app-page">
      <div className="reset-app-title">Ensure your wallet is backed up</div>
      <div className="reset-app-desc">
        Each wallet has a seed phrase or private key, which is crucial for recovery. View and back them up:
      </div>
      <div className="reset-app-wallet-list">
        {walletList.map((wallet, idx) => {
          const account = wallet.accountList[0];
          console.log('wallet', wallet, account);
          return (
            <div className="reset-app-wallet-card" key={wallet.key || idx}>
              <div className="reset-app-wallet-info">
                {/* TODO: 头像可用CustomSvgV3或自定义 */}
                <div className="reset-app-wallet-avatar" />
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
        onContinue={handleBackupContinue}
        onClose={() => setBackupModal((prev) => ({ ...prev, open: false }))}
      />
      {/* 确认重置弹窗 */}
      <DrawerOrModal
        open={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        className="reset-app-confirm-modal"
        title={
          <span>
            <ExclamationCircleOutlined className="reset-app-confirm-warning-icon" />
            Confirm the reset
          </span>
        }
        content={
          <div className="reset-app-confirm-content">
            <div className="reset-app-confirm-message">
              If you haven&#39;t saved your seed phrase or private key, resetting the app may result in permanent loss
              of access to your wallet and assets.
            </div>
            <CommonButton type="primary" danger block className="reset-app-confirm-btn" onClick={handleConfirmReset}>
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
    </div>
  );
};
