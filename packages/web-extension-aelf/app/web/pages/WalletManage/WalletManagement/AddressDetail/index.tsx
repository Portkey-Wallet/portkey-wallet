import React, { useEffect, useState } from 'react';
import { useLocationState, useNavigateState } from 'hooks/router';
import { CustomSvgV3 } from 'components/CustomSvgV3';
import CommonHeader from 'components/CommonHeader';
import CopyAddressDrawerOrModal from 'pages/components/CopyAddressDrawerOrModal/indexV2';
import singleMessage from 'utils/singleMessage';
import { LOCAL_AVATARS } from 'assets/images/avatars/avatars';
import { useWalletListState } from '@portkey-wallet/hooks/hooks-eoa/wallet';
import { TAccountInfo, TWalletInfo } from '@portkey-wallet/types/types-eoa/wallet';
import { CustomModal, CustomModalBottom } from 'pages/components/CustomModalBottom';
import BackupAddressOverlay from './BackupAddressOverlay';
import { useAddressBackupModal } from '../AddressBackup/useAddressBackupModal';
import { useAddress } from '../hooks/useAddress';
import './index.less';
import EditWalletNameForm from '../../../Wallet/components/EditWalletNameForm';
import { EditWalletAvatarForm } from '../../../Wallet/components/EditWalletAvatarForm/indexV2';
import { UnlockOverlay } from '../../../components/UnlockModal';

