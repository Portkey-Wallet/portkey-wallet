import { PrepareWalletProgress } from './PrepareWalletProgress';
import CustomSvg from 'components/CustomSvg';
import './index.less';
export interface PrepareWalletProgressInterface {
  complete: () => void;
}
export const PrepareWallet = () => {
  return (
    <div className="flex-1 prepare-wallet-page flex-column-center ">
      <div className="flex-column prepare-wallet-content">
        <CustomSvg type="WelcomeLogo" className="welcome-logo" />
        <PrepareWalletProgress />
      </div>
    </div>
  );
};
