import SecondPageHeader from 'pages/components/SecondPageHeader';
import { BaseHeaderProps } from 'types/UI';
import AllowanceDetail, { IAllowanceDetailProps } from 'pages/WalletSecurity/components/AllowanceDetail';
import './index.less';

export default function TokenAllowanceDetailPrompt({
  headerTitle,
  goBack,
  allowanceDetail,
}: BaseHeaderProps & IAllowanceDetailProps) {
  return (
    <div className="token-allowance-detail-page-prompt flex-column-between">
      <SecondPageHeader title={headerTitle} leftCallBack={goBack} />
      <div className="token-allowance-detail flex-1">
        <AllowanceDetail allowanceDetail={allowanceDetail} />
      </div>
    </div>
  );
}
