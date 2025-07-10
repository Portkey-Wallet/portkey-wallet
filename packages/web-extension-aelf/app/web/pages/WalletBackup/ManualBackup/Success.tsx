import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CommonButton } from '@portkey/did-ui-react';
import backupWalletSuccessLogo from 'assets/images/backupWalletSuccess.png';
import './Success.less';

export const ManualBackupSuccess: React.FC = () => {
  const navigate = useNavigate();

  const onViewWallet = () => {
    navigate('/');
  };

  return (
    <div className="manual-backup-success-page">
      <div className="manual-backup-success-content">
        <div className="manual-backup-success-logo-wrap">
          <img src={backupWalletSuccessLogo} alt="Backup Success" className="manual-backup-success-logo" />
        </div>
        <div className="manual-backup-success-title">Manual backup completed</div>
        <div className="manual-backup-success-desc">You have successfully backed up your wallet.</div>
      </div>
      <CommonButton type="primary" className="manual-backup-success-btn" onClick={onViewWallet}>
        View wallet
      </CommonButton>
    </div>
  );
};
