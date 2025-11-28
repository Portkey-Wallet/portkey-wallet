import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CommonButton } from '@portkey/did-ui-react';
import singleMessage from 'utils/singleMessage';
// import { useCurrentWallet } from '@portkey-wallet/hooks/hooks-eoa/wallet';
// import getPrivateKeyAndMnemonic from 'utils/Wallet/getPrivateKeyAndMnemonic';
import InfoCircleOutlined from '@ant-design/icons/InfoCircleOutlined';
import CheckCircleFilled from '@ant-design/icons/CheckCircleFilled';
import CopyOutlined from '@ant-design/icons/CopyOutlined';
import { useUnlockModal } from 'hooks/wallet/useUnlockModal';
import './ManualBackup.less';
import { useConfirmBackupModal } from '../ConfirmBackupModal';
import CommonHeader from 'components/CommonHeader';

export const ManualBackup: React.FC = () => {
  const navigate = useNavigate();
  // const walletInfo = useCurrentWallet();
  const [mnemonics, setMnemonics] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const { showUnlockModal } = useUnlockModal();
  const { showConfirmBackupModal } = useConfirmBackupModal();

  const unlockMnemonic = useCallback(() => {
    showUnlockModal({
      title: 'Enter Password to unlock',
      callback: async (_, mnemonic) => {
        setMnemonics(mnemonic.split(' '));
      },
    });
  }, [showUnlockModal]);

  useEffect(() => {
    unlockMnemonic();
  }, [unlockMnemonic]);

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(mnemonics.join(' '));
      setCopied(true);
      singleMessage.success('Seed phrase copied');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      singleMessage.error('Copy failed');
    }
  }, [mnemonics]);

  const mnemonicsView = useMemo(
    () => (
      <div className="manual-backup-mnemonics-wrap">
        {mnemonics.map((mnemonic, idx) => (
          <div className="manual-backup-word-wrap" key={idx}>
            <span className="manual-backup-word-label">{idx + 1}</span>
            <span className="manual-backup-mnemonics-label">{mnemonic}</span>
          </div>
        ))}
      </div>
    ),
    [mnemonics],
  );

  const copyButton = (
    <button className="manual-backup-copy-btn" onClick={onCopy}>
      <CopyOutlined />
      <span className="ml-8">Copy to clipboard</span>
    </button>
  );
  const copiedView = (
    <div className="manual-backup-copy-btn">
      <CheckCircleFilled className="success-color" />
      <span className="manual-backup-copy-success">Seed phrase copied</span>
    </div>
  );

  const reminderUI = (
    <div className="manual-backup-reminder-wrap">
      <InfoCircleOutlined className="manual-backup-reminder-icon" />
      <span className="manual-backup-reminder-text">
        Next, verify your seed phrase by selecting the words in the correct order.
      </span>
    </div>
  );

  const onContinue = () => {
    showConfirmBackupModal({
      mnemonics,
      onSuccess: () => {
        navigate('/wallet/backup/manual/success');
      },
    });
    // navigate('/wallet/backup/manual/confirm', { state: { mnemonics } });
  };

  return (
    <div className="manual-backup-container">
      <CommonHeader
        className="my-header"
        title={''}
        onLeftBack={() => {
          navigate(-1);
        }}
        onLeftBackShowClose={true}
      />
      <div className="manual-backup-title">Manual backup</div>
      <div className="manual-backup-desc">
        Keep a copy of your seed phrase at a safe place. DO NOT share it with anyone as this could result in wallet and
        asset loss.
      </div>
      {!mnemonics.length && (
        <CommonButton type="primary" className="manual-backup-continue-btn" onClick={unlockMnemonic}>
          Click to unlock Mnemonic
        </CommonButton>
      )}
      {mnemonicsView}
      {copied ? copiedView : copyButton}
      {reminderUI}
      <CommonButton
        type="primary"
        disabled={!mnemonics.length}
        className="manual-backup-continue-btn"
        onClick={onContinue}>
        Continue
      </CommonButton>
    </div>
  );
};
