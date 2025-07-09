import { useCallback } from 'react';
import { useState } from 'react';
import CustomModal from 'pages/components/CustomModal';
import CustomPassword from 'components/CustomPassword';
import { CommonButton } from '@portkey/did-ui-react';
import { useCurrentWallet } from '@portkey-wallet/hooks/hooks-eoa/wallet';
import './useUnlockModal.less';
import getPrivateKeyAndMnemonic from 'utils/Wallet/getPrivateKeyAndMnemonic';

/**
 * useUnlockModal
 * 弹窗输入密码解锁，支持自定义标题和回调
 * @returns showUnlockModal({ title, callback })
 */
export const useUnlockModal = () => {
  const walletInfo = useCurrentWallet();

  const showUnlockModal = useCallback(
    ({
      title = 'Enter Password',
      callback,
    }: {
      title?: string;
      callback: (password: string, mnemonic: string) => void;
    }) => {
      const UnlockContent = () => {
        const [password, setPassword] = useState('');
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState('');

        const handleUnlock = async () => {
          setLoading(true);
          setError('');
          try {
            if (walletInfo?.AESEncryptMnemonic && password) {
              const res = await getPrivateKeyAndMnemonic(walletInfo, password);
              if (!res?.mnemonic) {
                setError('No mnemonic');
              } else {
                callback(password, res.mnemonic);
                modal.destroy();
              }
            } else {
              setError('No mnemonic');
            }
          } catch (e: any) {
            setError('Unlock failed');
          } finally {
            setLoading(false);
          }
        };

        return (
          <div className="unlock-modal-content">
            <div className="unlock-modal-title">{title}</div>
            <CustomPassword
              className="unlock-modal-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoFocus
            />
            {error && <div className="unlock-modal-error">{error}</div>}
            <CommonButton
              type="primary"
              className="unlock-modal-btn"
              loading={loading}
              block
              onClick={handleUnlock}
              disabled={!password || loading}>
              Unlock
            </CommonButton>
          </div>
        );
      };

      const modal = CustomModal({
        type: 'info',
        className: 'unlock-modal',
        icon: null,
        closable: true,
        maskClosable: true,
        content: <UnlockContent />,
        okButtonProps: { style: { display: 'none' } },
        onCancel: () => {
          modal.destroy();
        },
      });
    },
    [],
  );

  return { showUnlockModal };
};
