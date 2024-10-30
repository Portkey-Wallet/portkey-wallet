import { useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDeviceList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { MenuItemInfo } from 'pages/components/MenuList';
import { BaseHeaderProps } from 'types/UI';
import WalletSecurityPrompt from './Prompt';
import WalletSecurityPopup from './Popup';
import { useCommonState, useDapp, useWalletInfo } from 'store/Provider/hooks';
import { useNavigateState } from 'hooks/router';
import { useIsSecondaryMailSet } from '@portkey-wallet/hooks/hooks-ca/useSecondaryMail';

export interface IWalletSecurityProps extends BaseHeaderProps {
  menuList: MenuItemInfo[];
}

export default function WalletSecurity() {
  const { t } = useTranslation();
  const navigate = useNavigateState();
  const { isNotLessThan768 } = useCommonState();
  const { deviceAmount } = useDeviceList({
    isAmountOnly: true,
  });
  const { currentNetwork } = useWalletInfo();
  const { dappMap } = useDapp();
  const currentDapp = useMemo(() => dappMap[currentNetwork] || [], [currentNetwork, dappMap]);
  const { secondaryEmail, fetching } = useIsSecondaryMailSet();

  const MenuListData: MenuItemInfo[] = useMemo(
    () => [
      {
        key: t('Login Devices'),
        element: (
          <div className="flex manage-device">
            <span>{t('Login Devices')}</span>
            <span className="number">{deviceAmount}</span>
          </div>
        ),
        click: () => {
          navigate('/setting/wallet-security/manage-devices');
        },
      },
      {
        key: t('Connected Sites'),
        element: (
          <div className="flex connected-sites">
            <span>{t('Connected Sites')}</span>
            <span className="number">{currentDapp.length}</span>
          </div>
        ),
        click: () => {
          navigate('/setting/wallet-security/connected-sites');
        },
      },
      {
        key: t('Payment Security'),
        element: (
          <div className="flex connected-sites">
            <span>{t('Payment Security')}</span>
          </div>
        ),
        click: () => {
          navigate('/setting/wallet-security/payment-security');
        },
      },
      {
        key: t('Token Allowance'),
        element: (
          <div className="flex token-allowance">
            <span>{t('Token Allowance')}</span>
          </div>
        ),
        click: () => {
          navigate('/setting/wallet-security/token-allowance');
        },
      },
      {
        key: t('Set up Backup Mailbox'),
        element: (
          <div className="flex secondary-mailbox">
            <span>{t('Set up Backup Mailbox')}</span>
            <span className="number">{!fetching && !secondaryEmail ? `Not Set up` : ''}</span>
          </div>
        ),
        click: () => {
          navigate('/setting/wallet-security/secondary-mailbox');
        },
      },
    ],
    [currentDapp.length, deviceAmount, fetching, navigate, secondaryEmail, t],
  );

  const title = t('Wallet Security');
  const goBack = useCallback(() => navigate('/setting'), [navigate]);

  return isNotLessThan768 ? (
    <WalletSecurityPrompt headerTitle={title} menuList={MenuListData} />
  ) : (
    <WalletSecurityPopup headerTitle={title} menuList={MenuListData} goBack={goBack} />
  );
}
