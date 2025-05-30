import SecondPageHeader from 'pages/components/SecondPageHeader';
import { IAccountCancelationProps } from '../index';
import './index.less';

export default function AccountCancelationPrompt({ headerTitle, goBack, renderContent }: IAccountCancelationProps) {
  return (
    <div className="account-cancelation-prompt">
      <SecondPageHeader title={headerTitle} leftCallBack={goBack} />
      {renderContent}
    </div>
  );
}
