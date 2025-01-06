import { PrepareWalletProgress } from './PrepareWalletProgress';
import './index.less';
import { CustomSvgV3 } from 'components/CustomSvgV3';
export interface PrepareWalletProgressInterface {
  complete: () => void;
}
export const PrepareWallet = () => {
  return (
    <div className="flex-1 prepare-wallet-page flex-column-center ">
      <div className="flex-column prepare-wallet-content">
        <CustomSvgV3 type="Prepare" className="welcome-logo" />
        <PrepareWalletProgress />
      </div>
    </div>
  );
};
