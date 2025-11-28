import React from 'react';
import { DrawerOrModal } from 'components/DrawerOrModal/DrawerOrModalV2';
import LockPage from '../LockPage';
import './index.less';

export interface UnlockOverlayProps {
  onUnLockHandler?: (pwd: string) => void;
  open: boolean;
  onClose: () => void;
}

export const UnlockOverlay: React.FC<UnlockOverlayProps> = ({ onUnLockHandler, open, onClose }) => {
  return (
    <DrawerOrModal
      open={open}
      onClose={onClose}
      className="unlock-overlay-modal"
      title=""
      content={<LockPage onUnLockHandler={onUnLockHandler} />}
    />
  );
};
