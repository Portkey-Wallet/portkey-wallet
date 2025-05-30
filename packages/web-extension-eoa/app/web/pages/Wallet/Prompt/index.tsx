import MenuList from 'pages/components/MenuList';
import SecondPageHeader from 'pages/components/SecondPageHeader';
import { IWalletProps } from '..';
import ExitWallet from '../components/ExitWallet';
import { Outlet } from 'react-router';
import './index.less';
import WalletEntry from '../components/WalletEntry';

export default function WalletPrompt({
  headerTitle,
  walletAvatar,
  walletName,
  portkeyId,
  clickAvatar,
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

          <WalletEntry
            walletAvatar={walletAvatar}
            walletName={walletName}
            portkeyId={portkeyId}
            clickAvatar={clickAvatar}
          />

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