export const AddressDetail: React.FC = () => {
  const navigate = useNavigateState();
  const { state, search } = useLocationState<{
    currentWalletKey: string;
    currentAddress: string;
    backUrl?: string;
  }>();
  const { currentWalletKey, currentAddress, backUrl } = state || {};

  const walletList = useWalletListState();
  const [currentAccount, setCurrentAccount] = useState<TAccountInfo>();
  const [currentWallet, setCurrentWallet] = useState<TWalletInfo>();
  const [avatar, setAvatar] = useState<string | number>();
  const [nickName, setNickName] = useState<string>('');
  const [multiChainAddressesShow, setMultiChainAddressesShow] = useState<boolean>(false);
  const [unlockOverlayOpen, setUnlockOverlayOpen] = useState(false);
  const { backupModal, setBackupModal, handleView, handleBackupContinue } = useAddressBackupModal();
  const { updateAddressName, updateAddressIcon, removeAddress } = useAddress({
    currentAccount,
    currentAddress,
    currentWalletKey,
  });

  useEffect(() => {
    if (!walletList.length) {
      return;
    }
    const walletSelected = walletList.find((item) => item.key === currentWalletKey);
    const accountSelected = walletSelected?.accountList.find((item) => item.address === currentAddress);
    setCurrentAccount(accountSelected);
    setCurrentWallet(walletSelected);
    setAvatar(LOCAL_AVATARS[accountSelected?.icon || 'avatar_1']);
    setNickName(accountSelected?.name || '');
    console.log('address detail', accountSelected, walletSelected);
  }, [walletList, currentWalletKey, currentAddress]);

  const theOnlyAddress = walletList.length === 1 && walletList[0].accountList.length === 1;

  const handleChangeAvatar = () => {
    console.log('Change avatar clicked', currentAccount, LOCAL_AVATARS);
    CustomModalBottom({
      type: 'confirm',
      noFooter: true,
      isPrompt: true,
      content: (
        <EditWalletAvatarForm
          avatar={avatar as string}
          saveCallback={async ({ selectedAvatar }) => {
            CustomModal.destroyAll();
            console.log('avatar', selectedAvatar, currentAccount);
            try {
              updateAddressIcon(selectedAvatar);
              singleMessage.success('Avatar changed');
            } catch (error) {
              console.log('setWalletName: error', error);
            }
          }}
        />
      ),
      onOk: () => {
        return;
      },
      title: 'Change wallet picture',
      okText: 'Save',
    });
  };

  const handleRenameAddress = () => {
    if (!currentAccount || !currentWallet) {
      return;
    }
    CustomModalBottom({
      type: 'confirm',
      noFooter: true,
      isPrompt: true,
      content: (
        <EditWalletNameForm
          nickName={nickName}
          setUserInfo={async ({ nickName }) => {
            await updateAddressName(nickName || currentAccount.name || 'Address-');
          }}
          saveCallback={() => {
            CustomModal.destroyAll();
          }}
        />
      ),
      onOk: () => {
        return;
      },
      title: 'Rename wallet',
      okText: 'Save',
    });
  };

  const handleShowMultiChainAddresses = () => {
    if (!currentAccount) {
      return;
    }
    setMultiChainAddressesShow(true);
  };

  const handleShowSeedPhrase = () => {
    if (!currentWallet || !currentAccount) {
      return;
    }
    handleView(currentWallet, currentAccount);
  };

  const handleShowPrivateKey = () => {
    if (!currentWallet || !currentAccount) {
      return;
    }
    handleView(
      {
        ...currentWallet,
        AESEncryptMnemonic: '',
      },
      currentAccount,
    );
  };

  const handleRemoveAddress = () => {
    if (theOnlyAddress) {
      singleMessage.error('This is the only address and cannot be removed.');
      return;
    }
    removeAddress(() => {
      singleMessage.success('Address removed');
      navigate('/wallet/manage' + search);
    });
  };

  return (
    <div className="address-detail-container">
      <CommonHeader
        className="address-detail-header"
        title="Address details"
        onLeftBack={() => navigate(backUrl || '/wallet/manage' + search)}
      />

      <div className="address-detail-user-info-wrap">
        <div className="address-detail-avatar-wrap">
          <div className="address-detail-avatar-container" onClick={handleChangeAvatar}>
            <img
              src={typeof avatar === 'string' ? avatar : LOCAL_AVATARS.avatar_1}
              alt="avatar"
              className="address-detail-avatar"
            />
            <div className="address-detail-edit-icon">
              <CustomSvgV3 type="edit thin" className="address-detail-edit-icon-svg" />
            </div>
          </div>
        </div>
        <div className="address-detail-nickname">
          <span className="address-detail-nickname-text">{nickName}</span>
          <span className="address-detail-nickname-edit" onClick={handleRenameAddress}>
            <CustomSvgV3 type="edit thin" className="address-detail-edit-icon-svg" />
          </span>
        </div>
      </div>

      <div className="address-detail-content">
        <CopyAddressDrawerOrModal
          open={multiChainAddressesShow}
          onClose={() => setMultiChainAddressesShow(false)}
          customAddress={currentAddress}
        />
        <div className="address-detail-card" onClick={handleShowMultiChainAddresses}>
          <div className="address-detail-card-info">
            <span className="address-detail-card-title">Address</span>
          </div>
          <div className="address-detail-card-right">
            <span className="address-detail-card-sub-text">Multichain</span>
            <CustomSvgV3 type="chevron_right" className="address-detail-card-icon" />
          </div>
        </div>

        <div className="address-detail-card-list">
          {currentWallet?.AESEncryptMnemonic && (
            <>
              <div className="address-detail-card" onClick={handleShowSeedPhrase}>
                <div className="address-detail-card-info">
                  <span className="address-detail-card-title">Show Seed phrase</span>
                </div>
                <div className="address-detail-card-right">
                  {!currentWallet?.isBackup && (
                    <span className="address-detail-card-sub-text address-detail-not-backup">Not backup</span>
                  )}
                  <CustomSvgV3 type="chevron_right" className="address-detail-card-icon" />
                </div>
              </div>
              <div className="address-detail-divider" />
            </>
          )}

          <div className="address-detail-card" onClick={handleShowPrivateKey}>
            <div className="address-detail-card-info">
              <span className="address-detail-card-title">Show Private key</span>
            </div>
            <div className="address-detail-card-right">
              <CustomSvgV3 type="chevron_right" className="address-detail-card-icon" />
            </div>
          </div>
          <BackupAddressOverlay
            open={backupModal.open}
            type={backupModal.type}
            walletToBeBackup={backupModal.wallet}
            accountToBeBackup={backupModal.account}
            onContinue={() =>
              handleBackupContinue({
                backUrl: '/wallet/address/detail' + search,
                backParams: {
                  currentWalletKey,
                  currentAddress,
                },
              })
            }
            onClose={() => setBackupModal((prev) => ({ ...prev, open: false }))}
          />
        </div>
      </div>

      <div className="address-detail-delete-wrap">
        <span
          className={`address-detail-delete-text ${theOnlyAddress ? 'address-detail-delete-disabled' : ''}`}
          onClick={() => setUnlockOverlayOpen(true)}>
          Remove address
        </span>
        <UnlockOverlay
          open={unlockOverlayOpen}
          onClose={() => setUnlockOverlayOpen(false)}
          onUnLockHandler={handleRemoveAddress}
        />
      </div>
    </div>
  );
};

export default AddressDetail;
