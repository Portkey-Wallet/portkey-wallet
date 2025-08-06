import { useMemo } from 'react';
import { useDapp } from 'store/Provider/hooks';
import { useCurrentNetwork } from '@portkey-wallet/hooks/hooks-eoa/network';
import { IconTypeV3 } from '../../types/icon';

export interface IMenuItemInfo {
  label: string;
  icon: IconTypeV3;
  router: string;
  element?: JSX.Element;
  type?: string;
}

export const useMenuList = () => {
  // Connected dApps
  const currentNetwork = useCurrentNetwork();
  const { dappMap } = useDapp();
  const currentDapp = useMemo(() => dappMap[currentNetwork] || [], [currentNetwork, dappMap]);

  const MenuList: IMenuItemInfo[] = useMemo(
    () => [
      {
        label: 'Security',
        icon: 'lock',
        router: '/setting/security',
      },
      {
        label: 'Wallet management',
        icon: 'wallet thin',
        router: '/wallet/manage?backTo=setting',
      },
      // {
      //   type: 'divider',
      //   label: 'divider',
      //   icon: 'my_guardians',
      //   router: '',
      // },
      {
        label: 'Connected dApps',
        icon: 'my_connect site',
        router: '/setting/wallet-security/connected-sites',
        element: <div className="item-extra-info">{currentDapp.length}</div>,
      },
      // TODO: to be added in the future
      // {
      //   label: 'Address book',
      //   icon: 'my_contact',
      //   router: '/setting/contacts',
      // },
      {
        label: 'Switch network',
        icon: 'change',
        router: '/setting/wallet/switch-networks',
      },
      // {
      //   label: 'Help center',
      //   icon: 'my_help',
      //   // router: '/setting/wallet', //  Todo: new website
      //   router: 'https://doc.portkey.finance/help', //  Todo: new website
      // },
      {
        label: 'About FairyVault',
        icon: 'my_about',
        router: '/setting/wallet/about-us',
      },
    ],
    [currentDapp.length],
  );
  return MenuList;
};
