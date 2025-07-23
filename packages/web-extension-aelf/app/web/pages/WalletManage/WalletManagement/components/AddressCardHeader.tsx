import React, { useEffect, useRef } from 'react';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { DrawerOrModal, IDrawerOrModalInstance } from 'components/DrawerOrModal';
import { CommonButton } from '@portkey/did-ui-react';
import { useRemoveWallet } from '../hooks/useRemoveWallet';
import singleMessage from 'utils/singleMessage';
import { useNavigateState, useLocationState } from 'hooks/router';
import './AddressCardHeader.less';

export interface TWalletInfo {
  name?: string;
  avatarUrl?: string;
  AESEncryptMnemonic?: string;
  accountList: Array<{ address: string }>;
  key?: string;
  // ...other wallet fields
}

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
  // TODO: dispatch, updateWallet, removeWallet, showModal, navigation, etc. 需业务层注入
  const { removeWallet } = useRemoveWallet();

  const { state } = useLocationState<{
    action?: string | undefined;
    walletKeyToBeRemove?: string | undefined;
  }>();
  const { action, walletKeyToBeRemove } = state || {};
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
    // TODO: 显示重命名弹窗，调用 updateWallet
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
            <ExclamationCircleOutlined className="address-card-header-warning-icon" />
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
                  /* TODO: show backup modal */
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
      {!useManageStyle ? (
        <>
          <span className="address-card-wallet-name address-card-wallet-name-show">{walletName}</span>
          {privateKeyTipShow && isPrivateKeyWallet && (
            <span className="address-card-header-tip">
              Wallets imported using private key do not support the addition of addresses.
            </span>
          )}
        </>
      ) : (
        <>
          <span className="address-card-wallet-name address-card-wallet-name-edit">{walletName}</span>
          <span className="address-card-header-actions">
            <EditOutlined className="address-card-header-icon" onClick={handleEdit} />
            <div className="address-card-header-icon-separator"></div>
            <DeleteOutlined
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
