import CommonHeader from 'components/CommonHeader';
import './index.less';
import { IPaymentSecurityProps } from '..';
import PaymentSecurityList from '../../components/PaymentSecurityList';
import LoadingMore from 'components/LoadingMore/LoadingMore';
import CircleLoading from '../../../../../components/CircleLoading';

export default function PaymentSecurityPopup({
  headerTitle,
  goBack,
  list,
  clickItem,
  hasMore,
  loadMore,
  noDataText,
  fetching,
}: IPaymentSecurityProps) {
  const noDataLoading = fetching && (!list || list.length === 0);
  return (
    <div className="payment-security-popup min-width-max-height">
      <CommonHeader className="popup-header-wrap" title={headerTitle} onLeftBack={goBack} />
      <div>
        {noDataLoading && (
          <div className="loading-container flex-center">
            <CircleLoading width={32} height={32} />
          </div>
        )}
        {!noDataLoading && list.length > 0 && (
          <>
            <PaymentSecurityList list={list} clickItem={clickItem} />
            <LoadingMore hasMore={hasMore} loadMore={loadMore} className="load-more" />
          </>
        )}
        {!noDataLoading && (!list || (list?.length === 0 && <div className="no-data-text">{noDataText}</div>))}
      </div>
    </div>
  );
}
