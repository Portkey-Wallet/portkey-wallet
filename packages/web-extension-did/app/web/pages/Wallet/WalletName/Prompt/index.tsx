import SecondPageHeader from 'pages/components/SecondPageHeader';
import { BaseHeaderProps } from 'types/UI';
import SetWalletNameForm from '../../components/SetWalletNameForm';
import './index.less';

export default function WalletNamePrompt({ headerTitle, goBack }: BaseHeaderProps) {
  return (
    <div className="wallet-name-prompt">
      <SecondPageHeader title={headerTitle} leftCallBack={goBack} />
      <SetWalletNameForm />
    </div>
  );
}
