import React, { useEffect, useRef } from 'react';
import { DrawerOrModal, IDrawerOrModalInstance } from 'components/DrawerOrModal';
import { CommonButton } from '@portkey/did-ui-react';
import { useRemoveWallet } from '../hooks/useRemoveWallet';
import singleMessage from 'utils/singleMessage';
import { useNavigateState, useLocationState } from 'hooks/router';
import './AddressCardHeader.less';
import './WalletRenameModal.less';
import { CustomSvgV3 } from 'components/CustomSvgV3';
import { useAppCommonDispatch } from '@portkey-wallet/hooks';
import { updateWallet } from '@portkey-wallet/store/store-eoa/wallet/actions';
import { TWalletInfo } from '@portkey-wallet/types/types-eoa/wallet';
import { CommonTooltip } from 'components/CommonTooltipV2';
import BackupAddressOverlay from '../AddressDetail/BackupAddressOverlay';
import { useAddressBackupModal } from '../AddressBackup/useAddressBackupModal';

export interface AddressCardHeaderProps {
  privateKeyTipShow?: boolean;
  useManageStyle?: boolean;
  removeWalletDisabled?: boolean;
  walletInfo?: TWalletInfo;
}

const AddressCardHeader: React.FC<AddressCardHeaderProps> = ({
  privateKeyTipShow = false,
  useManageStyle = false,
  removeWalletDisabled = false,
  walletInfo,
}) => {
  const navigate = useNavigateState();
  const walletName = walletInfo?.name || 'Wallet 1';
  const isPrivateKeyWallet = !walletInfo?.AESEncryptMnemonic;
  const typeText = isPrivateKeyWallet ? 'private key' : 'seed phrase';

  const walletRemoveDrawerOrModalRef = useRef<IDrawerOrModalInstance | null>(null);
  const walletRenameDrawerOrModalRef = useRef<IDrawerOrModalInstance | null>(null);
  const [renameValue, setRenameValue] = React.useState(walletName);
  const [renameError, setRenameError] = React.useState<string | undefined>(undefined);

  // TODO: dispatch, updateWallet, removeWallet, showModal, navigation, etc. 需业务层注入
  const dispatch = useAppCommonDispatch();
  const { removeWallet } = useRemoveWallet();

  const { state } = useLocationState<{
    action?: string | undefined;
    walletKeyToBeRemove?: string | undefined;
  }>();
  const { action, walletKeyToBeRemove } = state || {};

  const { backupModal, setBackupModal, handleView, handleBackupContinue } = useAddressBackupModal();

  useEffect(() => {
    if (action === 'REMOVE_WALLET' && walletKeyToBeRemove) {
      removeWallet(walletKeyToBeRemove, () => {
        singleMessage.success(isPrivateKeyWallet ? 'Private key removed' : 'Wallet removed');

        navigate('/wallet/manage', {
          state: {
            showManaging: true,
          },
        });
      });
    }
  }, [action, isPrivateKeyWallet, navigate, removeWallet, walletKeyToBeRemove]);

  const handleEdit = () => {
    setRenameValue(walletName);
    setRenameError(undefined);
    walletRenameDrawerOrModalRef.current?.open();
  };

  // 校验函数
  const validateRename = (val: string) => {
    if (!val) return 'Wallet name is required';
    if (!/^[a-zA-Z0-9 _]+$/.test(val)) return 'Only letters, numbers, spaces, and underscores are allowed.';
    if (val.length > 16) return 'Max 16 characters.';
    return undefined;
  };

  const handleRenameChange = (val: string) => {
    setRenameValue(val);
    setRenameError(validateRename(val));
  };

  const handleRenameSave = () => {
    if (!walletInfo || !renameValue) {
      return;
    }
    dispatch(
      updateWallet({
        wallet: {
          ...walletInfo,
          name: renameValue,
        },
      }),
    );
    walletRenameDrawerOrModalRef.current?.close();
  };

  const handleRemove = () => {
    walletRemoveDrawerOrModalRef.current?.open();
  };

  return (
    <div className={`address-card-header${useManageStyle ? ' manage-style' : ''}`}>
      <DrawerOrModal
        ref={walletRemoveDrawerOrModalRef}
        className="wallet-remove-modal"
        title={
          <span>
            <CustomSvgV3 type="error" className="address-card-header-warning-icon" />
          </span>
        }
        content={
          <div className="address-card-header-modal-content">
            <div className="address-card-header-modal-title">Ensure your {typeText} is backed up before removal.</div>
            <div className="address-card-header-modal-desc">
              {isPrivateKeyWallet
                ? 'Please make sure your private key is securely backed up before removing the wallet to avoid losing access in the future.'
                : 'Please make sure your seed phrase is securely backed up before removing the wallet. Losing access to your seed phrase or sharing it with others could lead to permanent loss of your assets.'}
            </div>
            <div className="address-card-header-modal-btns">
              <CommonButton
                type="primary"
                onClick={() => {
                  if (!walletInfo || !walletInfo.key) {
                    return;
                  }
                  handleView(walletInfo, walletInfo.accountList[0]);
                }}>
                View {typeText}
              </CommonButton>
              <CommonButton
                className="remove"
                type="outline"
                disabled={removeWalletDisabled}
                onClick={() => {
                  /* TODO: removeWallet, navigation, toast */
                  if (!walletInfo || !walletInfo.key) {
                    return;
                  }
                  console.log('removeWallet start');
                  navigate('/unlock', {
                    state: {
                      navigateUrl: '/wallet/manage',
                      params: {
                        showManaging: true,
                        action: 'REMOVE_WALLET',
                        walletKeyToBeRemove: walletInfo.key,
                      },
                    },
                  });
                }}>
                Remove
              </CommonButton>
            </div>
          </div>
        }
      />
      <DrawerOrModal
        ref={walletRenameDrawerOrModalRef}
        className="wallet-rename-modal"
        title={<span>Rename your wallet</span>}
        content={
          <div className="address-card-header-modal-content">
            <div className="wallet-rename-avatar-wrap">
              {/* TODO: 头像可换成钱包自定义头像 */}
              <CustomSvgV3 type="Wallet" className="wallet-rename-avatar" />
            </div>
            <div className="wallet-rename-input-wrap">
              <input
                className="wallet-rename-input"
                maxLength={16}
                value={renameValue}
                onChange={(e) => handleRenameChange(e.target.value)}
                placeholder="Enter wallet name"
              />
              {renameValue && (
                <span className="wallet-rename-clear" onClick={() => handleRenameChange('')}>
                  ×
                </span>
              )}
            </div>
            <div className="wallet-rename-count-error">
              <span className="wallet-rename-count">{renameValue.length}/16</span>
              {renameError && <span className="wallet-rename-error">{renameError}</span>}
            </div>
            <CommonButton
              type="primary"
              block
              className="wallet-rename-save-btn"
              disabled={!!renameError || !renameValue}
              onClick={handleRenameSave}>
              Save
            </CommonButton>
          </div>
        }
      />
      <BackupAddressOverlay
        open={backupModal.open}
        type={backupModal.type}
        walletToBeBackup={backupModal.wallet}
        accountToBeBackup={backupModal.account}
        onContinue={() =>
          handleBackupContinue({
            backUrl: '/wallet/manage',
            backParams: { showManaging: true },
          })
        }
        onClose={() => setBackupModal((prev) => ({ ...prev, open: false }))}
      />
      {!useManageStyle ? (
        <>
          <span className="address-card-wallet-name address-card-wallet-name-show">{walletName}</span>
          {privateKeyTipShow && isPrivateKeyWallet && (
            <CommonTooltip title="Wallets imported using private key do not support the addition of addresses." />
          )}
        </>
      ) : (
        <>
          <span className="address-card-wallet-name address-card-wallet-name-edit">{walletName}</span>
          <span className="address-card-header-actions">
            <CustomSvgV3 type="edit thin" className="address-card-header-icon" onClick={handleEdit} />
            <div className="address-card-header-icon-separator"></div>
            <CustomSvgV3
              type="delete"
              className={`address-card-header-icon${removeWalletDisabled ? ' disabled' : ''}`}
              onClick={removeWalletDisabled ? undefined : handleRemove}
            />
          </span>
        </>
      )}
    </div>
  );
};

export default AddressCardHeader;
