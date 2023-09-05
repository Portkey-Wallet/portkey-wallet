import { request } from '@portkey-wallet/api/api-did';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { Image, message } from 'antd';
import CustomModal from 'pages/components/CustomModal';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

export const useCheckSecurity = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const wallet = useCurrentWalletInfo();

  return useCallback(async (): Promise<boolean | object> => {
    try {
      const res: { isSafe: boolean } = await request.security.balanceCheck({
        params: { caHash: wallet?.caHash || '' },
      });

      if (res?.isSafe) return true;

      return CustomModal({
        type: 'confirm',
        content: (
          <div className="security-modal">
            <Image
              width={180}
              height={108}
              src="assets/images/securityTip.png"
              className="modal-logo"
              preview={false}
            />
            <div className="modal-title">{t('Low wallet security level')}</div>
            <div>
              {t('Please promptly increase the security level of your wallet and add the number of guardians.')}
            </div>
          </div>
        ),
        cancelText: t('Not Now'),
        okText: t('Add Guardians'),
        onOk: () => navigate('/setting/guardians'),
      });
    } catch (error) {
      const msg = handleErrorMessage(error, 'Balance Check Error');
      throw message.error(msg);
    }
  }, [navigate, t, wallet?.caHash]);
};
