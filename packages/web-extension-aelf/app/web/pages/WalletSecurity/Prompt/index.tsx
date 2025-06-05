import MenuList from 'pages/components/MenuList';
import SecondPageHeader from 'pages/components/SecondPageHeader';
import { Outlet } from 'react-router';
import { IWalletSecurityProps } from '..';
import './index.less';

export default function WalletSecurityPrompt({ headerTitle, menuList }: IWalletSecurityProps) {
  return (
    <div className="wallet-security-prompt flex">
      <div className="wallet-security-prompt-body">
        <SecondPageHeader className="wallet-security-header" paddingLeft={12} title={headerTitle} leftElement={false} />
        <MenuList list={menuList} height={64} />
      </div>
      <Outlet />
    </div>
  );
}
