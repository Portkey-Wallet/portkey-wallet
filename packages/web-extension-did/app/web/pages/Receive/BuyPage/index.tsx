import BuyForm from 'pages/Buy/components/BuyForm';
import './index.less';
import { useLocation } from 'react-router';
import { ReceiveTabEnum } from '@portkey-wallet/constants/constants-ca/send';

export default function BuyPage() {
  const { pathname, state } = useLocation();

  return (
    <div className="buy-frame receive-buy-page">
      <div className="buy-content flex-column">
        <BuyForm mainPageInfo={{ pathname, state, receivePageSide: ReceiveTabEnum.Buy, tokenInfo: state }} />
      </div>
    </div>
  );
}
