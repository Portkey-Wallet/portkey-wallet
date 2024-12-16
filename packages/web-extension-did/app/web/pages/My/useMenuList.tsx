import { useMemo } from 'react';
import { useDeviceList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useDapp, useWalletInfo } from 'store/Provider/hooks';
import { useIsSecondaryMailSet } from '@portkey-wallet/hooks/hooks-ca/useSecondaryMail';
import { IconType } from '../../types/icon';

export interface IMenuItemInfo {
  label: string;
  icon: IconType;
  router: string;
  element?: JSX.Element;
  type?: string;
}

export const useMenuList = () => {
  const { secondaryEmail, fetching } = useIsSecondaryMailSet();

  // Mange devices
  const { deviceAmount } = useDeviceList({
    isAmountOnly: true,
  });

  // Connected dApps
  const { currentNetwork } = useWalletInfo();
  const { dappMap } = useDapp();
  const currentDapp = useMemo(() => dappMap[currentNetwork] || [], [currentNetwork, dappMap]);

  const MenuList: IMenuItemInfo[] = useMemo(
    () => [
      {
        label: 'Guardians',
        icon: 'Guardians',
        router: '/setting/guardians',
      },
      {
        label: 'Security',
        icon: 'Guardians',
        router: '/setting/security',
      },
      {
        label: 'Transaction Limits',
        icon: 'Guardians',
        router: '/setting/wallet-security/payment-security',
      },
      {
        label: 'Token allowances',
        icon: 'Guardians',
        router: '/setting/wallet-security/token-allowance',
      },
      {
        label: 'Backup email',
        icon: 'Guardians',
        router: '/setting/wallet-security/token-allowance',
        element: <div className="item-extra-info">{!fetching && !secondaryEmail ? `Not Set up` : ''}</div>,
      },
      {
        type: 'divider',
        label: 'divider',
        icon: 'Guardians',
        router: '',
      },
      {
        label: 'Manage Devices',
        icon: 'Wallet',
        router: '/setting/wallet-security/manage-devices',
        element: <div className="item-extra-info">{deviceAmount}</div>,
      },
      {
        label: 'Connected dApps',
        icon: 'Wallet',
        router: '/setting/wallet-security/connected-sites',
        element: <div className="item-extra-info">{currentDapp.length}</div>,
      },
      {
        label: 'Address book',
        icon: 'Wallet',
        router: '/setting/contacts',
      },
      {
        type: 'divider',
        label: 'divider',
        icon: 'Guardians',
        router: '',
      },
      {
        label: 'Switch network',
        icon: 'Wallet',
        router: '/setting/wallet/switch-networks',
      },
      {
        type: 'divider',
        label: 'divider',
        icon: 'Guardians',
        router: '',
      },
      {
        label: 'Help center',
        icon: 'Wallet',
        // router: '/setting/wallet', //  Todo: new website
        router: 'https://doc.portkey.finance/help', //  Todo: new website
      },
      {
        label: 'About Portkey',
        icon: 'Wallet',
        router: '/setting/wallet/about-us',
      },
      // {
      //   label: 'Check for updates',
      //   icon: 'Wallet',
      //   router: '', // Todo: ??? do or not.
      // },
    ],
    [currentDapp.length, deviceAmount, fetching, secondaryEmail],
  );
  return MenuList;
};
