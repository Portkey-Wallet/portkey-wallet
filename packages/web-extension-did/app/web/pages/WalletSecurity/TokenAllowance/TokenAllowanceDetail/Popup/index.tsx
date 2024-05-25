import CommonHeader from 'components/CommonHeader';
import { BaseHeaderProps } from 'types/UI';
import AllowanceDetail, { IAllowanceDetailProps } from 'pages/WalletSecurity/components/AllowanceDetail';
import './index.less';

export default function SiteDetailPopup({
  headerTitle,
  goBack,
  allowanceDetail,
}: BaseHeaderProps & IAllowanceDetailProps) {
  return (
    <div className="token-allowance-detail-page-popup flex-column min-width-max-height">
      <CommonHeader className="popup-header-wrap" title={headerTitle} onLeftBack={goBack} />
      <div className="token-allowance-detail flex-1">
        <AllowanceDetail allowanceDetail={allowanceDetail} />
      </div>
    </div>
  );
}
