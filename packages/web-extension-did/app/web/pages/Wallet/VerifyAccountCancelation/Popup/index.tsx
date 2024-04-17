import { IVerifyAccountCancel } from '..';
import BackHeader from 'components/BackHeader';
import './index.less';

export default function VerifyAccountCancelPopup({ headerTitle = '', onBack, renderContent }: IVerifyAccountCancel) {
  return (
    <div className="verify-account-cancel-popup">
      <BackHeader title={headerTitle} leftCallBack={onBack} />
      {renderContent}
    </div>
  );
}
