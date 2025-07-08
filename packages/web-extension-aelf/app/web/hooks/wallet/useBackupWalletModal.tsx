import { useCallback } from 'react';
import CustomModal from 'pages/components/CustomModal';
import backupWalletLogo from 'assets/images/backupWalletLogo.png';
import { CommonButton } from '@portkey/did-ui-react';
import './useBackupWalletModal.less';

/**
 * useBackupWalletModal
 * Chrome 插件钱包备份弹窗逻辑，参考 RN 端实现。
 * - 使用 CustomModal 组件
 * - 支持云备份、手动备份、稍后再说
 * - 图片资源已对齐
 * - 代码结构清晰，便于维护
 */
export const useBackupWalletModal = () => {
  /**
   * 显示备份钱包弹窗
   * @param onManualBackup 手动备份回调
   * @param onCloudBackup 云备份回调
   * @param onLater 稍后再说回调
   */
  const showBackupWalletModal = useCallback(
    ({
      onManualBackup,
      // onCloudBackup,
      onLater,
    }: {
      onManualBackup?: () => void;
      onCloudBackup?: () => void;
      onLater?: () => void;
    } = {}) => {
      const modal: any = CustomModal({
        type: 'info',
        className: 'backup-wallet-modal',
        content: (
          <div className="backup-wallet-modal-content">
            <div className="backup-wallet-modal-logo-wrap">
              <img src={backupWalletLogo} alt="Backup Wallet" className="backup-wallet-modal-logo" />
            </div>
            <div className="backup-wallet-modal-title">Backup your wallet</div>
            <div className="backup-wallet-modal-subtitle">
              Back up your wallet to keep your seed phrase safe and secure your assets.
            </div>
            <div className="backup-wallet-modal-btns">
              {/*<Button*/}
              {/*  type="primary"*/}
              {/*  block*/}
              {/*  className="backup-wallet-modal-btn"*/}
              {/*  onClick={() => {*/}
              {/*    modal.destroy();*/}
              {/*    onCloudBackup?.();*/}
              {/*  }}>*/}
              {/* TODO: implement backup on cloud */}
              {/*  Back up on iCloud*/}
              {/*  Back up on Google Drive*/}
              {/*</Button>*/}
              <CommonButton
                type="primary"
                block
                className="backup-wallet-modal-btn"
                onClick={() => {
                  modal.destroy();
                  onManualBackup?.();
                }}>
                Back up manually
              </CommonButton>
              <CommonButton
                type="text"
                block
                className="backup-wallet-modal-btn"
                onClick={() => {
                  modal.destroy();
                  onLater?.();
                }}>
                I&#39;ll do it later
              </CommonButton>
            </div>
          </div>
        ),
        // okButtonProps: { style: { display: 'none' } },
        // onOk: () => {},
        // onCancel: () => {
        //   modal.destroy();
        // },
        closable: true,
        maskClosable: false,
      });
    },
    [],
  );

  return {
    showBackupWalletModal,
  };
};
