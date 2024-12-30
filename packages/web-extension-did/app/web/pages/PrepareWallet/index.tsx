import PortKeyTitle from 'pages/components/PortKeyTitle';
import { PrepareWalletProgress } from './PrepareWalletProgress';
import CustomSvg from 'components/CustomSvg';
import './index.less';
export interface PrepareWalletProgressInterface {
  complete: () => void;
}
export const PrepareWallet = () => {
  return (
    <div className="prepare-wallet-page flex-column">
      <PortKeyTitle
        hideSubtitle
        leftElement
        renderContent={
          <>
            <CustomSvg type="WelcomeLogo" className="welcome-logo" />
            <PrepareWalletProgress />
          </>
        }
      />
    </div>
  );
};
