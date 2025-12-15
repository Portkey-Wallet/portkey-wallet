import { useMemo } from 'react';
import { useDeviceList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useDapp, useWalletInfo } from 'store/Provider/hooks';
import { useIsSecondaryMailSet } from '@portkey-wallet/hooks/hooks-ca/useSecondaryMail';
import { IconTypeV3 } from '../../types/icon';

export interface IMenuItemInfo {
  label: string;
  icon: IconTypeV3;
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
        icon: 'my_guardians',
        router: '/setting/guardians',
      },
      {
        label: 'Security',
        icon: 'lock',
        router: '/setting/security',
      },
      {
        label: 'Transaction Limits',
        icon: 'my_transaction limit',
        router: '/setting/wallet-security/payment-security',
      },
      {
        label: 'Token allowances',
        icon: 'my_token allowance',
        router: '/setting/wallet-security/token-allowance',
      },
      {
        label: 'Backup email',
        icon: 'my_mail_thin',
        router:
          !fetching && !secondaryEmail
            ? '/setting/wallet-security/secondary-mailbox-edit'
            : '/setting/wallet-security/secondary-mailbox',
        element: <div className="item-extra-info">{!fetching && !secondaryEmail ? `Not Set up` : ''}</div>,
      },
      {
        type: 'divider',
        label: 'divider',
        icon: 'my_guardians',
        router: '',
      },
      // TODO: next version
      // {
      //   label: 'Manage Devices',
      //   icon: 'my_device',
      //   router: '/setting/wallet-security/manage-devices',
      //   element: <div className="item-extra-info">{deviceAmount}</div>,
      // },
      {
        label: 'Connected dApps',
        icon: 'my_connect site',
        router: '/setting/wallet-security/connected-sites',
        element: <div className="item-extra-info">{currentDapp.length}</div>,
      },
      {
        label: 'Address book',
        icon: 'my_contact',
        router: '/setting/contacts',
      },
      {
        type: 'divider',
        label: 'divider',
        icon: 'my_guardians',
        router: '',
      },
      // {
      //   label: 'Switch network',
      //   icon: 'change',
      //   router: '/setting/wallet/switch-networks',
      // },
      {
        type: 'divider',
        label: 'divider',
        icon: 'my_guardians',
        router: '',
      },
      {
        label: 'Help center',
        icon: 'my_help',
        // router: '/setting/wallet', //  Todo: new website
        router: 'https://doc.portkey.finance/help', //  Todo: new website
      },
      {
        label: 'About Portkey',
        icon: 'my_about',
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
