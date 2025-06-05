import CommonHeader from 'components/CommonHeader';
import MenuList from 'pages/components/MenuList';
import { IWalletProps } from '..';
import ExitWallet from '../components/ExitWallet';
import './index.less';
import WalletEntry from '../components/WalletEntry';

export default function WalletPopup({
  headerTitle,
  walletAvatar,
  walletName,
  portkeyId,
  clickAvatar,
  menuList,
  exitText,
  exitVisible,
  goBack,
  onExit,
  onCancelExit,
}: IWalletProps) {
  return (
    <div className="flex-column wallet-popup min-width-max-height">
      <div>
        <CommonHeader title={headerTitle} onLeftBack={goBack} />

        <WalletEntry
          walletAvatar={walletAvatar}
          walletName={walletName}
          portkeyId={portkeyId}
          clickAvatar={clickAvatar}
        />
        <div className="empty-placeholder" />

        <MenuList list={menuList} />
      </div>
      <ExitWallet
        exitText={exitText}
        exitVisible={exitVisible}
        className="exit-btn"
        onExit={onExit}
        onCancelExit={onCancelExit}
      />
    </div>
  );
}
