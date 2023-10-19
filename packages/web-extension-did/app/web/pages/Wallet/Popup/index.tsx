import BackHeader from 'components/BackHeader';
import CustomSvg from 'components/CustomSvg';
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
        <div className="wallet-title">
          <BackHeader
            title={headerTitle}
            leftCallBack={goBack}
            rightElement={<CustomSvg type="Close2" onClick={goBack} />}
          />
        </div>

        <WalletEntry
          walletAvatar={walletAvatar}
          walletName={walletName}
          portkeyId={portkeyId}
          clickAvatar={clickAvatar}
        />

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
