import BuyForm from 'pages/Buy/components/BuyForm';
import './index.less';

export default function BuyPage() {
  return (
    // TODO: Adjust style and navigate logic, etc
    // To have the style of BuyForm
    <div className="buy-frame receive-buy-page">
      <div className="buy-content flex-column">
        <BuyForm />
      </div>
    </div>
  );
}
