import SecondPageHeader from 'pages/components/SecondPageHeader';
// import { Outlet } from 'react-router';
import './index.less';
import { IPaymentSecurityProps } from '..';
import PaymentSecurityList from '../../components/PaymentSecurityList';
import LoadingMore from 'components/LoadingMore/LoadingMore';

export default function PaymentSecurityPrompt({
  headerTitle,
  goBack,
  list,
  clickItem,
  hasMore,
  loadMore,
}: IPaymentSecurityProps) {
  return (
    <div className="payment-security-prompt">
      <SecondPageHeader title={headerTitle} leftCallBack={goBack} />
      <div className="payment-security-prompt-body">
        <PaymentSecurityList list={list} clickItem={clickItem} />
        <LoadingMore hasMore={hasMore} loadMore={loadMore} className="load-more" />
      </div>
    </div>
  );
}
