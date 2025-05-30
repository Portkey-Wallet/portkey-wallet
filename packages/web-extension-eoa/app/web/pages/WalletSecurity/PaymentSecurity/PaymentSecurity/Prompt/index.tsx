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
  noDataText,
}: IPaymentSecurityProps) {
  return (
    <div className="three-level-prompt-container payment-security-prompt">
      <SecondPageHeader title={headerTitle} leftCallBack={goBack} />
      <div className="payment-security-prompt-body">
        {list.length > 0 && (
          <>
            <PaymentSecurityList list={list} clickItem={clickItem} />
            <LoadingMore hasMore={hasMore} loadMore={loadMore} className="load-more" />
          </>
        )}
        {!list || (list?.length === 0 && <div className="no-data-text">{noDataText}</div>)}
      </div>
    </div>
  );
}
