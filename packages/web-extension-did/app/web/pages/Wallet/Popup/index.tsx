import BackHeader from 'components/BackHeader';
import CustomSvg from 'components/CustomSvg';
import MenuList from 'pages/components/MenuList';
import { IWalletProps, WalletAvatar } from '..';
import ExitWallet from '../components/ExitWallet';
import './index.less';

export default function WalletPopup({
  headerTitle,
  walletAvatar,
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

        <div className="flex-center wallet-icon">
          <CustomSvg type={(walletAvatar as WalletAvatar) || 'master1'} className="wallet-svg" />
        </div>

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
