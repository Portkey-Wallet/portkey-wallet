import { useNavigateState } from 'hooks/router';
import { CommonButton } from '@portkey/did-ui-react';
import './index.less';
import getStartWallet from './img/getStartWallet.png';

export default function ScreenOpeningPage() {
  const navigate = useNavigateState();

  return (
    <div className="open-page-wrapper">
      <div className="referral-content-wrap">
        <div className="referral-bg-img-wrap">
          <img src={getStartWallet} alt="Get Start Wallet" className="referral-bg-img" />
        </div>
        <h1 className="referral-title">aelf Wallet</h1>
        <div className="referral-desc">Smart. Safe. Seamless. Crypto Wallet.</div>
        <CommonButton className="referral-btn" type="primary" block onClick={() => navigate('/pin/set')}>
          Create a wallet
        </CommonButton>
        <CommonButton className="referral-btn" type="outline" block onClick={() => navigate('/register/import')}>
          Import an existing wallet
        </CommonButton>
      </div>
    </div>
  );
}
