import { useCallback, useState } from 'react';
import { BackupType } from '../AddressDetail/BackupAddressOverlay';
import { useNavigateState } from 'hooks/router';
import { TAccountInfo, TWalletInfo } from '@portkey-wallet/types/types-eoa/wallet';

export const useAddressBackupModal = () => {
  const navigate = useNavigateState();

  const [backupModal, setBackupModal] = useState<{
    open: boolean;
    type: BackupType;
    wallet?: TWalletInfo;
    account?: TAccountInfo;
  }>({ open: false, type: 'seed phrase', wallet: undefined, account: undefined });

  const handleView = useCallback((wallet: TWalletInfo, account: TAccountInfo) => {
    setBackupModal({
      open: true,
      type: wallet.AESEncryptMnemonic ? 'seed phrase' : 'private key',
      wallet,
      account,
    });
  }, []);
  const handleBackupContinue = useCallback(
    ({ backUrl, backParams }: { backUrl?: string; backParams?: any }) => {
      setBackupModal((prev) => ({ ...prev, open: false }));
      navigate('/wallet/backup/view', {
        state: {
          walletToBeBackup: backupModal.wallet,
          accountToBeBackup: backupModal.account,
          backupType: backupModal.type === 'private key' ? 'Private key' : 'Seed phrase',
          backUrl,
          backParams,
        },
      });
    },
    [backupModal.account, backupModal.type, backupModal.wallet, navigate],
  );

  return {
    backupModal,
    setBackupModal,
    handleView,
    handleBackupContinue,
  };
};
