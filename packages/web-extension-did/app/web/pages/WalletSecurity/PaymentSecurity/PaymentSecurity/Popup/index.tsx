import CommonHeader from 'components/CommonHeader';
import './index.less';
import { IPaymentSecurityProps } from '..';
import PaymentSecurityList from '../../components/PaymentSecurityList';
import LoadingMore from 'components/LoadingMore/LoadingMore';

export default function PaymentSecurityPopup({
  headerTitle,
  goBack,
  list,
  clickItem,
  hasMore,
  loadMore,
  noDataText,
}: IPaymentSecurityProps) {
  return (
    <div className="payment-security-popup min-width-max-height">
      <CommonHeader className="popup-header-wrap" title={headerTitle} onLeftBack={goBack} />
      <div>
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
