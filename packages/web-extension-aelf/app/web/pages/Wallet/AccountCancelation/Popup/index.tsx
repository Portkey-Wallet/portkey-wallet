import CommonHeader from 'components/CommonHeader';
import { IAccountCancelationProps } from '..';
import './index.less';

export default function AccountCancelationPopup({ headerTitle, goBack, renderContent }: IAccountCancelationProps) {
  return (
    <div className="account-cancelation-popup">
      <CommonHeader title={headerTitle} onLeftBack={goBack} />
      {renderContent}
    </div>
  );
}
