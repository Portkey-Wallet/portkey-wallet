import CommonHeader from 'components/CommonHeader';
import MenuList from 'pages/components/MenuList';
import { IWalletSecurityProps } from '..';
import './index.less';

export default function WalletSecurityPopup({ headerTitle, goBack, menuList }: IWalletSecurityProps) {
  return (
    <div className="wallet-security-popup min-width-max-height">
      <CommonHeader title={headerTitle} onLeftBack={goBack} />
      <MenuList list={menuList} height={53} />
    </div>
  );
}
