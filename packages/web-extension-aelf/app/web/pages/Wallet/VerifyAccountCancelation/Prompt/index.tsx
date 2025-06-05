import { IVerifyAccountCancel } from '..';
import SecondPageHeader from 'pages/components/SecondPageHeader';
import './index.less';

export default function VerifyAccountCancelPrompt({ headerTitle = '', onBack, renderContent }: IVerifyAccountCancel) {
  return (
    <div className="verify-account-cancel-prompt">
      <SecondPageHeader title={headerTitle} leftCallBack={onBack} />
      {renderContent}
    </div>
  );
}
