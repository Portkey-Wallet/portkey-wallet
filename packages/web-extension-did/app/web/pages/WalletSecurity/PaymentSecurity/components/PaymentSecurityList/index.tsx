import { IPaymentSecurityItem } from '@portkey-wallet/types/types-ca/paymentSecurity';
import { List } from 'antd-mobile';
import PaymentSecurityItem from '../PaymentSecurityItem';
import './index.less';

export default function PaymentSecurityList({
  list,
  clickItem,
}: {
  list: IPaymentSecurityItem[];
  clickItem: (item: IPaymentSecurityItem) => void;
}) {
  return (
    <List className="payment-security-list">
      {list?.map((item, index) => (
        <List.Item key={`paymentSecurity_${item.chainId}_${index}`} className="payment-security-item-wrap">
          <PaymentSecurityItem item={item} onClick={clickItem} />
        </List.Item>
      ))}
    </List>
  );
}
