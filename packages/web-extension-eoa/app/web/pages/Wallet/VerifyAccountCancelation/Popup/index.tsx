import { IVerifyAccountCancel } from '..';
import CommonHeader from 'components/CommonHeader';
import './index.less';

export default function VerifyAccountCancelPopup({ headerTitle = '', onBack, renderContent }: IVerifyAccountCancel) {
  return (
    <div className="verify-account-cancel-popup">
      <CommonHeader title={headerTitle} onLeftBack={onBack} />
      {renderContent}
    </div>
  );
}
