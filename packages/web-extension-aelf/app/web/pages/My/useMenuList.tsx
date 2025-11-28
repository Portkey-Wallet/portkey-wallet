import { useMemo } from 'react';
import { useCurrentDappList } from '@portkey-wallet/hooks/hooks-eoa/dapp';
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
  const dappList = useCurrentDappList();
  const currentNetwork = useCurrentNetwork();

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
        element: <div className="item-extra-info">{dappList?.length || 0}</div>,
      },
      {
        label: 'Address book',
        icon: 'my_contact',
        router: '/setting/contacts',
      },
      {
        label: 'Switch network',
        icon: 'change',
        router: '/setting/wallet/switch-networks',
        element: (
          <div className="item-extra-info">{currentNetwork === 'MAINNET' ? 'aelf Mainnet' : 'aelf Testnet'}</div>
        ),
      },
      // {
      //   label: 'Help center',
      //   icon: 'my_help',
      //   // router: '/setting/wallet', //  Todo: new website
      //   router: 'https://doc.portkey.finance/help', //  Todo: new website
      // },
      {
        label: 'About FairyVault',
        icon: 'logo-fairy-vault',
        router: '/setting/wallet/about-us',
      },
    ],
    [currentNetwork, dappList?.length],
  );
  return MenuList;
};
