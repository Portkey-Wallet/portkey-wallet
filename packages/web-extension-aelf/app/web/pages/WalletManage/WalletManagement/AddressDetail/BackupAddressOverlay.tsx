import React, { useState, useCallback } from 'react';
import { DrawerOrModal } from 'components/DrawerOrModal/DrawerOrModalV2';
import { CommonButton } from '@portkey/did-ui-react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import './BackupAddressOverlay.less';
import CheckBox from 'components/CheckBox';

export type BackupType = 'seed phrase' | 'private key';
export interface BackupAddressOverlayProps {
  type: BackupType;
  walletToBeBackup: any;
  accountToBeBackup: any;
  onContinue: () => void;
  open: boolean;
  onClose: () => void;
}

const notes = (type: BackupType) => [
  {
    icon: <ExclamationCircleOutlined className="backup-note-icon" />, // 可换成自定义svg
    text: `Your ${type} is essential for wallet recovery.`,
  },
  {
    icon: <ExclamationCircleOutlined className="backup-note-icon" />,
    text: `Losing your ${type} could mean losing access to your wallet and assets.`,
  },
  {
    icon: <ExclamationCircleOutlined className="backup-note-icon" />,
    text: `DO NOT share your ${type} with anyone, as this could result in wallet and asset loss.`,
  },
];

const BackupAddressOverlay: React.FC<BackupAddressOverlayProps> = ({
  type,
  walletToBeBackup,
  accountToBeBackup,
  onContinue,
  open,
  onClose,
}) => {
  console.log('BackupAddressOverlay: ', open, walletToBeBackup, accountToBeBackup);
  const [checked, setChecked] = useState(false);

  const handleContinue = useCallback(() => {
    setChecked(false);
    onClose();
    onContinue();
  }, [onClose, onContinue]);

  return (
    <DrawerOrModal
      open={open}
      onClose={onClose}
      className="backup-address-overlay-modal"
      title={<span>Show {type}</span>}
      content={
        <div className="backup-address-overlay-content">
          <div className="backup-address-overlay-notes">
            {notes(type).map((note, idx) => (
              <div className="backup-address-overlay-note" key={idx}>
                <span className="backup-address-overlay-note-icon">{note.icon}</span>
                <span className="backup-address-overlay-note-text">{note.text}</span>
              </div>
            ))}
          </div>
          <div className="backup-address-overlay-check-row">
            <CheckBox
              checked={checked}
              onChange={setChecked}
              label={`I will never share my ${type} with anyone, including the aelf wallet team.`}
              boxStyle={{ marginRight: 0 }}
            />
          </div>
          <CommonButton
            type="primary"
            block
            className="backup-address-overlay-continue-btn"
            disabled={!checked}
            onClick={handleContinue}>
            Continue
          </CommonButton>
        </div>
      }
    />
  );
};

export default BackupAddressOverlay;
