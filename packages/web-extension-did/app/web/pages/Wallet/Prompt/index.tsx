import CustomSvg from 'components/CustomSvg';
import MenuList from 'pages/components/MenuList';
import SecondPageHeader from 'pages/components/SecondPageHeader';
import { IWalletProps, WalletAvatar } from '..';
import ExitWallet from '../components/ExitWallet';
import { Outlet } from 'react-router';
import './index.less';

export default function WalletPrompt({
  headerTitle,
  walletAvatar,
  menuList,
  exitText,
  exitVisible,
  select,
  onExit,
  onCancelExit,
}: IWalletProps) {
  return (
    <div className="wallet-prompt">
      <div className="flex-column-between wallet-prompt-body">
        <div>
          <SecondPageHeader className="wallet-header" title={headerTitle} leftElement={false} paddingLeft={12} />

          <div className="flex-center wallet-icon">
            <CustomSvg type={(walletAvatar as WalletAvatar) || 'master1'} className="flex-center wallet-svg" />
          </div>

          <MenuList list={menuList} isShowSelectedColor selected={select} />
        </div>
        <ExitWallet
          exitText={exitText}
          exitVisible={exitVisible}
          className="exit-btn"
          onExit={onExit}
          onCancelExit={onCancelExit}
        />
      </div>
      <Outlet />
    </div>
  );
}
