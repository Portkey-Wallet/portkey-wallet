import { IPaymentSecurityItem } from '@portkey-wallet/types/types-ca/paymentSecurity';
import CustomSvg from 'components/CustomSvg';
import './index.less';

export default function PaymentSecurityItem({
  item,
  onClick,
}: {
  item: IPaymentSecurityItem;
  onClick: (item: IPaymentSecurityItem) => void;
}) {
  return (
    <div className="flex-row-between payment-security-item" onClick={() => onClick(item)}>
      <div className="flex-center">
        <div>logo</div>
        <div>
          <div>{item.symbol}</div>
          <div>net</div>
        </div>
      </div>
      <CustomSvg type="LeftArrow" className="left-arrow" />
    </div>
  );
}
