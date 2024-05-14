import BackHeader from 'components/BackHeader';
import CustomSvg from 'components/CustomSvg';
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
      <div className="token-allowance-detail-header">
        <BackHeader
          title={headerTitle}
          leftCallBack={goBack}
          rightElement={<CustomSvg type="Close2" onClick={goBack} />}
        />
      </div>
      <div className="token-allowance-detail flex-1">
        <AllowanceDetail allowanceDetail={allowanceDetail} />
      </div>
    </div>
  );
}
