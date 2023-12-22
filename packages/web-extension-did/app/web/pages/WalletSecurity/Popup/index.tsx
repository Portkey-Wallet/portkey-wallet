import BackHeader from 'components/BackHeader';
import CustomSvg from 'components/CustomSvg';
import MenuList from 'pages/components/MenuList';
import { IWalletSecurityProps } from '..';
import './index.less';

export default function WalletSecurityPopup({ headerTitle, goBack, menuList }: IWalletSecurityProps) {
  return (
    <div className="wallet-security-popup min-width-max-height">
      <div className="wallet-security-header">
        <BackHeader
          title={headerTitle}
          leftCallBack={goBack}
          rightElement={<CustomSvg type="Close2" onClick={goBack} />}
        />
      </div>
      <MenuList list={menuList} height={53} />
    </div>
  );
}
